import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  date: string;
  payable: string;
  inventory: string;
  arrears: string;
  paidAmount: string;
  balance: string;
  paymentMethod: string;
  transactionType: string;
};

interface UserData {
  teacher_account: {
    acc_payable_amount: string;
    acc_paid_amount: string;
    arrears_amount: string;
  };
}

interface Account {
  id: number;
  acc_date: string;
  acc_payable_amount: string;
  stationary_paid_amount: string;
  arrears_amount: string;
  acc_paid_amount: string;
  acc_balance: string;
  payment_method: string;
  payment_mode: string;
}

const TeacherAccount = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [accountData, setAccountData] = useState<UserData | null>(null);

  const [originalData, setOriginalData] = useState<Account[]>([]);
  const [tableData, setTableData] = useState<Account[]>(originalData);

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

  const Info = [
    {
      key: 'Salary Payable',
      value: accountData?.teacher_account.acc_payable_amount ?? '0',
    },
    {
      key: 'Paid Salary',
      value: accountData?.teacher_account.acc_paid_amount ?? '0',
    },
    {
      key: 'Inventory',
      value: accountData?.teacher_account.arrears_amount ?? '0',
    },
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/staffaccountdetails' + `?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOriginalData(response.data.accounts);
        setTableData(response.data.accounts);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  const fetchAccountData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchprofile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAccountData(response.data);

        return response.data.newsoutput;
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
    fetchAccountData();
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
        <Text style={styles.headerText}>Accounts</Text>
      </View>
      <View>
        <FlatList
          data={Info}
          keyExtractor={item => item.key}
          renderItem={({item}) => (
            <View style={styles.infoRow}>
              <Text style={styles.text}>{item.key}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          )}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
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
        {currentEntries.length > 0 ? (
          <View>
            <FlatList
              style={styles.flatList}
              data={currentEntries}
              keyExtractor={(item, index) =>
                item.id ? `${item.id}-${index}` : index.toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {[
                    'Sr#',
                    'Date',
                    'Payable',
                    'Inventory',
                    'Arrears',
                    'Paid Amount',
                    'Balance',
                    'Payment Method',
                    'Transaction Type',
                  ].map(header => (
                    <Text
                      key={header}
                      style={[styles.column, styles.headTable]}>
                      {header}
                    </Text>
                  ))}
                </View>
              )}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.row,
                    {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                  ]}>
                  <Text style={styles.column}>{index + 1}</Text>
                  <Text style={styles.column}>{formatDate(item.acc_date)}</Text>
                  <Text style={styles.column}>{item.acc_payable_amount}</Text>
                  <Text style={styles.column}>
                    {item.stationary_paid_amount}
                  </Text>
                  <Text style={styles.column}>{item.arrears_amount}</Text>
                  <Text style={styles.column}>{item.acc_paid_amount}</Text>
                  <Text style={styles.column}>{item.acc_balance}</Text>
                  <Text style={styles.column}>{item.payment_method}</Text>
                  <Text style={styles.column}>{item.payment_mode}</Text>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={{marginTop: 20, width: '100%'}}>
            <Text
              style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
              No data found in the database
            </Text>
          </View>
        )}
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

export default TeacherAccount;

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
    textAlign: 'center',
    color: 'gray',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
    padding: 5,
  },
  value: {
    padding: 5,
    marginLeft: 10,
  },
});
