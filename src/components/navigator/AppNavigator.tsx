import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useUser} from '../../Ctx/UserContext';
import StudentStack from './StudentStack';
import TeacherStack from './TeacherStack';
import ParentStack from './ParentStack';
import AuthStack from './AuthStack';
import SplashScreen from '../../screen/SplashScreen';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const {userRole, token} = useUser();
  const [isLoading, setIsLoading] = useState(true); // State to control SplashScreen

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    // Show SplashScreen only during initial load
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator>
      {!userRole || !token ? (
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
      ) : userRole === 'Teacher' ? (
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
  );
};

export default AppNavigator;
