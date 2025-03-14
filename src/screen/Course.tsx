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
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TableRow {
  sr: string;
  title: string;
  class: string;
  section: string;
  price: string;
  action: string;
}

const Course = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const originalData: TableRow[] = [
    {sr: '', title: '', class: '', section: '', price: '', action: ''},
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

  const [currentPage, setCurrentPage] = useState(1);
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
          'https://demo.capobrain.com/fetchstdcourse',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Return the "output" field for the table
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
          <TouchableOpacity
            onPress={() => navigation.navigate('Home' as never)}>
            <Icon name="arrow-left" size={38} color={'#fff'} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Course</Text>
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
              nestedScrollEnabled
              keyExtractor={(item, index) =>
                item.sr ? item.sr.toString() : index.toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {['Sr#', 'Title', 'Class', 'Section', 'Price', 'Action'].map(
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
                  <Text style={styles.column}>{item.title}</Text>
                  <Text style={styles.column}>{item.class}</Text>
                  <Text style={styles.column}>{item.section}</Text>
                  <Text style={styles.column}>{item.price}</Text>
                  <Text style={styles.column}>{item.action}</Text>
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

export default Course;

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
