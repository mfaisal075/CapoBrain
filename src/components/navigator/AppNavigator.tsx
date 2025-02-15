import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../../screen/Login';
import {useUser} from '../../Ctx/UserContext';
import StudentStack from './StudentStack';
import TeacherStack from './TeacherStack';
import ParentStack from './ParentStack';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const {userRole} = useUser();
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!userRole ? (
          <RootStack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        ) : userRole === 'student' ? (
          <RootStack.Screen
            name="StudentStack"
            component={StudentStack}
            options={{headerShown: false}}
          />
        ) : userRole === 'teacher' ? (
          <RootStack.Screen
            name="TeacherStack"
            component={TeacherStack}
            options={{headerShown: false}}
          />
        ) : (
          <RootStack.Screen
            name="ParentStack"
            component={ParentStack}
            options={{headerShown: false}}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
