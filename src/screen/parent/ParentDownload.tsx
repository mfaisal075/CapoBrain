import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import {FlatList} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const srNumber: number = 5;
const row = {
  sr: srNumber.toString(),
};

type TableRow = {
  sr: string | number;
  branch: string;
  class: string;
  section: string;
  student: string;
  title: string;
  date: string;
  action: string;
};

const ParentDownload = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [downloadData, setDownloadData] = useState<TableRow[]>([
    {
      sr: 1,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Ahmad Raza',
      title: 'BB',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 2,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Muhammad Raza',
      title: 'BB',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 3,
      branch: 'Main Branch',
      class: 'Eight',
      section: 'A',
      student: 'Saba',
      title: 'BB',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 4,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Ahmad Raza',
      title: 'Algebra',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 5,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Muhammad Raza',
      title: 'Algebra',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 6,
      branch: 'Main Branch',
      class: 'Eight',
      section: 'A',
      student: 'Saba',
      title: 'Algebra',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: 7,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Ahmad Raza',
      title: 'Algebra',
      date: '31-12-2024',
      action: 'Download',
    },
    {
      sr: 8,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Muhammad Raza',
      title: 'Algebra',
      date: '31-12-2024',
      action: 'Download',
    },
    {
      sr: 9,
      branch: 'Main Branch',
      class: 'Eight',
      section: 'A',
      student: 'Saba',
      title: 'Algebra',
      date: '31-12-2024',
      action: 'Download',
    },
    {
      sr: 10,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Ahmad Raza',
      title: 'Everyone',
      date: '30-01-2025',
      action: 'Download',
    },
    {
      sr: 11,
      branch: 'Main Branch',
      class: 'Two',
      section: 'A',
      student: 'Muhammad Raza',
      title: 'Everyone',
      date: '31-12-2024',
      action: 'Download',
    },
    {
      sr: 12,
      branch: 'Main Branch',
      class: 'Eight',
      section: 'A',
      student: 'Saba',
      title: 'Everyone',
      date: '30-01-2025',
      action: 'Download',
    },
  ]);

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
        return response.data.output;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not suthenticated');
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
            style={{marginHorizontal: 10}}
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
                  Branch
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Class
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
                  Section
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 200}]}>
                  Student
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 150}]}>
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
                <Text style={[styles.column, {width: 150}]}>{item.branch}</Text>
                <Text style={[styles.column, {width: 150}]}>{item.class}</Text>
                <Text style={[styles.column, {width: 150}]}>
                  {item.section}
                </Text>
                <Text style={[styles.column, {width: 200}]}>
                  {item.student}
                </Text>
                <Text style={[styles.column, {width: 150}]}>{item.title}</Text>
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

export default ParentDownload;

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
