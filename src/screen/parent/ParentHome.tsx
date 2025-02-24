import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {TouchableOpacity} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {useFocusEffect} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface UserData {
  user: {
    role: string;
    email: string;
    contact: string;
    name: string;
    user_name: string;
    cnic: string;
  };
  parent_receiveable: number;
  parent_paid: number;
  parent_inventory: number;
  parent_balance: number;
}

const ParentHome = ({navigation}: any) => {
  const [newsBtn, setNewsBtn] = useState('1');
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
        console.error('Error fetching data', error);
      }
    } else {
      console.log('User is not authenticated');
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
      {/* Nav Bar */}
      <NavBar />

      {/* Main Content */}
      <ScrollView style={styles.mainContainer}>
        {/* Student Details */}
        <View style={styles.studentDetails}>
          <View style={styles.stdName}>
            <View style={styles.profilePicContainer}>
              <Image
                source={require('../../assets/user.png')}
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
                Receivable: {userData?.parent_receiveable ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Paid: {userData?.parent_paid ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Inventory: {userData?.parent_inventory ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Balance: {userData?.parent_balance ?? '0'}
              </Text>
            </View>
          </View>
        </View>
        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentAccount')}>
              <Image
                source={require('../../assets/money.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentLMS')}>
              <Image
                source={require('../../assets/graduation.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>LMS</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentAttendance')}>
              <Image
                source={require('../../assets/attendance.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentResult')}>
              <Image
                source={require('../../assets/report-card.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Result</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentHomeWork')}>
              <Image
                source={require('../../assets/writing.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Home Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentApplyLeave')}>
              <Image
                source={require('../../assets/about.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Apply Leave</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentDownload')}>
              <Image
                source={require('../../assets/download.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>DownLoad</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ParentChat')}>
              <Icon name="chat" size={30} color={'#3B82F6'} />
              <Text style={styles.btnText}>Chat</Text>
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
                  ul: {
                    padding: 20,
                  },
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

export default ParentHome;

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
    height: 400,
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
    flexDirection: 'column',
    marginVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 15,
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
    marginTop: 5,
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
    marginTop: 15,
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
    marginBottom: 20,
    borderColor: '#3B82F6',
    borderWidth: 0.5,
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
