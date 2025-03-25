import {
  Alert,
  Animated,
  BackHandler,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';

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

const ParentProfile = ({navigation}: any) => {
  const {token, logout} = useUser();
  const [loading, setLoading] = useState(false);
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

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(8, 'Minimum 8 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      Alert.alert('Success', 'Password changed successfully!');
      setLoading(false);
    }, 2000);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    fetchData();
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
    <ScrollView
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {transform: [{translateY: moveAnim}]},
        ]}>
        <ImageBackground
          resizeMode="cover"
          style={styles.backgroundImage}
          source={require('../../assets/bgimg.jpg')}
        />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10, paddingTop: 15}}
          />
        </TouchableOpacity>
        <Image
          style={{
            width: 100,
            height: 100,
            marginTop: hp('2%'),
            alignSelf: 'center',
          }}
          source={require('../../assets/avatar.png')}
        />
        <Text style={styles.nameText}>{userData?.user.name}</Text>
      </View>

      <View style={styles.details}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              marginTop: hp('1.3%'),
              tintColor: '#3b82f6',
            }}
            source={require('../../assets/dad.png')}
          />

          <Text
            style={{
              marginTop: hp('1.7%'),
              fontSize: 16,
              marginLeft: hp('3%'),
              color: '#3b82f6',
            }}>
            {userData?.user.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              marginTop: hp('1.9%'),
              tintColor: '#3b82f6',
            }}
            source={require('../../assets/email.png')}
          />

          <Text
            style={{
              marginTop: hp('1.7%'),
              fontSize: 16,
              marginLeft: hp('3%'),
              color: '#3b82f6',
            }}>
            {userData?.user.email ?? 'NILL'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              marginTop: hp('1.9%'),
              tintColor: '#3b82f6',
            }}
            source={require('../../assets/smartphone.png')}
          />

          <Text
            style={{
              marginTop: hp('1.7%'),
              fontSize: 16,
              marginLeft: hp('3%'),
              color: '#3b82f6',
            }}>
            {userData?.user.contact ?? 'NILL'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              marginTop: hp('1.9%'),
              tintColor: '#3b82f6',
            }}
            source={require('../../assets/id-card.png')}
          />

          <Text
            style={{
              marginTop: hp('1.7%'),
              fontSize: 16,
              marginLeft: hp('3%'),
              color: '#3b82f6',
            }}>
            {userData?.user.cnic}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.btn}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              style={{
                width: 25,
                height: 25,
                alignSelf: 'center',
                tintColor: '#3b82f6',
              }}
              source={require('../../assets/reset-password.png')}
            />
            <Text style={styles.btnText}>Change Password</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => logout()}>
        <View style={styles.btnlog}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: 15,
                height: 15,
                tintColor: '#3b82f6',
                alignSelf: 'center',
                marginRight: hp('1%'),
              }}
              source={require('../../assets/logout.png')}
            />
            <Text style={styles.btnText}>Log Out</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 400,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#3b82f6',
            overflow: 'hidden',
          }}>
          <Animated.View
            style={[
              styles.animatedBackground,
              {transform: [{translateY: moveAnim}]},
            ]}>
            <ImageBackground
              resizeMode="cover"
              style={styles.backgroundImage}
              source={require('../../assets/bgimg.jpg')}
            />
          </Animated.View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Text style={{color: '#3b82f6', fontSize: 18}}>
              Change Password
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
              borderWidth: 1,
              borderColor: '#3b82f6',
            }}
          />

          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View style={{marginTop: 30, marginLeft: 20, marginRight: 20}}>
                  <Text
                    style={{
                      position: 'absolute',
                      top: -11,
                      left: 28,
                      fontSize: 14,
                      color: '#3b82f6',
                      backgroundColor: 'white',
                      paddingHorizontal: 4,
                      zIndex: 10,
                    }}>
                    Old Password:
                  </Text>
                  <TextInput
                    secureTextEntry
                    value={values.oldPassword}
                    onChangeText={handleChange('oldPassword')}
                    onBlur={handleBlur('oldPassword')}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#3b82f6',
                      borderRadius: 5,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      paddingTop: 20,
                      padding: 10,
                      height: 30,
                    }}
                    placeholderTextColor="#3b82f6"
                  />
                  {touched.oldPassword && errors.oldPassword && (
                    <Text style={{color: 'red', marginTop: 5, fontSize: 12}}>
                      {errors.oldPassword}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 30, marginLeft: 20, marginRight: 20}}>
                  <Text
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: 28,
                      fontSize: 14,
                      color: '#3b82f6',
                      backgroundColor: 'white',
                      paddingHorizontal: 4,
                      zIndex: 10,
                    }}>
                    New Password:
                  </Text>

                  <TextInput
                    secureTextEntry
                    value={values.newPassword}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#3b82f6',
                      borderRadius: 5,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      paddingTop: 20,
                      padding: 10,
                      height: 30,
                    }}
                    placeholderTextColor="#3b82f6"
                  />
                  {errors.newPassword && touched.newPassword && (
                    <Text style={{fontSize: 12, color: 'red', marginTop: 5}}>
                      {errors.newPassword}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 30, marginLeft: 20, marginRight: 20}}>
                  <Text
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: 28,
                      fontSize: 14,
                      color: '#3b82f6',
                      backgroundColor: 'white',
                      paddingHorizontal: 4,
                      zIndex: 10,
                    }}>
                    Confirm Password:
                  </Text>

                  <TextInput
                    secureTextEntry
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#3b82f6',
                      borderRadius: 5,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      paddingTop: 20,
                      padding: 10,
                      height: 30,
                    }}
                    placeholderTextColor="#3b82f6"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={{fontSize: 12, color: 'red', marginTop: 5}}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={loading}>
                  <View
                    style={{
                      borderRadius: 5,
                      height: 30,
                      backgroundColor: '#3b82f6',
                      alignSelf: 'center',
                      marginTop: 20,
                      width: 160,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        marginTop: 5,
                      }}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ParentProfile;

const styles = StyleSheet.create({
  header: {
    width: wp('100%'),
    height: hp('30%'),
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: hp('1%'),
    fontSize: 18,
    alignSelf: 'center',
  },
  details: {
    marginLeft: hp('2%'),
    marginTop: hp('3%'),
  },
  btn: {
    borderColor: '#3b82f6',
    width: 160,
    height: 35,
    borderWidth: 1,
    marginTop: hp('5%'),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 5,
    marginLeft: hp('2%'),
  },
  btnText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  btnlog: {
    borderColor: '#3b82f6',
    width: 160,
    height: 35,
    borderWidth: 1,
    marginTop: hp('2%'),
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 5,
    marginLeft: hp('2%'),
  },
  animatedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});
