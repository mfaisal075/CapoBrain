import {
  Alert,
  BackHandler,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

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
        console.log(response.data.newsoutput);

        return response.data.newsoutput;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    refetch();
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
    <View style={styles.container}>
      <NavBar />

      {/* Main Content */}
      <ScrollView style={styles.mainContainer}>
        {/* Student Details */}
        <View style={styles.studentDetails}>
          <View style={styles.stdName}>
            <View style={styles.profilePicContainer}>
              <Image
                source={require('../../assets/avatar.png')}
                style={styles.profilePic}
              />
            </View>
            <View style={styles.txtConatiner}>
              <Text style={styles.nameTxt}>{userData?.user.name}</Text>
              <Text style={styles.nameTxt}>{userData?.user.role}</Text>
              <Text style={styles.nameTxt}>{userData?.user.user_name}</Text>
            </View>
          </View>
          <View style={styles.otherDetails}>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../../assets/user.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>{userData?.user.name}</Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../../assets/email.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.user.email ?? '--'}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../../assets/smartphone.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.user.contact ?? '--'}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../../assets/id-card.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>{userData?.user.cnic}</Text>
            </View>
          </View>
          <View style={styles.accountStatus}>
            <View style={styles.statusHeadingContainer}>
              <Text style={styles.statusHeading}>Account Status</Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Salary Payable:{' '}
                {userData?.teacher_account.acc_payable_amount ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Paid Salary: {userData?.teacher_account.acc_paid_amount ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Inventory: {userData?.teacher_account.arrears_amount ?? '0'}
              </Text>
            </View>
          </View>
        </View>
        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TimeTable')}>
              <Image
                source={require('../../assets/time.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Time Table</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherAccount')}>
              <Image
                source={require('../../assets/money.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Account</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('LessonPlan')}>
              <Image
                source={require('../../assets/book.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Lesson Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherDateSheet')}>
              <Icon name="calendar" size={30} color={'#3B82F6'} />
              <Text style={styles.btnText}>Date Sheet</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherAttendance')}>
              <Image
                source={require('../../assets/attendance.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('LibraryBook')}>
              <Image
                source={require('../../assets/library.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Library Book</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherApplyLeave')}>
              <Image
                source={require('../../assets/about.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherHomework')}>
              <Image
                source={require('../../assets/homework.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Home Work</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherTodos')}>
              <Image
                source={require('../../assets/checklist.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Todo's</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherDownload')}>
              <Image
                source={require('../../assets/download.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Downloads</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.btnRow, {justifyContent: 'center'}]}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('TeacherUpload')}>
              <Image
                source={require('../../assets/upload.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* News & Events */}
        <View style={styles.newsContainer}>
          <View style={styles.newsHeadingContainer}>
            <Text style={styles.newsHeading}>
              Latest News & Events & Notices
            </Text>
          </View>
          <ScrollView
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
                  table: {
                    width: '100%',
                  },
                  tr: {
                    backgroundColor: '#fff',
                  },
                  ul: {},
                  li: {
                    fontSize: 16,
                    color: '#333',
                  },
                }}
              />
            ) : null}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default TeacherHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },

  // Main Content style
  mainContainer: {
    width: '100%',
  },
  studentDetails: {
    height: 360,
    width: '90%',
    backgroundColor: 'white',
    marginHorizontal: '5%',
    borderRadius: 10,
    marginTop: 20,
    borderColor: '#3B82F6',
    borderWidth: 0.5,
  },
  stdName: {
    height: '12%',
    width: '60%',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profilePicContainer: {
    height: 60,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3B82F6',
    borderWidth: 0.5,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  txtConatiner: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  nameTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  otherDetails: {
    height: '30%',
    width: '100%',
    marginBottom: 15,
    marginTop: 15,
    flexDirection: 'column',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  otherDetailsIcon: {
    height: 22,
    width: 22,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: '#3B82F6',
  },
  otherDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  otherDetailsText: {
    fontSize: 14,
    fontWeight: 'ultralight',
    color: '#3B82F6',
  },
  // accountStatus
  accountStatus: {
    marginTop: 15,
    height: '30%',
    width: '100%',
  },
  statusHeadingContainer: {
    height: 40,
    width: '90%',
    borderColor: '#3B82F6',
    borderTopWidth: 0.6,
    borderBottomWidth: 0.5,
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  statusHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statusDetails: {
    marginHorizontal: '5%',
    marginTop: 8,
  },
  statusDetailsText: {
    fontSize: 16,
    fontWeight: 'ultralight',
    color: '#3B82F6',
  },

  // Buttons Container
  buttonsContainer: {
    height: 'auto',
    width: '100%',
    paddingHorizontal: '5%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  btnRow: {
    marginTop: 10,
    marginBottom: 5,
    height: 85,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnContainer: {
    height: 90,
    width: '48%',
    backgroundColor: '#fff',
    borderColor: '#3B82F6',
    borderWidth: 0.7,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: '#3B82F6',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'ultralight',
    color: '#3B82F6',
  },

  // News & Events
  newsContainer: {
    height: 300,
    width: '90%',
    backgroundColor: 'white',
    marginHorizontal: '5%',
    borderRadius: 10,
    marginTop: 20,
    borderColor: '#3B82F6',
    borderWidth: 0.5,
    marginBottom: 20,
  },
  newsHeadingContainer: {
    height: 40,
    width: '90%',
    borderColor: '#3B82F6',
    borderBottomWidth: 0.5,
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  newsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  newsBtn: {
    height: 150,
    marginTop: 10,
    paddingVertical: 10,
    width: '90%',
    marginHorizontal: '5%',
    borderRadius: 10,
    borderColor: '#3B82F6',
    borderWidth: 0.5,
  },
  eventsContainer: {
    height: 120,
    width: '90%',
    marginHorizontal: '5%',
    marginTop: 10,
  },
  eventsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 10,
  },
  eventsContainerBtn: {
    height: 40,
    width: '48%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsBtnNotSlt: {
    height: 40,
    width: '50%',
    marginTop: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsContainerBtn1: {
    height: 40,
    width: '50%',
    marginTop: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsContainerBtnText1: {
    fontSize: 12,
    fontWeight: 'ultralight',
    color: '#fff',
  },
  eventsContainerBtnText: {
    fontSize: 12,
    fontWeight: 'ultralight',
    color: '#fff',
  },
  eventsBtnNotSltText: {
    fontSize: 12,
    fontWeight: 'ultralight',
    color: '#3B82F6',
  },

  // Attendance Container
  attendanceContainer: {
    height: 500,
    width: '90%',
    marginTop: 20,
    backgroundColor: 'white',
    marginHorizontal: '5%',
    borderRadius: 10,
    borderColor: '#3B82F6',
    borderWidth: 0.5,
    marginBottom: 20,
  },
  atdHeadingContainer: {
    height: '20%',
    width: '90%',
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  abtOpt: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    tintColor: '#3B82F6',
    position: 'absolute',
    right: 10,
  },
  atdCount: {
    height: 'auto',
    width: '90%',
    marginHorizontal: '5%',
    marginTop: 5,
    flexDirection: 'column',
  },
  atdCountContainer: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#000',
    borderWidth: 0.1,
    elevation: 2,
  },
  atdCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    borderRightColor: '#3B82F6',
    borderRightWidth: 2,
    paddingRight: 10,
  },
  atdCountText1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    paddingLeft: 10,
  },
  chartContainer: {
    height: '100%',
    width: '100%',
    paddingHorizontal: '10%',
    marginTop: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBox: {
    width: 12,
    height: 12,
    marginRight: 10,
    borderRadius: 3,
  },
  labelText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginRight: 5,
  },
});
