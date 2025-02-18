import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PieChart} from 'react-native-chart-kit';
import NavBar from '../components/NavBar';
import {Alert} from 'react-native';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UserData {
  cand: {
    admissiondate: string;
    cand_age: string;
    cand_bform: string;
    cand_bra_id: number;
    cand_class_id: number;
    cand_dob: string;
    cand_gender: string;
    cand_mothertongue: string;
    cand_name: string;
    cand_pic: string;
    cand_school_id: number;
    cand_section_id: number;
    cand_status: string;
    cand_user_id: number;
    created_at: string;
    family_id: string;
    form_id: string;
    id: number;
    nationality_id: number;
    par_id: number;
    religion_id: number;
    sibling_status: string;
    student_id: string;
    updated_at: string;
  };
  cand_class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  parent: {
    par_fathername: string;
  };
  user: {
    role: string;
    email: string;
  };
}

const screenWidth = Dimensions.get('window').width;

const Home = ({navigation}: any) => {
  const [newsBtn, setNewsBtn] = useState('1');
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  //Chart Data
  const data = [
    {
      name: 'Present Students',
      population: 70,
      color: '#FFB4A2',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Absent Students',
      population: 20,
      color: '#FED6E3',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Present Staff',
      population: 90,
      color: '#A8EDEA',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Absent Staff',
      population: 10,
      color: '#FF5733',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

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

        setUserData((await response).data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    } else {
      console.log('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();

    //Naviagte to Home on back key press
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
                source={require('../assets/user.png')}
                style={styles.profilePic}
              />
            </View>
            <View style={styles.txtConatiner}>
              <Text style={styles.nameTxt}>{userData?.cand.cand_name}</Text>
              <Text style={styles.nameTxt}>{userData?.user.role}</Text>
              <Text style={styles.nameTxt}>{userData?.cand.student_id}</Text>
            </View>
          </View>
          <View style={styles.otherDetails}>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../assets/person.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.parent.par_fathername}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Icon
                name="school"
                size={22}
                color="#3B82F6"
                style={{marginRight: 10}}
              />

              <Text style={styles.otherDetailsText}>
                {userData?.cand_class.cls_name} ({userData?.section.sec_name})
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../assets/email.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.user.email}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Icon
                name="map-marker"
                size={22}
                color="#3B82F6"
                style={{marginRight: 10}}
              />
              <Text style={styles.otherDetailsText}></Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../assets/smartphone.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}></Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../assets/id-card.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.cand.cand_bform}
              </Text>
            </View>
          </View>
          <View style={styles.accountStatus}>
            <View style={styles.statusHeadingContainer}>
              <Text style={styles.statusHeading}>Account Status</Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>Receivable: 2000</Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>Paid: 0</Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>Inventory: 0</Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>Balance: 2000</Text>
            </View>
          </View>
        </View>
        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('Account')}>
              <Image
                source={require('../assets/money.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('Attendance')}>
              <Image
                source={require('../assets/attendance.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Attendance</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('HomeWork')}>
              <Image
                source={require('../assets/writing.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Home Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('Download')}>
              <Image
                source={require('../assets/download.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>DownLoad</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('ApplyLeave')}>
              <Image
                source={require('../assets/about.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Apply Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('Result')}>
              <Image
                source={require('../assets/report-card.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Result</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('LMS')}>
              <Image
                source={require('../assets/graduation.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>LMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => navigation.navigate('Course')}>
              <Image
                source={require('../assets/books.png')}
                style={styles.btnIcon}
              />
              <Text style={styles.btnText}>Course</Text>
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
          <View style={styles.newsBtn}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={
                  newsBtn === '1'
                    ? styles.eventsContainerBtn
                    : styles.eventsBtnNotSlt
                }
                onPress={() => setNewsBtn('1')}>
                <Text
                  style={
                    newsBtn === '1'
                      ? styles.eventsContainerBtnText
                      : styles.eventsBtnNotSltText
                  }>
                  Science & Technology
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  newsBtn === '2'
                    ? styles.eventsContainerBtn1
                    : styles.eventsBtnNotSlt
                }
                onPress={() => setNewsBtn('2')}>
                <Text
                  style={
                    newsBtn === '2'
                      ? styles.eventsContainerBtnText1
                      : styles.eventsBtnNotSltText
                  }>
                  Join us for [School Name]'s
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={
                  newsBtn === '3'
                    ? [styles.eventsContainerBtn, {width: '100%'}]
                    : [styles.eventsBtnNotSlt, {width: '100%'}]
                }
                onPress={() => setNewsBtn('3')}>
                <Text
                  style={
                    newsBtn === '3'
                      ? styles.eventsContainerBtnText
                      : styles.eventsBtnNotSltText
                  }>
                  Anual Science & Technology Fair on [Date] to witness exciting
                  student Innovations!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.eventsContainer}>
            <Text style={styles.eventsText}>Iqbal Day 9-Nov-2025</Text>
            <Text style={styles.eventsText}>Smog Holiday 25-Dec-2025</Text>
          </View>
        </View>
        {/* Attendance Conatiner */}
        <View style={styles.attendanceContainer}>
          <View style={styles.atdHeadingContainer}>
            <Text style={styles.statusHeading}>Student & Attendance</Text>
            <Image
              source={require('../assets/information.png')}
              style={styles.abtOpt}
            />
          </View>
          <View style={styles.atdCount}>
            <View style={styles.atdCountContainer}>
              <Text style={styles.atdCountText}>Present Std: 70</Text>
              <Text style={styles.atdCountText1}>Absent Std: 30</Text>
            </View>
            <View style={styles.atdCountContainer}>
              <Text style={styles.atdCountText}>Present Staff: 70</Text>
              <Text style={styles.atdCountText1}>Absent Staff: 30</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <PieChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={{
                color: () => `rgba(0, 0, 0, 0.5)`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={false}
            />
            <View style={styles.labelsContainer}>
              {data.map((item, index) => (
                <View key={index} style={styles.labelRow}>
                  <View
                    style={[styles.colorBox, {backgroundColor: item.color}]}
                  />
                  <Text style={styles.labelText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

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
    height: 450,
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
    height: '40%',
    width: '100%',
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
    marginTop: 10,
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
