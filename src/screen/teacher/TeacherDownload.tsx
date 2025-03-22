import {
  Alert,
  BackHandler,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';

interface Download {
  id: number;
  file_date: string;
  cls_name: string;
  sec_name: string;
  file_title: string;
  file_notes: string;
}

const TeacherDownload = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [downloadData, setDownloadData] = useState<Download[]>([]);
  const [filteredDownloadData, setFilteredDownloadData] =
    useState(downloadData);

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
          'https://demo.capobrain.com/staff_fetchstafffiles',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setFilteredDownloadData(response.data.files);
        setDownloadData(response.data.files);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
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
                <Text style={[styles.column, styles.headTable, {width: 200}]}>
                  Title
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Date
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
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
                <Text style={[styles.column, {width: 200}]}>
                  {item.file_title}
                </Text>
                <Text style={[styles.column, {width: 150}]}>
                  {formatDate(item.file_date)}
                </Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    downloadFile(
                      `https://demo.capobrain.com/files_download/${item.file_notes}`,
                    );
                  }}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/dpd.png')}
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

export default TeacherDownload;

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
    textAlign: 'center',
    color: 'gray',
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
    width: 60,
    height: 20,
  },
  actionIcon: {
    width: 17,
    height: 17,
    tintColor: '#3b82f6',
    marginLeft: 90,
  },
});
