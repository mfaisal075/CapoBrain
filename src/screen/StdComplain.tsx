import {
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
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StdComplain = ({navigation}: any) => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const complaintsData = [
    {
      sr: '1',
      name: 'Ayesha Zumar',
      email: 'Nill',
      contact: '0321456789',
      status: 'approved',
      action: '',
    },
    {
      sr: '2',
      name: 'Zainab',
      email: 'Nill',
      contact: '0321456789',
      status: 'rejected',
      action: '',
    },
  ];

  const filteredComplaints = complaintsData.filter(complaint =>
    Object.values(complaint).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  //Complain Modal
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [desc, setDesc] = useState('');
  const [descError, setDescError] = useState('');

  const validateFields = () => {
    let isValid = true;

    if (!desc) {
      setDescError('Complain Note  is required');
      isValid = false;
    } else {
      setDescError('');
    }

    return isValid;
  };
  {
    /*view modal*/
  }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#FFFFFF'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Complain</Text>
      </View>

      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 120,
            height: 30,
            backgroundColor: '#218838',
            borderRadius: 5,
            marginRight: 10,
            alignSelf: 'flex-end',
            marginTop:10
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
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={itemsPerPage}
            onValueChange={(value: number) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
            style={styles.picker}>
            <Picker.Item label="10" value={10} />
            <Picker.Item label="25" value={25} />
            <Picker.Item label="50" value={50} />
            <Picker.Item label="100" value={100} />
          </Picker>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor={'gray'}
          value={search}
          onChangeText={text => setSearch(text)}
        />
      </View>

      <ScrollView horizontal>
        <View>
        
        <FlatList
              style={styles.flatList}
              data={currentComplaints}
             
              keyExtractor={(item, index) => item.sr ? item.sr.toString() : index.toString()}
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {["Sr#", "Name", "Email", "Contact", "Status", "Action"].map((header) => (
                    <Text key={header} style={[styles.column, styles.headTable]}>{header}</Text>
                  ))}
                </View>
              )}
              renderItem={({ item, index }) => (
                <View style={[styles.row, { backgroundColor: index % 2 === 0 ? "white" : "#E2F0FF" }]}>
                  <Text style={styles.column}>{item.sr}</Text>
                  <Text style={styles.column}>{item.name}</Text>
                  <Text style={styles.column}>{item.email}</Text>
                  <Text style={styles.column}>{item.contact}</Text>
              
                  <View style={styles.iconContainer}>
                  <Image
                    style={styles.statusIcon}
                    source={
                      item.status === "approved"
                      ? require('../assets/approved.png')
                      : require('../assets/rejected.png')
                    }
                  />
                </View>

                <TouchableOpacity style={styles.iconContainer} onPress={toggleModl}>
                  <Image 
                    style={styles.actionIcon}
                    source={require('../assets/visible.png')}
                  />
                </TouchableOpacity>
              
                </View>
              )}
            />
 
         
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <Text style={styles.pageInfo}>
          Showing {indexOfFirstItem + 1} to{' '}
          {Math.min(indexOfLastItem, filteredComplaints.length)} of{' '}
          {filteredComplaints.length} entries
        </Text>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          <Text style={styles.pageText}>Previous</Text>
        </TouchableOpacity>
        <View style={styles.pageNumberContainer}>
          <Text style={styles.pageNumber}>{currentPage}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            setCurrentPage(prev =>
              indexOfLastItem < filteredComplaints.length ? prev + 1 : prev,
            )
          }>
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
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
              height: 1,
              backgroundColor: 'gray',
              width: wp('90%'),
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: 'gray',
              marginLeft: 20,
              marginTop: 20,
              height: 300,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Complain Note</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 114,
                fontSize: 14,
                backgroundColor: 'white',
              }}>
              *
            </Text>
            <View
              style={{
                borderRadius: 5,
                borderColor: 'gray',
              }}>
              <TextInput
                style={{
                  color: 'black',
                }}
                value={desc}
                onChangeText={setDesc}
                placeholder="Type Your Complain Here..."
              />
            </View>
          </View>
          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 390,
                left: 20,
              }}>
              {descError}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                console.log('Form is valid');
              } else {
                console.log('Form is invalid');
              }
            }}>
            <View
              style={{
                backgroundColor: '#218838',
                borderRadius: 5,
                width: 50,
                height: 30,
                alignSelf: 'center',
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
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
              <Text style={styles.valueText}>Ayesha Zumar</Text>
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
            <Text style={styles.valueText}>03214567890</Text>
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

export default StdComplain;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom:5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor:'#3b82f6'
  },
  backButton: {
    width: 24,
    height: 24,
    tintColor: 'white',
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign:'center',
    flex:1
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    marginLeft:10,
    marginRight:10
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height:30
  },
  picker: {
    width: 90,
    height: 50,
    color: '#000',
    top:-15
  },
  searchBar: {
    width: 120,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    padding:6,
    textAlign:'center',
    color:'gray'
  },
  table: {
    minWidth: 700,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageInfo: {
    fontSize: 14,
    marginRight: 10,
  },
  pageText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  pageNumberContainer: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  pageNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  column: {
    width: 140,
    padding:1
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 20,
    marginRight:90 
  },
  statusIcon: {
    width: 17,
    height: 17,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
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
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
  },
  flatList: {
    margin: 10,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headTable: {
    fontWeight: "bold",
    backgroundColor: "#3b82f6",
    color: "white",
  },
});

