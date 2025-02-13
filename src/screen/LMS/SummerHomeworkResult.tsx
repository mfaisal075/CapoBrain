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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SummerHomeWorkResult = ({navigation}: any) => {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('LMS');
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
              onPress={() => navigation.navigate('LMS')}>
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
                  <Text style={styles.stdDetailsText}>Student ID:</Text>
                  <Text style={styles.stdDetailsText}>Student Name:</Text>
                  <Text style={styles.stdDetailsText}>Father Name:</Text>
                  <Text style={styles.stdDetailsText}>Class:</Text>
                  <Text style={styles.stdDetailsText}>Section:</Text>
                </View>
                <View style={styles.detailsCtr}>
                  <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                    GCGS1124S010
                  </Text>
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

                <View style={styles.printBtnCtr}>
                  <TouchableOpacity style={styles.printBtn}>
                    <Icon name="file" size={20} color={'#fff'} />
                    <Text style={styles.printBtnText}>Print</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default SummerHomeWorkResult;

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
});
