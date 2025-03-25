import {
  Alert,
  Animated,
  BackHandler,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import {FlatList} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';

const srNumber: number = 5;
const row = {
  sr: srNumber.toString(),
};

interface Download {
  id: number;
  cls_name: string;
  sec_name: string;
  cand_name: string;
  bra_name: string;
  file_title: string;
  file_date: string;
  file_notes: string;
}

const ParentDownload = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [downloadData, setDownloadData] = useState<Download[]>([]);

  const items = [
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const [filteredDownloadData, setFilteredDownloadData] =
    useState(downloadData);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
    if (text === '') {
      setFilteredDownloadData(downloadData);
    } else {
      const filtered = downloadData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(text.toLowerCase()),
        ),
      );
      setFilteredDownloadData(filtered);
    }
  };

  const totalPages = Math.ceil(filteredDownloadData.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentEntries = filteredDownloadData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  const handleDownload = async (url: any) => {
    try {
      const fileName = url.split('/').pop();
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
      };

      const download = RNFS.downloadFile(options);

      download.promise.then(response => {
        if (response.statusCode === 200) {
          Alert.alert('Success', `File downloaded to ${downloadDest}`);
        } else {
          Alert.alert('Error', 'Failed to download file');
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'An error occurred while downloading the file');
    }
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchparentdownload',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDownloadData(response.data.file);
        setFilteredDownloadData(response.data.file);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not suthenticated');
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    fetchData();
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {transform: [{translateY: moveAnim}]},
        ]}>
        <ImageBackground
          resizeMode="cover"
          style={styles.backgroundImage}
          source={require('../../assets/bgimg.jpg')}
        />
      </Animated.View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Download Material</Text>
      </View>
      <FlatList
        style={{marginBottom: 20}}
        data={downloadData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{item.cand_name}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {formatDate(item.file_date)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#3b82f6'}}>{item.file_title}</Text>
              <Image
                style={styles.actionIcon}
                source={require('../../assets/dpd.png')}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ParentDownload;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    marginBottom: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: 'white',
    marginLeft: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    top: 5,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '1%',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  animatedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});
