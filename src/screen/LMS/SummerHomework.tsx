import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import NavBar from '../../components/NavBar';

const SummerHomework = ({navigation}: any) => {
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
            <Text style={styles.tblHdCtr}>Summer Vacation Homework</Text>
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
              <Text style={styles.bckBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bckBtn,
                {backgroundColor: '#3B82F6', marginRight: 8},
              ]}
              onPress={() => navigation.navigate('SummerHomeworkResult')}>
              <Text style={styles.bckBtnText}>Summer Homework Result</Text>
            </TouchableOpacity>
          </View>

          {/* Student Details */}

          <View style={styles.attendanceCtr}>
            <Text
              style={{
                marginTop: 20,
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
  );
};

export default SummerHomework;

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
    fontSize: 20,
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
});
