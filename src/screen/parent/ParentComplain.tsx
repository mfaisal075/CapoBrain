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
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  name: string;
  email: string;
  contact: string;
  status: string;
  action: string;
};

const ParentComplain = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState('');
  const [descError, setDescError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Note is required'),
  });

  const handleSave = (values: any) => {
    setLoading(true);

    setTimeout(() => {
      Alert.alert('Success', 'Data saved successfully!');
      setLoading(false);
    }, 2000);
  };

  const validateFields = () => {
    let isValid = true;

    if (!desc) {
      setDescError('Complain Note is required');
      isValid = false;
    } else {
      setDescError('');
    }

    return isValid;
  };

  const originalData: TableRow[] = [
    {
      sr: '1',
      name: 'Iftikhar',
      email: 'Nill',
      contact: 'Nill',
      status: 'pending',
      action: '',
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

  //View Modal
  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  useEffect(() => {
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
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Complain</Text>
      </View>

      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 110,
            height: 30,
            backgroundColor: '#218838',
            borderRadius: 5,
            alignSelf: 'flex-end',
            margin: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
              marginTop: 3,
            }}>
            Add Complain
          </Text>
        </View>
      </TouchableOpacity>

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

        <View style={styles.searchcontainer}>
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
                {['Sr#', 'Name', 'Email', 'Contact', 'Status', 'Action'].map(
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
                <Text style={styles.column}>{item.name}</Text>
                <Text style={styles.column}>{item.email}</Text>
                <Text style={styles.column}>{item.contact}</Text>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.statusIcon}
                    source={
                      item.status === 'pending'
                        ? require('../../assets/pending.png')
                        : item.status === 'approved'
                        ? require('../../assets/approved.png')
                        : require('../../assets/rejected.png')
                    }
                  />
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={toggleModl}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
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
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 550,
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
            <Text style={{color: '#6C757D', fontSize: 18}}>Add Complain</Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: 'auto',
              height: 1.5,
              backgroundColor: 'gray',
            }}
          />

          {/* complain note*/}
          <Formik
            initialValues={{name: ''}}
            validationSchema={validationSchema}
            onSubmit={handleSave}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text
                  style={{
                    position: 'absolute',
                    top: -11,
                    left: 28,
                    fontSize: 14,
                    color: 'black',
                    backgroundColor: 'white',
                    paddingHorizontal: 4,
                    marginTop: 30,
                    zIndex: 1,
                  }}>
                  Complain Note
                </Text>
                <TextInput
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    borderRadius: 5,
                    borderColor: 'gray',
                    borderWidth: 1,
                    height: 300,
                    textAlignVertical: 'top',
                    marginTop: 30,
                  }}
                  multiline={true}
                />
                {touched.name && errors.name && (
                  <Text
                    style={{
                      color: 'red',
                      marginLeft: 20,
                    }}>
                    {errors.name}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={loading}>
                  <View
                    style={{
                      borderRadius: 5,
                      height: 30,
                      marginTop: 20,
                      backgroundColor: '#218838',
                      width: 60,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginTop: 5,
                        color: 'white',
                      }}>
                      {loading ? 'Saving...' : 'Save'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </Modal>

      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 300,
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
              Complain Detail
            </Text>

            <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: 'gray',
              width: wp('90%'),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={styles.lblText}>Name</Text>
              <Text style={styles.valueText}>Iftikhar</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 50,
              }}>
              <Text style={styles.lblText}>Email</Text>
              <Text style={styles.valueText}>---</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10,
            }}>
            <Text style={styles.lblText}>Contact</Text>
            <Text style={styles.valueText}>---</Text>
          </View>

          <View
            style={{
              marginLeft: 10,
              marginTop: 10,
            }}>
            <Text style={styles.lblText}>Description:</Text>
            <Text style={styles.valueText}>abc</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentComplain;

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
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
    textAlign: 'center',
    flex: 1,
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
  searchcontainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 120,
    padding: 5,
    textAlign: 'center',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 30,
    marginRight: 50,
  },
  statusIcon: {
    width: 25,
    height: 25,
    marginLeft: 50,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
    marginLeft: 80,
  },
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
  },
});
