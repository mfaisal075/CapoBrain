import {
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

const srNumber: number = 5;
const row = {
  sr: srNumber.toString(),
};

type TableRow = {
  sr: string | number;
  class: string;
  section: string;
  title: string;
  date: string;
  action: string;
};

const TeacherDownload = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [downloadData, setDownloadData] = useState<TableRow[]>([
    {
      sr: 1,
      class: 'Ten',
      section: 'A',
      title: 'Algebra',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 2,
      class: 'Ten',
      section: 'A',
      title: 'ABC',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 3,
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 4,
      class: 'Ten',
      section: 'A',
      title: 'MMMMMM',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 5,
      class: 'Ten',
      section: 'A',
      title: 'Text title 1',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 6,
      class: 'Ten',
      section: 'A',
      title: 'o0o0o',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 7,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 8,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 9,
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 10,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 11,
      class: 'Ten',
      section: 'A',
      title: 'Pakistan',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 12,
      class: 'Ten',
      section: 'A',
      title: 'India',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 13,
      class: 'Ten',
      section: 'A',
      title: 'Algebra',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 14,
      class: 'Ten',
      section: 'A',
      title: 'ABC',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 15,
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 16,
      class: 'Ten',
      section: 'A',
      title: 'MMMMMM',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 17,
      class: 'Ten',
      section: 'A',
      title: 'Text title 1',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 18,
      class: 'Ten',
      section: 'A',
      title: 'o0o0o',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 19,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 20,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 21,
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 22,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 23,
      class: 'Ten',
      section: 'A',
      title: 'Pakistan',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 24,
      class: 'Ten',
      section: 'A',
      title: 'India',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 25,
      class: 'Ten',
      section: 'A',
      title: 'Algebra',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 26,
      class: 'Ten',
      section: 'A',
      title: 'ABC',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 27,
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 28,
      class: 'Ten',
      section: 'A',
      title: 'MMMMMM',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 29,
      class: 'Ten',
      section: 'A',
      title: 'Text title 1',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: 30,
      class: 'Ten',
      section: 'A',
      title: 'o0o0o',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 31,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 32,
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
  ]);
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
        return response.data.output;
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
              <Text style={styles.item}>{item.title}</Text>
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
                <Text style={[styles.column, {width: 100}]}>{item.sr}</Text>
                <Text style={[styles.column, {width: 150}]}>{item.class}</Text>
                <Text style={[styles.column, {width: 150}]}>
                  {item.section}
                </Text>
                <Text style={[styles.column, {width: 200}]}>{item.title}</Text>
                <Text style={[styles.column, {width: 150}]}>{item.date}</Text>
                <TouchableOpacity style={styles.iconContainer}>
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
    width: 60,
    height: 30,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
    marginLeft: 90,
  },
});
