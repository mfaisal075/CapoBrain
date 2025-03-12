import {
  Alert,
  BackHandler,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface UserData {
  user: {
    name: string;
    user_name: string;
    role: string;
    email: string;
    contact: string;
    cnic: string;
  };
  teacher_account: {
    acc_payable_amount: string;
    acc_paid_amount: string;
    arrears_amount: string;
  };
}

const TeacherHome = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchprofile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUserData(response.data);

        return response.data.newsoutput;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: 'white'}}>
      <View style={styles.header}>
        {/* profile user icon*/}
        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherProfile' as never)}>
          <Image
            style={{
              width: 40,
              height: 40,
              alignSelf: 'flex-end',
              marginRight: hp('2%'),
              marginTop: hp('2%'),
              tintColor: 'white',
            }}
            source={require('../../assets/user.png')}
          />
        </TouchableOpacity>

        <View style={styles.std}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: 70,
                height: 70,
                marginTop: hp('4%'),
                marginLeft: hp('2%'),
              }}
              source={require('../../assets/avatar.png')}
            />

            <View style={{marginLeft: hp('2%'), marginTop: hp('4%')}}>
              <Text style={styles.headerText}>{userData?.user.name}</Text>
              <Text style={styles.Text}>{userData?.user.role}</Text>
              <Text style={styles.Text}>{userData?.user.user_name}</Text>
            </View>
          </View>
        </View>
      </View>

      {/*status*/}
      <View style={styles.circles}>
        <View>
          <ImageBackground
            source={require('../../assets/attcir.png')}
            style={styles.innCir}
            imageStyle={{borderRadius: 50}}>
            <Text style={styles.circleText}>100%</Text>
          </ImageBackground>

          <Text
            style={{
              textAlign: 'center',
              color: '#3b82f6',
              fontWeight: 'bold',
              fontSize: 15,
            }}>
            Attendance
          </Text>
        </View>

        <View>
          <ImageBackground
            source={require('../../assets/balance.png')}
            style={styles.centerCir}
            imageStyle={{borderRadius: 50}}>
            <Text style={styles.circleText}>
              {userData?.teacher_account.acc_payable_amount}
            </Text>
          </ImageBackground>
          <Text
            style={{
              textAlign: 'center',
              color: '#3b82f6',
              fontWeight: 'bold',
              fontSize: 15,
            }}>
            Balance
          </Text>
        </View>
        <View>
          <ImageBackground
            source={require('../../assets/resultcircle.png')}
            style={styles.innCir}
            imageStyle={{borderRadius: 50}}>
            <Text style={styles.circleText}>100%</Text>
          </ImageBackground>
          <Text
            style={{
              textAlign: 'center',
              color: '#3b82f6',
              fontWeight: 'bold',
              fontSize: 15,
            }}>
            Result
          </Text>
        </View>
      </View>

      {/*icons*/}
      <View style={styles.iconView}>
        {/* 1st Row */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherAccount' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 50,
                  height: 30,
                }}
                source={require('../../assets/1.png')}
              />
              <Text>Accounts</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherAttendance' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 38,
                  height: 30,
                }}
                source={require('../../assets/2.png')}
              />
              <Text>Attendance</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherHomework' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 40,
                  height: 30,
                }}
                source={require('../../assets/3.png')}
              />
              <Text>Home Work</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherDownload' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 32,
                  height: 30,
                }}
                source={require('../../assets/4.png')}
              />
              <Text style={{textAlign: 'center'}}>Download</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2nd Row */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherApplyLeave' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 32,
                  height: 33,
                }}
                source={require('../../assets/5.png')}
              />
              <Text>Apply Leave</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LibraryBook' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                  tintColor: '#00879E',
                }}
                source={require('../../assets/bookz.png')}
              />
              <Text
                style={{
                  fontSize: 13,
                }}>
                Library Books
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherTodos' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                  tintColor: '#B03052',
                }}
                source={require('../../assets/todo.png')}
              />
              <Text style={{textAlign: 'center'}}>Todo's</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherUpload' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 32,
                  height: 30,
                  tintColor: '#255F38',
                }}
                source={require('../../assets/upload.png')}
              />
              <Text style={{textAlign: 'center'}}>Upload</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3rd Row */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherMessages' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 26,
                  height: 30,
                }}
                source={require('../../assets/9.png')}
              />
              <Text
                style={{
                  fontSize: 13,
                }}>
                Messages
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherCalendar' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 27,
                  height: 30,
                }}
                source={require('../../assets/10.png')}
              />
              <Text style={{textAlign: 'center'}}>Calendar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherComplain' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 44,
                  height: 34,
                }}
                source={require('../../assets/11.png')}
              />
              <Text style={{textAlign: 'center'}}>Complain</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherFeedback' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                  tintColor: '#205781',
                }}
                source={require('../../assets/feedback.png')}
              />
              <Text style={{textAlign: 'center'}}>Feedback</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*4th Row*/}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TimeTable' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 31,
                  height: 31,
                  tintColor: '#19692C',
                }}
                source={require('../../assets/time.png')}
              />
              <Text>Time Table</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LessonPlan' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 28,
                  height: 30,
                  tintColor: '#494F54',
                }}
                source={require('../../assets/book.png')}
              />
              <Text>Lesson Plan</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TeacherDateSheet' as never)}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 25,
                  height: 30,
                  tintColor: '#A71D2A',
                }}
                source={require('../../assets/ds.png')}
              />
              <Text>Date Sheet</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/*news*/}
      <TouchableOpacity
        onPress={() => navigation.navigate('TeacherAnnouncement' as never)}>
        <View style={styles.update}>
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: hp('2%'),
              alignSelf: 'center',
              tintColor: 'white',
            }}
            source={require('../../assets/update.png')}
          />
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              marginLeft: hp('1%'),
              alignSelf: 'center',
              fontSize: 20,
            }}>
            Announcements
          </Text>
          <Image
            style={{
              width: 50,
              height: 50,
              alignSelf: 'center',
              tintColor: 'white',
              marginRight: hp('2%'),
            }}
            source={require('../../assets/arrowc.png')}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{color: '#3b82f6', fontSize: RFPercentage(2)}}>
          Developed with ❤️ by: Technic Mentors
        </Text>
      </View>
    </ScrollView>
  );
};

