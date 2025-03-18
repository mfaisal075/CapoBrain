import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ParentHome from '../../screen/parent/ParentHome';
import ParentAccount from '../../screen/parent/ParentAccount';
import ParentLMS from '../../screen/parent/ParentLMS';
import ParentCourses from '../../screen/parent/LMS/ParentCourses';
import ParentSummerHw from '../../screen/parent/LMS/ParentSummerHw';
import ParentSummerHwResult from '../../screen/parent/LMS/ParentSummerHwResult';
import ParentLibraryBooks from '../../screen/parent/LMS/ParentLibraryBooks';
import ParentDateSheet from '../../screen/parent/LMS/ParentDateSheet';
import ParentDailyDiary from '../../screen/parent/LMS/ParentDailyDiary';
import ParentAttendance from '../../screen/parent/ParentAttendance';
import ParentResult from '../../screen/parent/ParentResult';
import ParentHomeWork from '../../screen/parent/ParentHomeWork';
import ParentApplyLeave from '../../screen/parent/ParentApplyLeave';
import ParentDownload from '../../screen/parent/ParentDownload';
import ParentChat from '../../screen/parent/ParentChat';
import ParentProfile from '../../screen/parent/ParentProfile';
import ParentAnnouncement from '../../screen/parent/ParentAnnouncement';
import ParentComplain from '../../screen/parent/ParentComplain';
import ParentCalendar from '../../screen/parent/ParentCalendar';
import ParentMessages from '../../screen/parent/ParentMessages';
import ParentMeeting from '../../screen/parent/ParentMeeting';

const Stack = createNativeStackNavigator();

const ParentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ParentHome"
        component={ParentHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentProfile"
        component={ParentProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentAccount"
        component={ParentAccount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentLMS"
        component={ParentLMS}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentCourses"
        component={ParentCourses}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentSummerHw"
        component={ParentSummerHw}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentSummerHwResult"
        component={ParentSummerHwResult}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentLibraryBooks"
        component={ParentLibraryBooks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentDateSheet"
        component={ParentDateSheet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentDailyDiary"
        component={ParentDailyDiary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentAttendance"
        component={ParentAttendance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentResult"
        component={ParentResult}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentHomeWork"
        component={ParentHomeWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentApplyLeave"
        component={ParentApplyLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentDownload"
        component={ParentDownload}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentChat"
        component={ParentChat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentAnnouncement"
        component={ParentAnnouncement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentComplain"
        component={ParentComplain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentCalendar"
        component={ParentCalendar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentMessages"
        component={ParentMessages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ParentMeeting"
        component={ParentMeeting}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default ParentStack;
