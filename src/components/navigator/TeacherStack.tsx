import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TeacherHome from '../../screen/teacher/TeacherHome';
import TimeTable from '../../screen/teacher/TimeTable';
import LessonPlan from '../../screen/teacher/LessonPlan';
import TeacherAccount from '../../screen/teacher/TeacherAccount';
import TeacherAttendance from '../../screen/teacher/TeacherAttendance';
import StaffAttendanceList from '../../screen/teacher/StaffAttendanceList';
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
    </Stack.Navigator>
  );
};

export default TeacherStack;
