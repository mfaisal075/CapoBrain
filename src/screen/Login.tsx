import React, {useState} from 'react';
import {Alert, ActivityIndicator} from 'react-native';
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

const Login = ({navigation}: any) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUserName: setUserEmail, setUserRole, userRole} = useUser();
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
      );

      setUserEmail(email);

      const data = response.data;

      if (response.status === 200 && data.status === 200) {
        // Successful login
        setUserRole('teacher');
        if (userRole === 'student') {
          navigation.navigate('StudentStack');
        }
        if (userRole === 'teacher') {
          navigation.navigate('TeacherStack');
        }
        console.log('Login successful:', data);
      } else if (data.status === 202) {
        // Invalid username or password
        Alert.alert('Login failed', 'Invalid username or password');
        console.log('Login failed:', data);
      } else {
        // Handle any other unexpected statuses
        Alert.alert('Login failed', 'Unexpected response from the server');
        console.log('Unexpected response:', data);
      }
    } catch (error: any) {
      // Handle errors
      if (error.response) {
        // Server responded with a status outside the 2xx range
        console.error('Server Error:', error.response.data);
        Alert.alert('Sign in failed', 'Invalid credentials or server error.');
      } else if (error.request) {
        // Request was made but no response was received
        console.error('No Response:', error.request);
        Alert.alert(
          'Sign in failed',
          'No response from the server. Please try again.',
        );
      } else {
        // Something else caused the error
        console.error('Error:', error.message);
        Alert.alert('Sign in failed', 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Placeholder for Logo */}
      <View style={styles.logoPlaceholder}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: 180, height: 180}}
          resizeMode="contain"
        />
      </View>

      {/* Login Text */}
      <Text style={styles.loginText}>LOGIN</Text>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Icon
          name="mail"
          size={20}
          color="rgba(255,255,255,0.6)"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="USER NAME"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={email.toUpperCase()}
          onChangeText={text => setEmail(text.toLowerCase())}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Icon
          name="lock-closed"
          size={20}
          color="rgba(255,255,255,0.6)"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={passwordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="rgba(255,255,255,0.6)"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator size="small" color="#3B4A6B" />
        ) : (
          <Text style={styles.buttonText}>LOGIN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B4A6B', // Matches the dark blue background
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B4A6B',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomColor: '#fff',
    marginBottom: 20,
    width: '85%',
    paddingHorizontal: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 60,
    width: '85%',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B4A6B',
    textAlign: 'center',
  },
});
