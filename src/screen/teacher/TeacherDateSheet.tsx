import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {Dialog, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const TeacherDateSheet = ({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [branchValue, setBranchValue] = useState(null);
  const [classValue, setClassValue] = useState(null);
  const [sectionValue, setSectionValue] = useState(null);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const branchItems: {label: string; value: string}[] = [];

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
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Date Sheet</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => showDialog()}>
              <Text style={styles.bckBtnText}>Add Date Sheet</Text>
            </TouchableOpacity>
          </View>

          {/* Student Details */}

          <View style={styles.attendanceCtr}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: 'rgba(0,0,0,0.6)',
                textAlign: 'center',
              }}>
              No record present in the database!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Date Sheet Modal */}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{backgroundColor: '#fff', borderRadius: 10}}>
          <Dialog.Title>Add Date Sheet</Dialog.Title>
          <Dialog.Content style={styles.modalBody}>
            <TouchableOpacity
              style={styles.clsIconCtr}
              onPress={() => hideDialog()}>
              <Icon name="close" size={26} color={'#000'} />
            </TouchableOpacity>
            <View style={styles.addSbjCtr}>
              <TouchableOpacity style={[styles.bckBtn, {width: 120}]}>
                <Text style={styles.bckBtnText}>Add Subject</Text>
              </TouchableOpacity>
            </View>

            {/* Dropdown Pickers Conatiner */}
            <View style={styles.pickerCtr}>
              <View style={[styles.picker, {marginTop: 10}]}>
                <Text style={styles.text}>
                  Branch <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={branchOpen}
                  value={branchValue}
                  setOpen={setBranchOpen}
                  setValue={setBranchValue}
                  placeholder="Select Branch"
                  items={branchItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                  }}
                />
              </View>
              <View style={styles.picker}>
                <Text style={styles.text}>
                  Class <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={classOpen}
                  value={classValue}
                  setOpen={setClassOpen}
                  setValue={setClassValue}
                  placeholder="Select Class"
                  items={branchItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                  }}
                />
              </View>
              <View style={styles.picker}>
                <Text style={styles.text}>
                  Section <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={sectionOpen}
                  value={sectionValue}
                  setOpen={setSectionOpen}
                  setValue={setSectionValue}
                  placeholder="Select Section"
                  items={branchItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                  }}
                />
              </View>
            </View>
            <View style={styles.dataCtr}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: 'rgba(0,0,0,0.6)',
                  textAlign: 'center',
                }}>
                No record present in the database!
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent: 'center'}}>
            <TouchableOpacity style={styles.bckBtn}>
              <Text style={styles.bckBtnText}>Save</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default TeacherDateSheet;

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
  bckBtnCtr: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  bckBtn: {
    backgroundColor: '#28A745',
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
    height: 300,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Add Date Sheet modal styling
  addSbjCtr: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  modalBody: {
    borderTopWidth: 0.5,
    borderColor: 'gray',
    paddingTop: 5,
  },
  pickerCtr: {
    height: 'auto',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: '5%',
  },
  picker: {
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    position: 'absolute',
    left: 15,
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
  dataCtr: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
  },
  clsIconCtr: {
    position: 'absolute',
    right: 20,
    top: -45,
  },
});
