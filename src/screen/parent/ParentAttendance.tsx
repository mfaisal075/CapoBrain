import {
  BackHandler,
  Dimensions,
  Image,
  RefreshControl,
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  student: string;
  class: string;
  section: string;
  status: string;
  date: string;
};

const ParentAttendance = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const originalData: TableRow[] = [
    {
      sr: '1',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
    },
    {
      sr: '2',
      student: 'Nayab Fatimah',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
    },
    {
      sr: '3',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '16-11-2024',
    },
    {
      sr: '4',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '16-11-2024',
    },
    {
      sr: '5',
      student: 'Nayab Fatimah',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '18-11-2024',
    },
    {
      sr: '6',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '19-11-2024',
    },
    {
      sr: '7',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '20-11-2024',
    },
    {
      sr: '8',
      student: 'Nayab Fatimah',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '21-11-2024',
    },
    {
      sr: '9',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '22-11-2024',
    },
    {
      sr: '10',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '23-11-2024',
    },
    {
      sr: '11',
      student: 'Nayab Fatimah',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '24-11-2024',
    },
    {
      sr: '12',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '26-11-2024',
    },
    {
      sr: '13',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '28-11-2024',
    },
    {
      sr: '14',
      student: 'Nayab Fatimah',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '30-11-2024',
    },
    {
      sr: '15',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '1-12-2024',
    },
    {
      sr: '16',
      student: 'Ayesha Zumar',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '4-12-2024',
    },
    {
      sr: '17',
      student: 'Nayab Fatimah',
      class: 'Nursery',
      section: 'A',
      status: 'Present',
      date: '14-12-2024',
    },
  ];

  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  const items = [
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setTableData(originalData);
    } else {
      const filtered = originalData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(text.toLowerCase()),
        ),
      );
      setTableData(filtered);
    }
  };

  const totalPages = Math.ceil(tableData.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentEntries = tableData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchchildrenattendance',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // setUserData(response.data);

        return response.data.output;
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
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
        <Text style={styles.headerText}>Attendance</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View style={{width: 80, marginTop: 9}}>
          <DropDownPicker
            items={items}
            open={isOpen}
            setOpen={setIsOpen}
            value={entriesPerPage}
            setValue={callback => {
              setEntriesPerPage(prev =>
                typeof callback === 'function' ? callback(prev) : callback,
              );
            }}
            maxHeight={200}
            placeholder=""
            style={styles.dropdown}
          />
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={'gray'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Table */}
      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={styles.flatList}
            data={currentEntries}
            keyExtractor={(item, index) =>
              item.sr ? item.sr.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {['Sr#', 'Student', 'Class', 'Section', 'Status', 'Date'].map(
                  header => (
                    <Text
                      key={header}
                      style={[styles.column, styles.headTable]}>
                      {header}
                    </Text>
                  ),
                )}
              </View>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={styles.column}>{item.sr}</Text>
                <Text style={styles.column}>{item.student}</Text>
                <Text style={styles.column}>{item.class}</Text>
                <Text style={styles.column}>{item.section}</Text>
                <Text style={styles.column}>{item.status}</Text>
                <Text style={styles.column}>{item.date}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <Text>
          Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
          {Math.min(currentPage * entriesPerPage, tableData.length)} of{' '}
          {tableData.length} entries
        </Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          <View style={styles.pageNumber}>
            <Text style={styles.pageText}>{currentPage}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ParentAttendance;

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
    borderRadius: 4,
    textAlign:'center',
    color:'gray'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 140,
    padding: 1,
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
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  paginationText: {
    fontWeight: 'bold',
  },
  pageNumber: {
    width: 22,
    height: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  pageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatList: {
    margin: 10,
    flex: 1,
  },
});
