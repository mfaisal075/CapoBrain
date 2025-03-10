import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import ViewShot, {captureRef} from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';

type TableRow = {
  sr: string;
  branch: string;
  registration: string;
  student: string;
  class: string;
  section: string;
  balance: string;
  action: string;
};

type TableCol = {
  transaction: string;
  date: string;
  fee: string;
  arrears: string;
  inventory: string;
  paid: string;
  balance: string;
  transactionType: string;
  paymentMethod: string;
};

interface UserData {
  user: {
    role: string;
    email: string;
    contact: string;
    name: string;
    user_name: string;
    cnic: string;
  };
  parent_receiveable: number;
  parent_paid: number;
  parent_inventory: number;
  parent_balance: number;
}

const ParentAccount = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalV, setModalV] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModl = () => {
    setModalV(!isModalV);
  };

  const originalData: TableRow[] = [
    {
      sr: '1',
      branch: 'Main Branch',
      registration: 'FR#017',
      student: 'Ahmad Raza',
      class: 'Two',
      section: 'A',
      balance: '7875',
      action: 'Payable Voucher',
    },
    {
      sr: '2',
      branch: 'Main Branch',
      registration: 'FR#0254',
      student: 'Saba',
      class: 'Eight',
      section: 'A',
      balance: '10100',
      action: 'Payable Voucher',
    },
    {
      sr: '3',
      branch: 'Main Branch',
      registration: 'FR#019',
      student: 'Muhammad Raza',
      class: 'Two',
      section: 'A',
      balance: '13000',
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

  const [modalData, setModalData] = useState<TableCol[]>([
    {
      transaction: 'FC-17',
      date: '13-11-2024',
      fee: '8900',
      arrears: '0',
      inventory: '0',
      paid: '0',
      balance: '8900',
      transactionType: 'Fee Charged',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'FR#012',
      date: '14-11-2024',
      fee: '8900.00',
      arrears: '0',
      inventory: '0',
      paid: '8900',
      balance: '0',
      transactionType: 'Payable Voucher',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'INV#06',
      date: '15-11-2024',
      fee: '120',
      arrears: '0',
      inventory: '120',
      paid: '0',
      balance: '120',
      transactionType: 'Inventory Issued',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'FR#033',
      date: '18-11-2024',
      fee: '120',
      arrears: '0',
      inventory: '0',
      paid: '200',
      balance: '-80',
      transactionType: 'Payment Recieved',
      paymentMethod: 'Easy Paisa',
    },
    {
      transaction: 'RFD#034',
      date: '18-11-2024',
      fee: '-80.00',
      arrears: '0',
      inventory: '0',
      paid: '80',
      balance: '0',
      transactionType: 'Refund',
      paymentMethod: 'Easy Paisa',
    },
    {
      transaction: 'INV#030',
      date: '28-11-2024',
      fee: '15',
      arrears: '0',
      inventory: '0',
      paid: '0',
      balance: '15',
      transactionType: 'Inventory Issued',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'MF-December',
      date: '07-12-2024',
      fee: '2515',
      arrears: '15',
      inventory: '0',
      paid: '0',
      balance: '2515',
      transactionType: 'Monthly Fee',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'INV#034',
      date: '26-12-2024',
      fee: '2875',
      arrears: '2515',
      inventory: '360',
      paid: '0',
      balance: '2875',
      transactionType: 'Inventory Issued',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'MF-January',
      date: '07-01-2025',
      fee: '5375',
      arrears: '2875',
      inventory: '0',
      paid: '0',
      balance: '5375',
      transactionType: 'Monthly Fee',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'MF-February',
      date: '03-01-2025',
      fee: '7875',
      arrears: '5375',
      inventory: '0',
      paid: '0',
      balance: '7875',
      transactionType: 'Monthly Fee',
      paymentMethod: 'Cash',
    },
  ]);

  const viewShotRef = useRef<ViewShot>(null);

  // const handleSavePDF = async () => {
  //   try {
  //     const uri = await captureRef(viewShotRef, {
  //       format: 'jpg',
  //       quality: 0.8,
  //     });

  //     if (!uri) {
  //       console.error('Capture failed or returned undefined.');
  //       return;
  //     }

  //     const imageBase64 = await RNFS.readFile(uri, 'base64');

  //     const htmlContent = `
  //       <html>
  //         <body style="text-align: center;">
  //           <img src="data:image/jpeg;base64,${imageBase64}" style="width: 100%;" />
  //         </body>
  //       </html>`;

  //     const pdfOptions = {
  //       html: htmlContent,
  //       fileName: 'SavedScreen',
  //       directory: 'Documents',
  //     };

  //     const pdf = await RNHTMLtoPDF.convert(pdfOptions);

  //     if (pdf.filePath) {
  //       Alert.alert(
  //         'PDF Saved!',
  //         `PDF successfully saved at:\n${pdf.filePath}`,
  //       );
  //       console.log('PDF Saved to:', pdf.filePath);
  //     } else {
  //       console.error('PDF file path is undefined.');
  //     }
  //   } catch (error) {
  //     console.error('PDF Save Error: ', error);
  //   }
  // };

  const studentInfo = [
    {key: 'Student Name', value: 'Ahmad Raza'},
    {key: 'Father Name', value: 'Iftikhar'},
    {key: 'Class', value: 'Two'},
    {key: 'Section', value: 'A'},
  ];
  const accountInfo = [
    {key: 'Payable', value: '7875'},
    {key: 'Paid Amount', value: '0'},
    {key: 'Balance', value: '7875'},
  ];

  const stdInfo = [
    {key: 'Student Name', value: 'Ahmad Raza'},
    {key: 'Father Name', value: 'Iftikhar'},
    {key: 'Class', value: 'Two'},
  ];

  const Info = [
    {key: 'Receivable', value: userData?.parent_receiveable ?? '0'},
    {key: 'Paid', value: userData?.parent_paid ?? '0'},
    {key: 'Inventory', value: userData?.parent_inventory ?? '0'},
    {key: 'Balance', value: userData?.parent_balance ?? '0'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchchildren',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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

  const balanceFetch = async () => {
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
        setUserData(response.data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  useEffect(() => {
    balanceFetch();
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
        <Text style={styles.headerText}>Account</Text>
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
                  'Branch',
                  'Registration',
                  'Student',
                  'Class',
                  'Section',
                  'Balance',
                  'Action',
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
                <Text style={styles.column}>{item.branch}</Text>
                <Text style={styles.column}>{item.registration}</Text>
                <Text style={styles.column}>{item.student}</Text>
                <Text style={styles.column}>{item.class}</Text>
                <Text style={styles.column}>{item.section}</Text>
                <Text style={styles.column}>{item.balance}</Text>
                <TouchableOpacity
                  onPress={toggleModl}
                  disabled={item.action === 'Not Available'}>
                  <View
                    style={[
                      item.action === 'Not Available'
                        ? styles.notAvailable
                        : styles.available,
                      styles.actionView,
                    ]}>
                    <Image
                      style={[
                        item.action === 'Not Available'
                          ? styles.notAvailable
                          : styles.available,
                        {width: 13},
                        {height: 13},
                        {marginLeft: 50},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/visible.png')}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    item.action === 'Payable Voucher'
                      ? toggleModal
                      : (null as unknown as undefined)
                  }
                  disabled={item.action === 'Not Available'}>
                  <View
                    style={[
                      item.action === 'Not Available'
                        ? styles.notAvailable
                        : styles.available,
                      styles.actionView,
                    ]}>
                    <Image
                      style={[
                        item.action === 'Not Available'
                          ? styles.notAvailable
                          : styles.available,
                        {width: 15},
                        {height: 15},
                        {marginLeft: 4},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/id.png')}
                    />
                  </View>
                </TouchableOpacity>
                <Modal isVisible={isModalVisible}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: 'auto',
                      maxHeight: 600,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#6C757D',
                    }}>
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
                      <View
                        style={{
                          flexDirection: 'column',
                          borderWidth: 1,
                          borderColor: '#6C757D',
                        }}
                      />

                      <Text
                        style={{
                          marginTop: 20,
                          textAlign: 'center',
                          fontSize: 18,
                        }}>
                        Gujranwala City Grammar School
                      </Text>
                      <Text
                        style={{
                          marginTop: 10,
                          textAlign: 'center',
                          fontSize: 16,
                        }}>
                        Main Branch
                      </Text>
                      <Text
                        style={{
                          marginTop: 10,
                          marginLeft: 10,
                        }}>
                        Issue Date 03-02-2025
                      </Text>

                      <FlatList
                        style={{
                          marginTop: 5,
                        }}
                        data={studentInfo}
                        keyExtractor={item => item.key}
                        renderItem={({item}) => (
                          <View style={styles.infoRow}>
                            <Text
                              style={[
                                styles.text,
                                styles.withBorder,
                                styles.head,
                                styles.column,
                              ]}>
                              {item.key}:
                            </Text>
                            <Text
                              style={[
                                styles.value,
                                styles.head,
                                styles.column,
                              ]}>
                              {item.value}
                            </Text>
                          </View>
                        )}
                      />

                      <FlatList
                        style={{
                          marginTop: 10,
                        }}
                        data={accountInfo}
                        keyExtractor={item => item.key}
                        renderItem={({item}) => (
                          <View style={styles.infoRow}>
                            <Text
                              style={[
                                styles.text,
                                styles.withBorder,
                                styles.head,
                                styles.column,
                              ]}>
                              {item.key}:
                            </Text>
                            <Text
                              style={[
                                styles.value,
                                styles.head,
                                styles.column,
                              ]}>
                              {item.value}
                            </Text>
                          </View>
                        )}
                      />

                      <View
                        style={{
                          flexDirection: 'column',
                          marginTop: 20,
                          marginLeft: 10,
                          marginRight: 10,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}>
                          Accountant Sign/Stamp _________
                        </Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}>
                          Submit Date__________
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => {}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            backgroundColor: '#218838',
                            borderRadius: 5,
                            borderWidth: 1,
                            width: 60,
                            height: 30,
                            alignSelf: 'center',
                            marginTop: 20,
                            marginBottom: 10,
                          }}>
                          <Icon
                            name="printer"
                            size={18}
                            color={'#fff'}
                            style={{marginTop: 5, marginRight: 2}}
                          />
                          <Text
                            style={{
                              color: 'white',
                              textAlign: 'center',
                              marginTop: 5,
                            }}>
                            Print
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ViewShot>
                  </View>
                </Modal>
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

      {/* Modal */}
      <Modal isVisible={isModalV}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 'auto',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Text style={{color: '#6C757D', fontSize: 18}}>
              Account Details
            </Text>

            <TouchableOpacity onPress={() => setModalV(!isModalV)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
              borderWidth: 1,
              borderColor: '#6C757D',
            }}
          />
          <View
            style={{
              margin: 10,
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 5,
              height: 700,
            }}>
            <Text
              style={{
                marginTop: 20,
                textAlign: 'center',
                fontSize: 18,
              }}>
              Gujranwala City Grammar School
            </Text>
            <Text
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontSize: 16,
              }}>
              Main Branch
            </Text>
            <Text
              style={{
                marginTop: 10,
                marginLeft: 10,
              }}>
              Issue Date 03-02-2025
            </Text>
            <View>
              <FlatList
                style={{
                  marginTop: 5,
                }}
                data={stdInfo}
                keyExtractor={item => item.key}
                renderItem={({item}) => (
                  <View style={styles.infoRow}>
                    <Text
                      style={[
                        styles.text,
                        styles.withBorder,
                        styles.head,
                        styles.column,
                      ]}>
                      {item.key}:
                    </Text>
                    <Text style={[styles.value, styles.head, styles.column]}>
                      {item.value}
                    </Text>
                  </View>
                )}
              />
            </View>

            <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
              <View>
                <FlatList
                  style={{
                    margin: 10,
                    flex: 1,
                  }}
                  scrollEnabled={true}
                  data={modalData}
                  keyExtractor={item => item.transaction.toString()}
                  ListHeaderComponent={() => (
                    <View style={styles.row}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 100},
                            {padding: 1},
                          ]}>
                          Transaction
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Date
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Fee
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 200},
                            {padding: 1},
                          ]}>
                          Arrears
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Inventory
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 100},
                            {padding: 1},
                          ]}>
                          Paid
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Balance
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Transaction Type
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Payment Method
                        </Text>
                      </View>
                    </View>
                  )}
                  renderItem={({item}) => (
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 100},
                          {padding: 5},
                        ]}>
                        {item.transaction}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 150},
                          {padding: 5},
                        ]}>
                        {item.date}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 150},
                          {padding: 5},
                        ]}>
                        {item.fee}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 200},
                          {padding: 5},
                        ]}>
                        {item.arrears}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 150},
                          {padding: 5},
                        ]}>
                        {item.inventory}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 100},
                          {padding: 5},
                        ]}>
                        {item.paid}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 150},
                          {padding: 5},
                        ]}>
                        {item.balance}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 150},
                          {padding: 5},
                        ]}>
                        {item.transactionType}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          styles.withBorder,
                          {width: 150},
                          {padding: 5},
                        ]}>
                        {item.paymentMethod}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentAccount;

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
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 4,
    marginTop: 1,
    marginBottom: 1,
    alignSelf: 'center',
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',
    width: 'auto',
    height: 27,
    borderRadius: 5,
  },
  available: {
    color: 'green',
    tintColor: 'green',
    width: 'auto',
    height: 27,
    borderRadius: 5,
  },
  withBorder: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  head: {
    height: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    width: wp('70%'),
    alignSelf: 'center',
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
  info: {
    flexDirection: 'row',
  },
});