export default TeacherHome;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3b82f6',
    width: wp('100%'),
    height: hp('20%'),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  std: {
    width: 'auto',
    height: 'auto',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3b82f6',
    marginTop: hp('1%'),
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  Text: {
    color: 'white',
    fontSize: 16,
  },

  AccountB: {
    alignSelf: 'flex-end',
    marginRight: hp('2%'),
    marginTop: hp('2%'),
  },
  accText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconView: {
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#3b82f6',
    marginTop: hp('1%'),
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },

  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: wp('20%'),
  },
  update: {
    backgroundColor: '#3b82f6',
    height: 70,
    width: wp('93%'),
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  attendance: {
    backgroundColor: '#3b82f6',
    height: 70,
    width: wp('93%'),
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    marginBottom: hp('5%'),
  },
  footer: {
    position: 'absolute',
    bottom: hp('1%'),
    width: '100%',
    alignItems: 'center',
  },
  circles: {
    flexDirection: 'row',
    marginBottom: hp('1%'),
    marginRight: hp('2%'),
    marginLeft: hp('2%'),
    justifyContent: 'space-evenly',
    marginTop: -hp('5%'),
  },
  innCir: {
    borderRadius: 50,
    height: 100,
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('7%'),
    overflow: 'hidden',
  },
  circleText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  centerCir: {
    borderRadius: 100,
    backgroundColor: 'white',
    height: 130,
    width: 130,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 80,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
