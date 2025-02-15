import {
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../../components/NavBar';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DataTable} from 'react-native-paper';

const ParentSummerHwResult = ({navigation}: any) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };
  const hideModal = () => {
    setIsVisible(false);
  };

  const [items] = useState([
    {
      sr: 1,
      id: 'GCGS1124S006',
      name: 'Hibba',
      className: 'Five',
      branchName: 'Main Branch',
    },
  ]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ParentLMS');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Summer Vacation Homework Result</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.navigate('ParentLMS')}>
              <Image
                source={require('../../../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../../../assets/back.png')}
                style={styles.bckBtnIcon}
              />
              <Text style={styles.bckBtnText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Student Details */}

          <ScrollView horizontal>
            <View style={styles.resultsCtr}>
              <View style={styles.headingCtr}>
                <Text style={styles.rsltHeading}>
                  Gujranwala City Grammar School
                </Text>
                <Text style={styles.branchText}>Main Branch</Text>
              </View>
              <View style={styles.stdDetails}>
                <View style={styles.detailsCtr}>
                  <Text style={styles.stdDetailsText}>Parent ID:</Text>
                  <Text style={styles.stdDetailsText}>Father Name:</Text>
                </View>
                <View style={styles.detailsCtr}>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    GCGS1124P006
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Abdullah
                  </Text>
                </View>
              </View>
              {/* Table */}
              <View style={styles.tblDataCtr}>
                <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header>
                      {[
                        'Sr#',
                        'ID',
                        'Name',
                        'Class Name',
                        'Branch Name',
                        'Action',
                      ].map((title, index) => (
                        <DataTable.Title
                          key={index}
                          textStyle={{
                            color: 'black',
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                          style={{
                            width: index === 0 ? 50 : 110, // Reduced width for the first header
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                            backgroundColor: '#F0F0F0',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {title}
                        </DataTable.Title>
                      ))}
                    </DataTable.Header>

                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <DataTable.Row key={index}>
                          {[
                            item.sr,
                            item.id,
                            item.name,
                            item.className,
                            item.branchName,
                          ].map((value, idx) => (
                            <DataTable.Cell
                              key={idx}
                              textStyle={{color: '#000', fontSize: 12}}
                              style={{
                                width: idx === 0 ? 50 : 110, // Reduced width for the first cell
                                paddingHorizontal: 5,
                                borderColor: '#000',
                                borderWidth: 0.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {value}
                            </DataTable.Cell>
                          ))}
                          <DataTable.Cell
                            key={'action'}
                            textStyle={{color: '#000', fontSize: 12}}
                            style={{
                              width: 110,
                              paddingHorizontal: 5,
                              borderColor: '#000',
                              borderWidth: 0.5,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {/* Download Button */}
                              <TouchableOpacity onPress={showModal}>
                                <View
                                  style={{
                                    width: 65,
                                    height: 30,
                                    backgroundColor: '#007BFF',
                                    padding: 5,
                                    borderRadius: 4,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                  }}>
                                  <Icon name="eye" size={16} color="#fff" />
                                  <Text style={{color: '#fff', fontSize: 12}}>
                                    View
                                  </Text>
                                </View>
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
                  </DataTable>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={hideModal}>
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
              <Text style={styles.modalTitle}>Add Summer Home Work</Text>
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
                onPress={() => hideModal()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
              <View style={[styles.stdDetails, {paddingHorizontal: 10}]}>
                <View style={styles.detailsCtr}>
                  <Text style={styles.stdDetailsText}>Student ID:</Text>
                  <Text style={styles.stdDetailsText}>Student Name:</Text>
                  <Text style={styles.stdDetailsText}>Father Name:</Text>
                  <Text style={styles.stdDetailsText}>Class:</Text>
                </View>
                <View style={styles.detailsCtr}>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    GCGS1124S006
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Hibba
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Abdullah
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Five (B)
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <View style={styles.attendanceCtr}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: 'rgba(0,0,0,0.6)',
                      textAlign: 'center',
                    }}>
                    No record present in the database!
                  </Text>

                  <View style={styles.printBtnCtr}>
                    <TouchableOpacity style={styles.printBtn}>
                      <Icon name="printer" size={20} color={'#fff'} />
                      <Text style={styles.printBtnText}>Print</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentSummerHwResult;

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
    textAlign: 'center',
    marginBottom: 10,
  },
  bckBtnCtr: {
    height: 'auto',
    width: '100%',
    justifyContent: 'flex-start', // Align buttons to the right
    flexDirection: 'row-reverse', // Reverse the direction of the buttons
    alignItems: 'center',
    paddingRight: 20,
    flexWrap: 'wrap',
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
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Student Details Container
  resultsCtr: {
    width: 'auto',
    height: 'auto',
  },
  headingCtr: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  rsltHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  branchText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    marginTop: 15,
  },
  examPickerCtr: {
    width: '60%',
    marginHorizontal: 20,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  stdDetails: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailsCtr: {
    width: '35%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 10,
  },
  stdDetailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  printBtnCtr: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  printBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
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
  datePickerContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: '80%',
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
});
