import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../../screen/Home';
import Account from '../../screen/Account';
import Attendance from '../../screen/Attendance';
import HomeWork from '../../screen/HomeWork';
import Download from '../../screen/Download';
import ApplyLeave from '../../screen/ApplyLeave';
import Result from '../../screen/Result';
import Course from '../../screen/Course';
import LMS from '../../screen/LMS';
import SummerHomework from '../../screen/LMS/SummerHomework';
import SummerHomeWorkResult from '../../screen/LMS/SummerHomeworkResult';
import LibraryBooks from '../../screen/LMS/LibraryBooks';
import StudentDiary from '../../screen/LMS/StudentDiary';
import DateSheet from '../../screen/LMS/DateSheet';
import Std_Notification from '../../screen/Std_Notification';
import StdCalendar from '../../screen/StdCalendar';
import StdComplain from '../../screen/StdComplain';
import StdSports from '../../screen/StdSports';
import StdUpdate from '../../screen/StdUpdate';

const Stack = createNativeStackNavigator();

const StudentStack = () => {
  return (
    <Stack.Navigator>
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
      <Stack.Screen name="LMS" component={LMS} options={{headerShown: false}} />
      <Stack.Screen
        name="Course"
        component={Course}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SummerHomework"
        component={SummerHomework}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SummerHomeworkResult"
        component={SummerHomeWorkResult}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LibraryBooks"
        component={LibraryBooks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StudentDiary"
        component={StudentDiary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DateSheet"
        component={DateSheet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Std_Notification"
        component={Std_Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StdCalendar"
        component={StdCalendar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StdComplain"
        component={StdComplain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StdSports"
        component={StdSports}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StdUpdate"
        component={StdUpdate}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StudentStack;

const styles = StyleSheet.create({});
