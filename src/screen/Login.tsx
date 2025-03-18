import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Login = ({navigation}: any) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUserName, setUserRole, userRole, setToken} = useUser();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://demo.capobrain.com/userlogin',
        {
          user_name: email,
          password,
        },
        {withCredentials: true},
      );

      const data = response.data;
      console.log(data,"Login data");

      // Get CSRF token from response headers
      const xsrfToken = response.headers['set-cookie']
        ?.find(cookie => cookie.includes('XSRF-TOKEN'))
        ?.split('=')[1]
        ?.split(';')[0];

      if (xsrfToken) {
        axios.defaults.headers.common['X-XSRF-TOKEN'] = xsrfToken;
      } else {
        console.log('XSRF Token not found');
      }

      if (response.status === 200 && data.status === 200) {
        const userData = await axios.get(
          'https://demo.capobrain.com/fetchprofile',
          {
            headers: {
              Authorization: `Bearer ${xsrfToken}`,
            },
          },
        );
        setUserRole(userData.data.user.role);
        setUserName(userData.data.user.name);
      }

      if (response.status === 200 && data.status === 200) {
        setToken(xsrfToken || null);
        if (userRole === 'Student') {
          navigation.navigate('StudentStack');
        }
        if (userRole === 'Parent') {
          navigation.navigate('ParentStack');
        }
        if (userRole === 'Teacher') {
          navigation.navigate('TeacherStack');
        }
      } else if (data.status === 202) {
        Alert.alert('Login failed', 'Invalid username or password');
        console.log('Login failed:', data);
      } else {
        Alert.alert('Login failed', 'Unexpected response from the server');
        console.log('Unexpected response:', data);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
        Alert.alert('Sign in failed', 'Invalid credentials or server error.');
      } else if (error.request) {
        console.error('No Response:', error.request);
        Alert.alert(
          'Sign in failed',
          'No response from the server. Please try again.',
        );
      } else {
        console.error('Error:', error.message);
        Alert.alert('Sign in failed', 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logoTranslateY = useRef(new Animated.Value(-50)).current;
  const boxFadeIn = useRef(new Animated.Value(0)).current;
  const input1TranslateX = useRef(new Animated.Value(-50)).current;
  const input2TranslateX = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(boxFadeIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(input1TranslateX, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(input2TranslateX, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/hbg.png')}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <View style={styles.scrollContainer}>
            <Animated.View
              style={[
                styles.logoContainer,
                {transform: [{translateY: logoTranslateY}]},
              ]}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View
              style={[styles.box, {opacity: boxFadeIn, overflow: 'hidden'}]}>
              <Text style={styles.title}>Login</Text>

              <Animated.View
                style={[
                  styles.inputContainer,
                  {transform: [{translateX: input1TranslateX}]},
                ]}>
                <Icon name="mail" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="gray"
                  value={email.toUpperCase()}
                  onChangeText={text => setEmail(text.toLowerCase())}
                />
              </Animated.View>

              <Animated.View style={[styles.inputContainer, { transform: [{ translateX: input2TranslateX }] }]}>
                <Icon
                  name="lock-closed"
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="gray"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Icon
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="gray"
                    style={styles.icon}
                  />
                </TouchableOpacity>
                </Animated.View>

                <AnimatedTouchable onPress={handleLogin}
              style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
                {loading ? (
                  <ActivityIndicator size="small" color="#3B4A6B" />
                ) : (
                  <Text style={styles.buttonText}>LOGIN</Text>
                )}
            </AnimatedTouchable>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Developed with ❤️ By: Technic Mentors
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: wp('100%'),
    height: hp('50%'),
    position: 'absolute',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('20%'),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  logo: {
    width: 180,
    height: 180,
  },
  box: {
    backgroundColor: 'white',
    width: wp('90%'),
    padding: 20,
    borderRadius: 25,
    borderColor: 'gray',
    borderWidth: 2,
    elevation: 15,
    alignSelf: 'center',
    overflow:'hidden'
  },
  title: {
    textAlign: 'center',
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 34,
    marginBottom: hp('2%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: hp('2%'),
    width: "100%",  
    paddingHorizontal: 10,  
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'gray',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: hp('1%'),
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#3b82f6',
    fontSize: RFPercentage(2),
  },
});
