import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {HTMLContentModel, HTMLElementModel} from 'react-native-render-html';
import {useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Divider, Menu} from 'react-native-paper';

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
  const {token, userRole, userName, logout} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: 'white'}}>
      <View style={styles.header}>
        {/* profile user icon*/}

        <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity style={styles.optContainer} onPress={openMenu}>
                <Image
                  source={require('../assets/user.png')}
                  style={styles.optIcon}
                />
              </TouchableOpacity>
            }>
            {/* User Info */}
            <View style={styles.userInfo}>
              <Image
                source={require('../assets/user.png')}
                style={styles.userIcon}
              />
              <View>
                <Text style={styles.userName}>{userName}</Text>
                {userRole === 'Student' ? (
                  <Text style={styles.userRole}>Student</Text>
                ) : userRole === 'Teacher' ? (
                  <Text style={styles.userRole}>Teacher</Text>
                ) : (
                  <Text style={styles.userRole}>Parent</Text>
                )}
              </View>
            </View>

            <Divider />
            <Menu.Item
              onPress={() => console.log('Change Password')}
              title="Change Password"
            />
            <Menu.Item onPress={() => logout()} title="Logout" />
          </Menu>
        </View>

        <View style={styles.std}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: 70,
                height: 70,
                marginTop: hp('4%'),
                marginLeft: hp('2%'),
              }}
              source={require('../assets/avatar.png')}
            />

            <View style={{marginLeft: hp('2%'), marginTop: hp('4%')}}>
              <Text style={styles.headerText}>{userData?.cand.cand_name}</Text>
              <Text style={styles.Text}>{userData?.user.role}</Text>
              <Text style={styles.Text}>{userData?.cand.student_id}</Text>
            </View>
          </View>
        </View>
      </View>

      {/*status*/}
      <View style={styles.circles}>
        <View>
          <ImageBackground
            source={require('../assets/attcir.png')}
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
            source={require('../assets/balance.png')}
            style={styles.centerCir}
            imageStyle={{borderRadius: 50}}>
            <Text style={styles.circleText}>
              {userData?.student_account.stuacc_balance}
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
            source={require('../assets/resultcircle.png')}
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
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 50,
                  height: 30,
                }}
                source={require('../assets/1.png')}
              />
              <Text>Accounts</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Attendance')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 38,
                  height: 30,
                }}
                source={require('../assets/2.png')}
              />
              <Text>Attendance</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('HomeWork')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 40,
                  height: 30,
                }}
                source={require('../assets/3.png')}
              />
              <Text>Home Work</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Download')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                }}
                source={require('../assets/4.png')}
              />
              <Text style={{textAlign: 'center'}}>Download</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2nd Row */}
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ApplyLeave')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 32,
                  height: 33,
                }}
                source={require('../assets/5.png')}
              />
              <Text>Apply Leave</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Result')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 25,
                  height: 30,
                }}
                source={require('../assets/6.png')}
              />
              <Text style={{textAlign: 'center'}}>Result</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LMS')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                }}
                source={require('../assets/7.png')}
              />
              <Text style={{textAlign: 'center'}}>LMS</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Course')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 23,
                  height: 32,
                }}
                source={require('../assets/8.png')}
              />
              <Text style={{textAlign: 'center'}}>Course</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3rd Row */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Std_Notification')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 26,
                  height: 30,
                }}
                source={require('../assets/9.png')}
              />
              <Text
                style={{
                  fontSize: 13,
                }}>
                Notification
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('StdCalendar')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 27,
                  height: 30,
                }}
                source={require('../assets/10.png')}
              />
              <Text style={{textAlign: 'center'}}>Calendar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('StdComplain')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 42,
                  height: 33,
                }}
                source={require('../assets/11.png')}
              />
              <Text style={{textAlign: 'center'}}>Complain</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('StdSports')}>
            <View style={styles.iconContainer}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                }}
                source={require('../assets/12.png')}
              />
              <Text style={{textAlign: 'center'}}>Sports</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/*news*/}
      <TouchableOpacity onPress={() => navigation.navigate('StdUpdate')}>
        <View style={styles.update}>
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: hp('2%'),
              alignSelf: 'center',
              tintColor: 'white',
            }}
            source={require('../assets/update.png')}
          />
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              marginLeft: hp('1%'),
              alignSelf: 'center',
              fontSize: 20,
            }}>
            School Updates
          </Text>
          <Image
            style={{
              width: 50,
              height: 50,
              alignSelf: 'center',
              tintColor: 'white',
              marginRight: hp('2%'),
            }}
            source={require('../assets/arrowc.png')}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Attendance')}>
        <View style={styles.attendance}>
          <Image
            style={{
              width: 30,
              height: 30,
              marginLeft: hp('2%'),
              alignSelf: 'center',
              tintColor: 'white',
            }}
            source={require('../assets/attendance.png')}
          />
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              marginLeft: hp('1%'),
              alignSelf: 'center',
              fontSize: 20,
            }}>
            Attendance
          </Text>
          <Image
            style={{
              width: 50,
              height: 50,
              alignSelf: 'center',
              tintColor: 'white',
              marginRight: hp('2%'),
            }}
            source={require('../assets/arrowc.png')}
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

export default Home;

const styles = StyleSheet.create({
  // Main Content style
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
  optContainer: {
    height: 40,
    width: '100%',
    backgroundColor: 'rgba(59, 130, 246,0.5)',
    borderRadius: 50,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
    marginTop: 5,
  },
  optIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    tintColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    tintColor: '#3B82F6',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#777',
  },
});
