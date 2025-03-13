import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {FlatList} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import ViewShot from 'react-native-view-shot';
import RNPrint from 'react-native-print';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  transaction: string;
  date: string;
  fee: string;
  transport: string;
  inventory: string;
  arrears: string;
  others: string;
  payable: string;
  paid: string;
  balance: string;
  transactionType: string;
  action: string;
};

interface AccountData {
  cand: {
    cand_bform: string;
    cand_name: string;
    student_id: string;
    add: string;
  };
  cand_class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  parent: {
    par_fathername: string;
  };
  user: {
    role: string;
    email: string;
    contact: string;
    name: string;
  };
  student_account: {
    stuacc_balance: string;
    stuacc_paid_amount: string;
    inventory_amount: string;
    stuacc_payable: string;
  };
}

interface AccountInfo {
  id: number;
  transaction_id: string;
  stuacc_date: string;
  monthlyfee_receivable: string;
  transport_received: string;
  inventory_received: string;
  arrears_amount: string;
  miscfee_receivable: string;
  stuacc_payable: string;
  stuacc_paid_amount: string;
  stuacc_balance: string;
  stuacc_payment_method: string;
  monthly_fee: string;
  transportation_fee: string;
  inventory_amount: string;
  voucher_id: string;
}

const Account = ({navigation}: any) => {
  const {token} = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const viewShotRef = useRef<any>(null);
  
  const [accoutData, setAccountData] = useState<AccountData | null>(null);
  const [accountDetails, setAccountDestails] = useState<AccountInfo[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const captureAndPrint = async () => {
    const uri = await viewShotRef.current.capture();
    await RNPrint.print({filePath: uri});
  };

  const originalData: TableRow[] = [
    {
      sr: '1',
      transaction: 'FC-22',
      date: '13-11-2024',
      fee: '2500',
      transport: '0',
      inventory: '0',
      arrears: '0',
      others: '6400',
      payable: '8900',
      paid: '0',
      balance: '8900',
      transactionType: 'Fee Charged',
      action: 'Not Available',
    },
    {
      sr: '2',
      transaction: 'FR#015',
      date: '14-11-2024',
      fee: '2500',
      transport: '0',
      inventory: '0',
      arrears: '0',
      others: '6400',
      payable: '8900',
      paid: '8900',
      balance: '0',
      transactionType: 'Payment Recieved',
      action: 'Not Available',
    },
    {
      sr: '3',
      transaction: 'INV#022',
      date: '21-11-2024',
      fee: '0',
      transport: '0',
      inventory: '240',
      arrears: '0',
      others: '0',
      payable: '240',
      paid: '240',
      balance: '0',
      transactionType: 'Inventory Issued',
      action: 'Not Available',
    },
    {
      sr: '4',
      transaction: 'MF-December',
      date: '07-12-2024',
      fee: '0',
      transport: '0',
      inventory: '0',
      arrears: '0',
      others: '2500',
      payable: '0',
      paid: '2500',
      balance: '0',
      transactionType: 'Monthly Fee',
      action: 'Payable Voucher',
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

  {
    /*modal data*/
  }
  const studentInfo = [
    {key: 'Student Name', value: 'Hanzala Ahmad'},
    {key: 'Father Name', value: 'Aftab Ahmad'},
    {key: 'Class', value: 'Three'},
    {key: 'Section', value: 'A'},
  ];

  const balanceInfo = [
    {key: 'Total Amount', value: '2500'},
    {key: 'Paid Amount', value: '0'},
    {key: 'Payable Amount', value: '2500'},
  ];
  const accountInfo = [
    {key: 'Admission Fee', value: '2000'},
    {key: 'Security Charges', value: '1200'},
    {key: 'Medical Charges', value: '500'},
    {key: 'Computer Charges', value: '0'},
    {key: 'Examination', value: '1000'},
    {key: 'Stationary Charges', value: '0'},
    {key: 'Annual Charges', value: '1500'},
    {key: 'Monthly Charges', value: '2500'},
    {key: 'Library Charges', value: '0'},
    {key: 'Lab Charges', value: '0'},
    {key: 'Id Charges', value: '200'},
    {key: 'AC Charges', value: '0'},
    {key: 'Generator Charges', value: '0'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/fetchstd_account?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAccountDestails(response.data.accounts);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  const Info = [
    {key: 'Receivable', value: accoutData?.student_account.stuacc_payable},
    {key: 'Paid', value: accoutData?.student_account.stuacc_paid_amount},
    {key: 'Inventory', value: accoutData?.student_account.inventory_amount},
    {key: 'Balance', value: accoutData?.student_account.stuacc_balance},
  ];

  useEffect(() => {
    fetchData();
    fetchAccountData();
    // Hardware Back Press
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
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Accounts</Text>
      </View>

      <View
        style={{
          marginTop: 10,
        }}>
        <FlatList
          data={Info}
          keyExtractor={item => item.key}
          renderItem={({item}) => (
            <View style={styles.info}>
              <Text style={styles.text}>{item.key}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          )}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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

      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={{
              margin: 10,
              flex: 1,
            }}
            data={accountDetails}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Sr#
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Transaction
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Date
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  Fee
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Transport
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Inventory
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Arrears
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Others
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  Payable
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Paid
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Balance
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  Transaction Type
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
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
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {index + 1}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.transaction_id}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.stuacc_date}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.monthly_fee}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.transportation_fee}
                </Text>
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {item.inventory_amount}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.arrears_amount}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.miscfee_receivable}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.stuacc_payable}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.stuacc_paid_amount}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.stuacc_balance}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.stuacc_payment_method}
                </Text>

                <TouchableOpacity
                  onPress={
                    item.voucher_id === 'Payable Voucher'
                      ? toggleModal
                      : (null as unknown as undefined)
                  }
                  disabled={item.voucher_id === null}>
                  <View style={styles.iconContainer}>
                    <Image
                      style={styles.statusIcon}
                      source={
                        item.voucher_id === null
                          ? require('../assets/rejected.png')
                          : require('../assets/payable.png')
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <Text>
          Showing {(currentPage - 1) * entriesPerPage + 1} to
          {Math.min(currentPage * entriesPerPage, tableData.length)} of
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

      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#6C757D',
            }}>
            {/* Make Scrollable Content */}
            <ScrollView
              contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
              nestedScrollEnabled={true} // Fix for FlatList inside ScrollView
              showsVerticalScrollIndicator={false}>
              <ViewShot ref={viewShotRef}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 20,
                  }}>
                  <Text style={{color: '#6C757D', fontSize: 18}}>
                    Fee Challan
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!isModalVisible)}>
                    <Text style={{color: '#6C757D'}}>✖</Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{marginTop: 20, textAlign: 'center', fontSize: 18}}>
                  Gujranwala City Grammar School
                </Text>
                <Text
                  style={{marginTop: 10, textAlign: 'center', fontSize: 16}}>
                  Main Branch
                </Text>
                <Text style={{marginTop: 10, marginLeft: 10}}>
                  Issue Date 07-12-2024
                </Text>

                {/* Student Info */}
                <FlatList
                  scrollEnabled={false}
                  data={studentInfo}
                  keyExtractor={item => item.key}
                  renderItem={({item}) => (
                    <View style={styles.infoRow}>
                      <Text
                        style={[styles.text, styles.column, styles.withBorder]}>
                        {item.key}:
                      </Text>
                      <Text style={[styles.value, styles.column,{marginRight:5}]}>
                        {item.value}
                      </Text>
                    </View>
                  )}
                />

                {/* Balance Info */}
                <FlatList
                  scrollEnabled={false}
                  data={balanceInfo}
                  keyExtractor={item => item.key}
                  style={{marginTop: 10}}
                  renderItem={({item}) => (
                    <View style={styles.infoRow}>
                      <Text
                        style={[styles.text, styles.column, styles.withBorder]}>
                        {item.key}:
                      </Text>
                      <Text style={[styles.value, styles.column]}>
                        {item.value}
                      </Text>
                    </View>
                  )}
                />

                {/* Account Info */}
                <FlatList
                  scrollEnabled={false}
                  data={accountInfo}
                  keyExtractor={item => item.key}
                  style={{marginTop: 10}}
                  renderItem={({item}) => (
                    <View style={styles.infoRow}>
                      <Text
                        style={[styles.text, styles.column, styles.withBorder]}>
                        {item.key}:
                      </Text>
                      <Text style={[styles.value, styles.column]}>
                        {item.value}
                      </Text>
                    </View>
                  )}
                />

                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 15,
                    marginLeft: 10,
                    marginRight: 10,
                  }}>
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                    Accountant Sign/Stamp _________
                  </Text>
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                    Submit Date__________
                  </Text>
                </View>
              </ViewShot>

              {/* Print Button */}
              <TouchableOpacity onPress={() => captureAndPrint()}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#218838',
                    borderRadius: 5,
                    borderWidth: 1,
                    width: 80,
                    height: 35,
                    alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name="printer"
                    size={18}
                    color={'#fff'}
                    style={{marginRight: 4}}
                  />
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Print
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default Account;

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
    width: '50%',
    textAlign: 'center',
  },
  withBorder: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
  },
  head: {
    backgroundColor: '#008604',
    height: 25,
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
  statusIcon: {
    width: 25,
    height: 25,
    marginLeft: 90,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: wp('85%'),
    alignSelf: 'center',
    borderColor: 'gray',
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
    padding: 2,
  },
  value: {
    padding: 2,
    marginLeft: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
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
  info: {
    flexDirection: 'row',
  },
});
