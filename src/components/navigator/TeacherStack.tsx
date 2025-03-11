import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TeacherHome from '../../screen/teacher/TeacherHome';
import TimeTable from '../../screen/teacher/TimeTable';
import LessonPlan from '../../screen/teacher/LessonPlan';
import TeacherAccount from '../../screen/teacher/TeacherAccount';
import TeacherAttendance from '../../screen/teacher/TeacherAttendance';
import StaffAttendanceList from '../../screen/teacher/StaffAttendanceList';
import StdAttendance from '../../screen/teacher/StdAttendance';
import LibraryBook from '../../screen/teacher/LibraryBook';
import TeacherHomework from '../../screen/teacher/TeacherHomework';
import TSummerHomework from '../../screen/teacher/TSummerHomework';
import TeacherApplyLeave from '../../screen/teacher/TeacherApplyLeave';
import TeacherTodos from '../../screen/teacher/TeacherTodos';
import TeacherDownload from '../../screen/teacher/TeacherDownload';
import TeacherUpload from '../../screen/teacher/TeacherUpload';
import TeacherDateSheet from '../../screen/teacher/TeacherDateSheet';
import TeacherProfile from '../../screen/teacher/TeacherProfile';
import TeacherAnnouncement from '../../screen/teacher/TeacherAnnouncement';
import TeacherFeedback from '../../screen/teacher/TeacherFeedback';
import TeacherComplain from '../../screen/teacher/TeacherComplain';
import TeacherCalendar from '../../screen/teacher/TeacherCalendar';
import TeacherMessages from '../../screen/teacher/TeacherMessages';

const Stack = createNativeStackNavigator();

const TeacherStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TeacherHome"
        component={TeacherHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherProfile"
        component={TeacherProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TimeTable"
        component={TimeTable}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LessonPlan"
        component={LessonPlan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherAccount"
        component={TeacherAccount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherAttendance"
        component={TeacherAttendance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StaffAttendanceList"
        component={StaffAttendanceList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StdAttendance"
        component={StdAttendance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LibraryBook"
        component={LibraryBook}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherHomework"
        component={TeacherHomework}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TSummerHomework"
        component={TSummerHomework}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherApplyLeave"
        component={TeacherApplyLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherTodos"
        component={TeacherTodos}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherDownload"
        component={TeacherDownload}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherUpload"
        component={TeacherUpload}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherDateSheet"
        component={TeacherDateSheet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherAnnouncement"
        component={TeacherAnnouncement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherFeedback"
        component={TeacherFeedback}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherComplain"
        component={TeacherComplain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherCalendar"
        component={TeacherCalendar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeacherMessages"
        component={TeacherMessages}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default TeacherStack;
