import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import DropDownPicker from 'react-native-dropdown-picker';
import {Avatar} from 'react-native-paper';

const Result = ({navigation}: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const examItems = [
    {label: 'Mids', value: 'mids'},
    {label: 'Annual', value: 'annual'},
    {label: 'Mid', value: 'mid'},
    {label: 'Final', value: 'final'},
    {label: 'MID TERM', value: 'mid_term'},
    {label: 'ANNUAL TERM', value: 'annual_term'},
    {label: 'MOCK TEST', value: 'mock_test'},
    {label: 'Grand Test', value: 'grand_test'},
    {label: 'December Test', value: 'december_test'},
    {label: 'Phase Test', value: 'phase_test'},
  ];

  useEffect(() => {
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
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Results</Text>
          </View>

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
              <View style={styles.examPickerCtr}>
                <DropDownPicker
                  open={open}
                  value={value}
                  setOpen={setOpen}
                  setValue={setValue}
                  placeholder="Select Exams Type Filter"
                  items={examItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 180,
                  }}
                />
              </View>
              <View style={styles.stdDetails}>
                <View style={styles.detailsCtr}>
                  <Text style={styles.stdDetailsText}>Student Name:</Text>
                  <Text style={styles.stdDetailsText}>Father Name:</Text>
                  <Text style={styles.stdDetailsText}>Class:</Text>
                  <Text style={styles.stdDetailsText}>Section:</Text>
                </View>
                <View style={styles.detailsCtr}>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Hanzala Ahmad
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Aftab Ahmad
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    Three
                  </Text>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    A
                  </Text>
                </View>
                <View style={styles.picCtr}>
                  <Avatar.Image
                    size={100}
                    source={require('../assets/avatar.png')}
                  />
                </View>
              </View>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default Result;

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

  // Results Styles
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
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  branchText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
    marginLeft: 30,
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailsCtr: {
    width: '30%',
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
  picCtr: {
    width: '40%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
