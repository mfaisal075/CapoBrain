import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../screen/Home';
import Account from '../screen/Account';
import Attendance from '../screen/Attendance';
import HomeWork from '../screen/HomeWork';
import Download from '../screen/Download';
import ApplyLeave from '../screen/ApplyLeave';
import Result from '../screen/Result';
import LMS from '../screen/LMS';
import Course from '../screen/Course';
import Login from '../screen/Login';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Attendance"
          component={Attendance}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeWork"
          component={HomeWork}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Download"
          component={Download}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ApplyLeave"
          component={ApplyLeave}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LMS"
          component={LMS}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Course"
          component={Course}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
