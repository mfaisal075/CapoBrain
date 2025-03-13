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

const TeacherAccount = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [accountData, setAccountData] = useState<UserData | null>(null);

  const originalData: TableRow[] = [
    {
      sr: '1',
      date: '14-11-2024',
      payable: '3100',
      inventory: '0',
      arrears: '0',
      paidAmount: '0',
      balance: '31000',
      paymentMethod: 'Monthly Salary',
      transactionType: 'Cash',
    },
    {
      sr: '2',
      date: '14-11-2024',
      payable: '3100',
      inventory: '0',
      arrears: '0',
      paidAmount: '31000',
      balance: '0',
      paymentMethod: 'Salary Withdraw',
      transactionType: 'Cash',
    },
    {
      sr: '3',
      date: '20-11-2024',
      payable: '20000',
      inventory: '240',
      arrears: '0',
      paidAmount: '0',
      balance: '20000',
      paymentMethod: 'Advance Salary',
      transactionType: 'Cash',
    },
    {
      sr: '4',
      date: '20-11-2024',
      payable: '20000',
      inventory: '0',
      arrears: '0',
      paidAmount: '2000',
      balance: '0',
      paymentMethod: 'Salary Withdraw',
      transactionType: 'Cash',
    },
    {
      sr: '5',
      date: '20-11-2024',
      payable: '-15',
      inventory: '15',
      arrears: '0',
      paidAmount: '0',
      balance: '-15',
      paymentMethod: 'Inventory Issued	',
      transactionType: 'Cash',
    },
    {
      sr: '6',
      date: '07-12-2024',
      payable: '27985',
      inventory: '0',
      arrears: '-15',
      paidAmount: '0',
      balance: '27985',
      paymentMethod: 'Monthly Salary',
      transactionType: 'Cash',
    },
    {
      sr: '7',
      date: '30-01-2025',
      payable: '57985',
      inventory: '240',
      arrears: '27985',
      paidAmount: '0',
      balance: '57985',
      paymentMethod: 'Advance Salary',
      transactionType: 'Cash',
    },
    {
      sr: '8',
      date: '03-02-2025',
      payable: '79985',
      inventory: '0',
      arrears: '57985',
      paidAmount: '0',
      balance: '79985',
      paymentMethod: 'Monthly Salary',
      transactionType: 'Cash',
    },
    {
      sr: '9',
      date: '04-02-2025',
      payable: '97985',
      inventory: '0',
      arrears: '79985',
      paidAmount: '0',
      balance: '97985',
      paymentMethod: 'Salary Update',
      transactionType: 'Cash',
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

        return response.data.output;
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
                  <Text key={header} style={[styles.column, styles.headTable]}>
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
                <Text style={styles.column}>{item.sr}</Text>
                <Text style={styles.column}>{item.date}</Text>
                <Text style={styles.column}>{item.payable}</Text>
                <Text style={styles.column}>{item.inventory}</Text>
                <Text style={styles.column}>{item.arrears}</Text>
                <Text style={styles.column}>{item.paidAmount}</Text>
                <Text style={styles.column}>{item.balance}</Text>
                <Text style={styles.column}>{item.paymentMethod}</Text>
                <Text style={styles.column}>{item.transactionType}</Text>
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
    padding: 5,
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
