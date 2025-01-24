import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import NavBar from '../components/NavBar';
import {Image} from 'react-native';

const Attendance = ({navigation}: any) => {
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
            <Text style={styles.tblHdCtr}>Student Attendance</Text>
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
            <View style={styles.stdDtls}>
              <View style={styles.headingCtr}>
                <Text style={styles.heading}>Student Name</Text>
              </View>
              <View style={styles.headingCtr}>
                <Text style={styles.simpleText}>Hanzala Ahmad</Text>
              </View>
              <View style={styles.headingCtr}>
                <Text style={styles.heading}>Class</Text>
              </View>
              <View style={styles.headingCtr}>
                <Text style={styles.simpleText}>Three</Text>
              </View>
              <View style={styles.headingCtr}>
                <Text style={styles.heading}>Section</Text>
              </View>
              <View style={styles.headingCtr}>
                <Text style={styles.simpleText}>A</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.attendanceCtr}>
            <Text style={{
              fontSize: 18,
              fontWeight: '500',
              color: 'rgba(0,0,0,0.6)',
              textAlign: 'center',
            }}>No record present in the database!</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Attendance;

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

  stdDtls: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  headingCtr: {
    height: '100%',
    width: 'auto',
    borderWidth: 0.5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  simpleText: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
