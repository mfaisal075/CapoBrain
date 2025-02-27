import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {useUser} from '../Ctx/UserContext';

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

const ProfileScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const {token} = useUser();
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

  useEffect(() => {
    fetchProfileData();
    const backAction = () => {
      navigation.replace('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          backgroundColor: 'white',
        }}>
        <View style={styles.header}>
          <Image
            style={{
              width: 100,
              height: 100,
              marginTop: hp('5%'),
            }}
            source={require('../assets/avatar.png')}
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
              source={require('../assets/dad.png')}
            />

            <Text
              style={{
                marginTop: hp('1.7%'),
                fontSize: 16,
                marginLeft: hp('3%'),
              }}>
              {userData?.parent.par_fathername}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              style={{
                width: 25,
                height: 25,
                marginTop: hp('1.8%'),
                tintColor: '#3b82f6',
              }}
              source={require('../assets/class.png')}
            />

            <Text
              style={{
                marginTop: hp('1.9%'),
                fontSize: 16,
                marginLeft: hp('2%'),
              }}>
              {userData?.cand_class.cls_name} ({userData?.section.sec_name})
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
              source={require('../assets/envelope.png')}
            />

            <Text
              style={{
                marginTop: hp('1.7%'),
                fontSize: 16,
                marginLeft: hp('3%'),
              }}>
              {userData?.user.email ?? '--'}
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
              source={require('../assets/location.png')}
            />

            <Text
              style={{
                marginTop: hp('1.7%'),
                fontSize: 16,
                marginLeft: hp('3%'),
              }}>
              {userData?.cand.add ?? 'NILL'}
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
              source={require('../assets/smartphone.png')}
            />

            <Text
              style={{
                marginTop: hp('1.7%'),
                fontSize: 16,
                marginLeft: hp('3%'),
              }}>
              {userData?.user.contact ?? '--'}
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
              source={require('../assets/id-card.png')}
            />

            <Text
              style={{
                marginTop: hp('1.7%'),
                fontSize: 16,
                marginLeft: hp('3%'),
              }}>
              {userData?.cand.cand_bform}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.btn}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Image
                style={{
                  width: 22,
                  height: 22,
                  alignSelf: 'center',
                  tintColor: '#3b82f6',
                }}
                source={require('../assets/reset-password.png')}
              />
              <Text style={styles.btnText}>Change Password</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
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
                  marginRight: hp('2%'),
                }}
                source={require('../assets/logout.png')}
              />
              <Text style={styles.btnText}>Log Out</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Change password modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 500,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Text style={{color: '#6C757D', fontSize: 18}}>
              Change Password
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
              borderWidth: 1,
              borderColor: '#6C757D',
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
                      color: 'black',
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
                      borderColor: 'gray',
                      borderRadius: 5,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      paddingTop: 20,
                      padding: 10,
                    }}
                    placeholderTextColor="black"
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
                      color: 'black',
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
                      borderColor: 'gray',
                      borderRadius: 5,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      paddingTop: 20,
                      padding: 10,
                    }}
                    placeholderTextColor="black"
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
                      color: 'black',
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
                      borderColor: 'gray',
                      borderRadius: 5,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      paddingTop: 20,
                      padding: 10,
                    }}
                    placeholderTextColor="black"
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
                      backgroundColor: '#218838',
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
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    width: wp('100%'),
    height: hp('30%'),
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: hp('1%'),
    fontSize: 18,
  },
  details: {
    marginLeft: hp('2%'),
    marginTop: hp('3%'),
  },
  btn: {
    borderColor: 'gray',
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
    borderColor: 'gray',
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
});
