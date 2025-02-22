import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
import {Alert} from 'react-native';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {useFocusEffect} from '@react-navigation/native';

interface UserData {
  cand: {
    cand_bform: string;
    cand_name: string;
    student_id: string;
    add: string;
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
    contact: string;
    name: string;
  };
  student_account: {
    stuacc_balance: string;
    stuacc_paid_amount: string;
    inventory_amount: string;
    stuacc_payable: string;
  };
}

const Home = ({navigation}: any) => {
  const {token, setUserName, setUserRole} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchProfileData = async () => {
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
        setUserName(response.data.user.name);
        setUserRole(response.data.user.role);
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
    queryFn: fetchProfileData,
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
                {userData?.user.email ?? '--'}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Icon
                name="map-marker"
                size={22}
                color="#3B82F6"
                style={{marginRight: 10}}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.cand.add ?? 'NILL'}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../assets/smartphone.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.user.contact ?? '--'}
              </Text>
            </View>
            <View style={styles.otherDetailsContainer}>
              <Image
                source={require('../assets/id-card.png')}
                style={styles.otherDetailsIcon}
              />
              <Text style={styles.otherDetailsText}>
                {userData?.cand.cand_bform ?? '--'}
              </Text>
            </View>
          </View>
          <View style={styles.accountStatus}>
            <View style={styles.statusHeadingContainer}>
              <Text style={styles.statusHeading}>Account Status</Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Receivable: {userData?.student_account?.stuacc_payable ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Paid: {userData?.student_account.stuacc_paid_amount ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Inventory: {userData?.student_account.inventory_amount ?? '0'}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              <Text style={styles.statusDetailsText}>
                Balance: {userData?.student_account.stuacc_balance ?? '0'}
              </Text>
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
});
