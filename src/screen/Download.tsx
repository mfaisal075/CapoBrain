import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useUser} from '../Ctx/UserContext';
import {FlatList} from 'react-native';
import {TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';

const srNumber: number = 5;
const row = {
  sr: srNumber.toString(),
};

interface DownloadData {
  id: number;
  cls_name: string;
  sec_name: string;
  file_date: string;
  file_title: string;
  file_notes: string;
}

const Download = ({navigation}: any) => {
  const {token} = useUser();
  const [downloadData, setDownloadData] = useState<DownloadData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDownloadData, setFilteredDownloadData] =
    useState(downloadData);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

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

  const downloadFile = async (url: any) => {
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
          `https://demo.capobrain.com/files_fetchstdfiles?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setDownloadData(response.data.files);
        setFilteredDownloadData(response.data.files);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Download Material</Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: 80, marginTop: 9}}>
            <DropDownPicker
              items={items}
              open={isOpen}
              setOpen={setIsOpen}
              value={entriesPerPage}
              setValue={val => val && setEntriesPerPage(val)}
              maxHeight={200}
              placeholder=""
              style={{
                borderWidth: 1,
                borderColor: '#d5d5d9',
                borderRadius: 5,
                minHeight: 30,
                marginLeft: hp('1%'),
              }}
            />
          </View>
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={'gray'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredDownloadData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Text style={styles.item}>{item.file_title}</Text>
            )}
          />
        </View>
      </View>

      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={{margin: 10, flex: 1}}
            data={currentEntries}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View style={styles.row}>
                <Text style={[styles.column, styles.headTable, {width: 100}]}>
                  Sr#
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Class
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Section
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Title
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Date
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 100}]}>
                  Actions
                </Text>
              </View>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={[styles.column, {width: 100}]}>{index + 1}</Text>
                <Text style={[styles.column, {width: 150}]}>
                  {item.cls_name}
                </Text>
                <Text style={[styles.column, {width: 150}]}>
                  {item.sec_name}
                </Text>
                <Text style={[styles.column, {width: 150}]}>
                  {item.file_title}
                </Text>
                <Text style={[styles.column, {width: 150}]}>
                  {item.file_date}
                </Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() =>
                    downloadFile(
                      `https://demo.capobrain.com/files_download/${item.file_notes}`,
                    )
                  }>
                  <Image
                    style={styles.actionIcon}
                    source={require('../assets/dpd.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
        }}>
        <Text>
          Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
          {Math.min(currentPage * entriesPerPage, downloadData.length)} of{' '}
          {downloadData.length} entries
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
            <Text style={{fontWeight: 'bold'}}>Previous</Text>
          </TouchableOpacity>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 2,
              backgroundColor: '#3b82f6',
              marginLeft: 10,
              marginRight: 10,
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              {currentPage}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
            <Text style={{fontWeight: 'bold'}}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Download;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    marginBottom: 5,
    borderRadius: 4,
    textAlign:'center',
    color:'gray'
  },
  item: {
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: '33.33%',
    textAlign: 'center',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
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
    width: 30,
    height: 20,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    top: -1,
    marginLeft: 70,
  },
});
