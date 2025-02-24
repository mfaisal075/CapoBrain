import {
  BackHandler,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Image} from 'react-native';
import {Dialog, Portal, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

const ApplyLeave = ({navigation}: any) => {
  const {token} = useUser();
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = ({event, selectedDate}: any) => {
    setShowDatePicker(false); // Hide the picker
    if (selectedDate) setDate(selectedDate); // Set the selected date
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchleave',
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

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true, // Fetch new data when screen is focused
  });

  const customHTMLElementModels = {
    center: HTMLElementModel.fromCustomModel({
      tagName: 'center',
      mixedUAStyles: {
        alignItems: 'center',
        textAlign: 'center',
      },
      contentModel: HTMLContentModel.block,
    }),
  };

  useEffect(() => {
    //Fetch Data
    fetchData();
    const backAction = () => {
      navigation.navigate('Home');
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
      {/* NavBar */}
      <NavBar />
      <ScrollView>
        <View style={styles.accountContainer}>
          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../assets/back.png')}
                style={styles.bckBtnIcon}
              />
              <Text style={styles.bckBtnText}>Dashboard</Text>
            </TouchableOpacity>
            {/* Apply Leave Button */}
            <TouchableOpacity style={styles.leaveBtn} onPress={showDialog}>
              <Text style={styles.bckBtnText}>Add Leave</Text>
            </TouchableOpacity>
          </View>

          <View style={{width: '100%'}}>
            <ScrollView
              horizontal
              style={{flex: 1, padding: 10}}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={refetch} />
              }>
              {data ? (
                <RenderHtml
                  contentWidth={Dimensions.get('window').width}
                  source={{html: data}}
                  customHTMLElementModels={customHTMLElementModels}
                  tagsStyles={{
                    h4: {
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#000',
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: '100%',
                      marginLeft: -10,
                    },
                    th: {
                      backgroundColor: '#f2f2f2',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      marginHorizontal: -5,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -10,
                    },
                    td: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      textAlign: 'center',
                      width: 90, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -3,
                    },
                    tr: {
                      backgroundColor: '#fff',
                    },
                    h6: {
                      marginVertical: 0,
                      textAlign: 'center',
                    },
                    span: {
                      backgroundColor: '#28a745', // Green background (Approved)
                      color: '#fff', // White text
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      alignSelf: 'center', // Center the badge
                    },
                    center: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    a: {
                      backgroundColor: '#3B82F6',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  }}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Add Leave Modal */}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{backgroundColor: '#fff', borderRadius: 10}}>
          <Dialog.Title style={styles.modalTitle}>Add Leave</Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity
              style={{position: 'absolute', right: 20, top: -55}}
              onPress={hideDialog}>
              <Icon name="close" size={28} color="#000" />
            </TouchableOpacity>
            <TextInput
              label="Subject *"
              theme={{
                colors: {
                  primary: '#3B82F6',
                },
              }}
              mode="outlined"
              style={{marginBottom: 10}}
            />

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  label="Date *"
                  value={date.toISOString().split('T')[0]} // Display date in YYYY-MM-DD format
                  theme={{
                    colors: {
                      primary: '#3B82F6',
                    },
                  }}
                  mode="outlined"
                  editable={false} // Prevent keyboard from opening
                  right={
                    <TextInput.Icon
                      icon="calendar"
                      onPress={() => setShowDatePicker(true)} // Open date picker on icon press
                    />
                  }
                />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

            <TextInput
              label="Description *"
              theme={{
                colors: {
                  primary: '#3B82F6',
                },
              }}
              mode="outlined"
              style={{marginBottom: 10, height: 100}}
            />
          </Dialog.Content>
          <Dialog.Actions style={styles.modalActions}>
            <TouchableOpacity style={styles.leaveBtn} onPress={hideDialog}>
              <Text style={styles.bckBtnText}>Save</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ApplyLeave;

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
  bckBtnCtr: {
    height: 50,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 20,
    marginTop: 20,
    marginHorizontal: 10,
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
  leaveBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  // Add Leave Modal
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  modalActions: {
    justifyContent: 'center',
  },
});
