import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import NavBar from '../../components/NavBar';
import {ScrollView} from 'react-native';
import {Image} from 'react-native';

const ParentLMS = ({navigation}: any) => {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ParentHome');
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
            <Text style={styles.tblHdCtr}>Lecture</Text>
          </View>

          {/* Buttons Container  */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.navigate('ParentHome')}>
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
            <TouchableOpacity
              style={[styles.bckBtn, {backgroundColor: '#3B82F6'}]}
              onPress={() => navigation.navigate('ParentCourses')}>
              <Text style={styles.bckBtnText}>Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bckBtn, {backgroundColor: '#3B82F6'}]}
              onPress={() => navigation.navigate('ParentSummerHw')}>
              <Text style={styles.bckBtnText}>Summer Homework</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bckBtn,
                {backgroundColor: '#3B82F6', marginTop: 10},
              ]}
              onPress={() => navigation.navigate('ParentSummerHwResult')}>
              <Text style={styles.bckBtnText}>Summer Homework Result</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bckBtn,
                {backgroundColor: '#3B82F6', marginTop: 10},
              ]}
              onPress={() => navigation.navigate('ParentLibraryBooks')}>
              <Text style={styles.bckBtnText}>Library Books</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bckBtn,
                {backgroundColor: '#3B82F6', marginTop: 10},
              ]}
              onPress={() => navigation.navigate('ParentDailyDiary')}>
              <Text style={styles.bckBtnText}>Daily Diary</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bckBtn,
                {backgroundColor: '#3B82F6', marginTop: 10},
              ]}
              onPress={() => navigation.navigate('ParentDateSheet')}>
              <Text style={styles.bckBtnText}>Date Sheet</Text>
            </TouchableOpacity>
          </View>
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ParentLMS;

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
    marginLeft: 10, // Add margin to the left to space out buttons
    marginTop: 10, // Add margin to the top to space out buttons in the next row
  },
  bckBtnText: {
    color: '#fff',
    fontSize: 12,
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
    marginTop: 20,
  },
});
