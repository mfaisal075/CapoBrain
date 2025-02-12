import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {DataTable} from 'react-native-paper';
import {BackHandler} from 'react-native';

const TeacherAccount = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );

  const [items] = useState([
    {
      sr: 1,
      date: '14-11-2024',
      payable: '-2000',
      inventory: '0',
      arrears: '0',
      paidAmount: '0',
      balance: '-2000',
      paymentMethod: 'Assign Transport',
      transactionType: 'Cash',
    },
    {
      sr: 2,
      date: '14-11-2024',
      payable: '34166',
      inventory: '0',
      arrears: '-2000',
      paidAmount: '0',
      balance: '34166',
      paymentMethod: 'Monthly Salary',
      transactionType: 'Cash',
    },
    {
      sr: 3,
      date: '14-11-2024',
      payable: '34166',
      inventory: '0',
      arrears: '0',
      paidAmount: '34166',
      balance: '0',
      paymentMethod: 'Salary Withdraw',
      transactionType: 'Cash',
    },
    {
      sr: 4,
      date: '07-12-2024',
      payable: '35000',
      inventory: '0',
      arrears: '0',
      paidAmount: '0',
      balance: '35000',
      paymentMethod: 'Monthly Salary',
      transactionType: 'Cash',
    },
    {
      sr: 5,
      date: '03-02-2025',
      payable: '70000',
      inventory: '0',
      arrears: '35000',
      paidAmount: '0',
      balance: '70000',
      paymentMethod: 'Monthly Salary',
      transactionType: 'Cash',
    },
    {
      sr: 6,
      date: '06-02-2025',
      payable: '70000',
      inventory: '0',
      arrears: '0',
      paidAmount: '70000',
      balance: '0',
      paymentMethod: 'Salary Withdraw',
      transactionType: 'Cash',
    },
    {
      sr: 7,
      date: '06-02-2025',
      payable: '35000',
      inventory: '0',
      arrears: '0',
      paidAmount: '10000',
      balance: '45000',
      paymentMethod: 'Employee Deposite',
      transactionType: 'Cash',
    },
    {
      sr: 8,
      date: '06-02-2025',
      payable: '35000',
      inventory: '0',
      arrears: '0',
      paidAmount: '35000',
      balance: '0',
      paymentMethod: 'Salary Withdraw',
      transactionType: 'Cash',
    },
    {
      sr: 9,
      date: '06-02-2025',
      payable: '10000',
      inventory: '0',
      arrears: '0',
      paidAmount: '0',
      balance: '10000',
      paymentMethod: 'Salary Update',
      transactionType: 'Cash',
    },
    {
      sr: 10,
      date: '06-02-2025',
      payable: '35000',
      inventory: '0',
      arrears: '0',
      paidAmount: '35000',
      balance: '0',
      paymentMethod: 'Salary Withdraw',
      transactionType: 'Cash',
    },
  ]);

  const filteredItems = items.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    setPage(0);
    return () => backHandler.remove();
  }, [itemsPerPage]);
  return (
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Staff Account</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../../assets/back.png')}
                style={styles.bckBtnIcon}
              />
              <Text style={styles.bckBtnText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
          <View style={styles.tblDataCtr}>
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
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
                  ].map((title, index) => (
                    <DataTable.Title
                      key={index}
                      textStyle={{
                        color: 'black',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: index === 0 ? 50 : 125, // Reduced width for the first header
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        backgroundColor: '#F0F0F0',
                      }}>
                      {title}
                    </DataTable.Title>
                  ))}
                </DataTable.Header>

                {filteredItems.length > 0 ? (
                  filteredItems.slice(from, to).map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.sr,
                        item.date,
                        item.payable,
                        item.inventory,
                        item.arrears,
                        item.paidAmount,
                        item.balance,
                        item.paymentMethod,
                        item.transactionType,
                      ].map((value, idx) => (
                        <DataTable.Cell
                          key={idx}
                          textStyle={{color: '#000', fontSize: 12}}
                          style={{
                            width: idx === 0 ? 50 : 125, // Reduced width for the first cell
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                          }}>
                          {value}
                        </DataTable.Cell>
                      ))}
                    </DataTable.Row>
                  ))
                ) : (
                  <DataTable.Row>
                    <DataTable.Cell
                      textStyle={{
                        color: 'gray',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: '100%',
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        justifyContent: 'center',
                      }}>
                      No data found
                    </DataTable.Cell>
                  </DataTable.Row>
                )}

                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(filteredItems.length / itemsPerPage)}
                  onPageChange={page => setPage(page)}
                  label={`${from + 1}-${to} of ${filteredItems.length}`}
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                  showFastPaginationControls
                  selectPageDropdownLabel={'Show Entries'}
                  theme={{
                    colors: {
                      primary: '#000',
                      elevation: {
                        level2: '#fff',
                      },
                      text: '#616161',
                      onSurface: '#616161',
                    },
                    dark: false,
                    roundness: 1,
                  }}
                />
              </DataTable>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TeacherAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  accountContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: '5%',
  },
  actHeadingContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  tblHdCtr: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
  bckBtnCtr: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bckBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bckBtnIcon: {
    height: 16,
    width: 16,
    tintColor: '#fff',
    marginRight: 5,
  },
});
