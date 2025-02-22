import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {useUser} from '../../Ctx/UserContext';
import StudentStack from './StudentStack';
import TeacherStack from './TeacherStack';
import ParentStack from './ParentStack';
import AuthStack from './AuthStack';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const {userRole} = useUser();
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!userRole ? (
          <RootStack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{headerShown: false}}
          />
        ) : userRole === 'Student' ? (
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
