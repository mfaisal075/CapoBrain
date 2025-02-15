import {
  BackHandler,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ParentAccount = ({navigation}: any) => {
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);

  const showViewModal = () => {
    setViewModalVisible(true);
  };
  const hideViewModal = () => {
    setViewModalVisible(false);
  };
  const showVoucherModal = () => {
    setVoucherModalVisible(true);
  };
  const hideVoucherModal = () => {
    setVoucherModalVisible(false);
  };

  const [items] = useState([
    {
      sr: 1,
      branch: 'Main Branch',
      registration: 'FR#015',
      student: 'Hiba',
      class: 'Five',
      section: 'B',
      balance: '4500',
    },
  ]);

  const [modalItems] = useState([
    {
      transaction: 'FC-15',
      date: '13-11-2024',
      fee: 8900,
      arrears: 0,
      inventory: 0,
      paid: 0,
      balance: 8900,
      transactionType: 'Fee Charged',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'FR#09',
      date: '14-11-2024',
      fee: 8900,
      arrears: 0,
      inventory: 0,
      paid: 9000,
      balance: -100,
      transactionType: 'Payment Received',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'RFD#010',
      date: '14-11-2024',
      fee: -100,
      arrears: 0,
      inventory: 0,
      paid: 0,
      balance: 100,
      transactionType: 'Refund',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'UF#012',
      date: '19-11-2024',
      fee: 2000,
      arrears: 0,
      inventory: 0,
      paid: 0,
      balance: 2000,
      transactionType: 'Update Fee',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'MF-December',
      date: '07-12-2024',
      fee: 5500,
      arrears: 2000,
      inventory: 0,
      paid: 0,
      balance: 5500,
      transactionType: 'Monthly Fee',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'MF-January',
      date: '07-01-2025',
      fee: 9000,
      arrears: 5500,
      inventory: 0,
      paid: 0,
      balance: 9000,
      transactionType: 'Monthly Fee',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'MF-February',
      date: '03-02-2025',
      fee: 12500,
      arrears: 9000,
      inventory: 0,
      paid: 0,
      balance: 12500,
      transactionType: 'Monthly Fee',
      paymentMethod: 'Cash',
    },
    {
      transaction: 'FR#075',
      date: '03-02-2025',
      fee: 12500,
      arrears: 0,
      inventory: 0,
      paid: 8000,
      balance: 4500,
      transactionType: 'Payment Received',
      paymentMethod: 'Cash',
    },
  ]);

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
            <Text style={styles.tblHdCtr}>Accounts</Text>
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
                    'Branch',
                    'Registration',
                    'Student',
                    'Class',
                    'Section',
                    'Balance',
                    'Actions',
                  ].map((title, index) => (
                    <DataTable.Title
                      key={index}
                      textStyle={{
                        color: 'black',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: index === 0 ? 50 : index === 7 ? 220 : 125, // Reduced width for the first header
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        backgroundColor: '#F0F0F0',
                      }}>
                      {title}
                    </DataTable.Title>
                  ))}
                </DataTable.Header>

                {items.length > 0 ? (
                  items.slice(from, to).map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.sr,
                        item.branch,
                        item.registration,
                        item.student,
                        item.class,
                        item.section,
                        item.balance,
                      ].map((value, idx) => (
                        <DataTable.Cell
                          key={idx}
                          textStyle={{color: '#000', fontSize: 12}}
                          style={{
                            width: idx === 0 ? 50 : idx === 7 ? 220 : 125, // Reduced width for the first cell
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                          }}>
                          {value}
                        </DataTable.Cell>
                      ))}
                      {/* Actions Column with Buttons */}
                      <DataTable.Cell
                        style={{
                          width: 220,
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                          flexDirection: 'row',
                        }}>
                        <View style={styles.tblBtnCtr}>
                          <TouchableOpacity
                            style={[
                              styles.tblActionBtn,
                              {
                                backgroundColor: '#007BFF',
                                marginRight: 5,
                                flexDirection: 'row',
                              },
                            ]}
                            onPress={showViewModal}>
                            <Icon name="eye" size={14} color={'#fff'} />
                            <Text style={styles.tblBtnTxt}>View</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.tblActionBtn,
                              {backgroundColor: '#F39C12'},
                            ]}
                            onPress={showVoucherModal}>
                            <Text style={styles.tblBtnTxt}>
                              Payable Voucher
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </DataTable.Cell>
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
                  numberOfPages={Math.ceil(items.length / itemsPerPage)}
                  onPageChange={page => setPage(page)}
                  label={`${from + 1}-${to} of ${items.length}`}
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

      {/* View Modal */}
      <Modal
        visible={viewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideViewModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
            }}>
            <View style={styles.modalTitleCtr}>
              <Text style={styles.modalTitle}>Account Details</Text>
            </View>
            <View
              style={{
                borderBottomColor: '#000',
                borderBottomWidth: 0.5,
                marginVertical: 10,
              }}
            />
            <View>
              <TouchableOpacity
                style={styles.clsIconCtr}
                onPress={() => hideViewModal()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.viewModalBody}>
              <View style={styles.schoolNameCtr}>
                <Text style={styles.schoolNameTxt}>
                  Gujranwala City Grammar School
                </Text>
                <Text style={[styles.schoolNameTxt, {marginTop: 30}]}>
                  Main Branch
                </Text>
              </View>
              <View style={styles.tblDataCtr}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title
                      style={styles.dataTableTitle}
                      textStyle={styles.dataTableTitleText}>
                      Student Name
                    </DataTable.Title>
                    <DataTable.Title
                      style={styles.dataTableTitle}
                      textStyle={styles.dataTableTitleText}>
                      Father Name
                    </DataTable.Title>
                    <DataTable.Title
                      style={styles.dataTableTitle}
                      textStyle={styles.dataTableTitleText}>
                      Student Class
                    </DataTable.Title>
                  </DataTable.Header>
                  <DataTable.Row>
                    <DataTable.Cell
                      style={[
                        styles.dataTableTitle,
                        {backgroundColor: 'transparent'},
                      ]}
                      textStyle={styles.dataTableTitleText}>
                      Hibba
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.dataTableTitle,
                        {backgroundColor: 'transparent'},
                      ]}
                      textStyle={styles.dataTableTitleText}>
                      Abdullah
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.dataTableTitle,
                        {backgroundColor: 'transparent'},
                      ]}
                      textStyle={styles.dataTableTitleText}>
                      Five
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </View>

              <View style={styles.tblDataCtr}>
                <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header>
                      {[
                        'Transaction',
                        'Date',
                        'Fee',
                        'Arrears',
                        'Inventory',
                        'Paid',
                        'Balance',
                        'Transaction Type',
                        'Payment Method',
                      ].map((title, index) => (
                        <DataTable.Title
                          key={index}
                          textStyle={{
                            color: 'black',
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                          style={{
                            width: 125, // Reduced width for the first header
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                            backgroundColor: '#F0F0F0',
                          }}>
                          {title}
                        </DataTable.Title>
                      ))}
                    </DataTable.Header>

                    {modalItems.length > 0 ? (
                      modalItems.map((item, index) => (
                        <DataTable.Row key={index}>
                          {[
                            item.transaction,
                            item.date,
                            item.fee,
                            item.arrears,
                            item.inventory,
                            item.paid,
                            item.balance,
                            item.transactionType,
                            item.paymentMethod,
                          ].map((value, idx) => (
                            <DataTable.Cell
                              key={idx}
                              textStyle={{color: '#000', fontSize: 12}}
                              style={{
                                width: 125, // Reduced width for the first cell
                                paddingHorizontal: 5,
                                borderColor: '#000',
                                borderWidth: 0.5,
                                justifyContent: 'center',
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
                  </DataTable>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Voucher Modal */}
      <Modal
        visible={voucherModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideVoucherModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
            }}>
            <View style={styles.modalTitleCtr}>
              <Text style={styles.modalTitle}>Fee Challan</Text>
            </View>
            <View
              style={{
                borderBottomColor: '#000',
                borderBottomWidth: 0.5,
                marginVertical: 10,
              }}
            />
            <View>
              <TouchableOpacity
                style={styles.clsIconCtr}
                onPress={() => hideVoucherModal()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.viewModalBody}>
              <View style={styles.schoolNameCtr}>
                <Text style={styles.schoolNameTxt}>
                  Gujranwala City Grammar School
                </Text>
                <Text style={[styles.schoolNameTxt, {marginTop: 30}]}>
                  Main Branch
                </Text>
              </View>
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity style={styles.saveBtn}>
                <Icon
                  name="printer"
                  size={18}
                  color={'#fff'}
                  style={{marginRight: 5}}
                />
                <Text style={styles.saveBtnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentAccount;

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
  tblBtnCtr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tblActionBtn: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  tblBtnTxt: {
    color: '#fff',
  },

  //Modal Styling
  modalTitleCtr: {
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clsIconCtr: {
    position: 'absolute',
    right: 5,
    top: -50,
  },
  saveBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewModalBody: {
    height: 600,
    borderColor: 'rgba(0,0,0, 0.5)',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  schoolNameCtr: {
    paddingHorizontal: 50,
    marginTop: 30,
  },
  schoolNameTxt: {
    fontSize: 24,
    textAlign: 'center',
  },
  dataTableTitle: {
    borderColor: '#000',
    borderWidth: 0.5,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  dataTableTitleText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },
});
