import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {DataTable} from 'react-native-paper';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
} from 'react-native-render-html';
import {RefreshControl} from 'react-native';

const StdAttendance = ({navigation}: any) => {
  const {token} = useUser();
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetch-attendance',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data.output;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true,
  });

  const customHTMLElementModels = {
    center: HTMLElementModel.fromCustomModel({
      tagName: 'center',
      mixedUAStyles: {
        alignItems: 'center',
        textAlign: 'center',
      },
      contentModel: HTMLContentModel.block,
    }),
  };

  const [items] = useState([
    {
      sr: 1,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 2,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 3,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '15-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 4,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '15-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 5,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '15-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 6,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '16-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 7,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '16-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 8,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Leave',
      date: '19-11-2024',
      action: 'Edit | Delete',
      actionType: 'red',
    },
    {
      sr: 9,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '19-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 10,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Leave',
      date: '19-11-2024',
      action: 'Edit | Delete',
      actionType: 'red',
    },
    {
      sr: 11,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '22-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 12,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '22-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 13,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '23-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 14,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '23-11-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 15,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Absent',
      date: '07-12-2024',
      action: 'Edit | Delete',
      actionType: 'red',
    },
    {
      sr: 16,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Absent',
      date: '07-12-2024',
      action: 'Edit | Delete',
      actionType: 'red',
    },
    {
      sr: 17,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Absent',
      date: '30-12-2024',
      action: 'Edit | Delete',
      actionType: 'red',
    },
    {
      sr: 18,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '30-12-2024',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 19,
      student: 'Hania',
      class: 'Play Group',
      section: 'A',
      status: 'Present',
      date: '30-01-2025',
      action: 'Edit | Delete',
      actionType: 'green',
    },
    {
      sr: 20,
      student: 'Abdul Hadi',
      class: 'Play Group',
      section: 'A',
      status: 'Leave',
      date: '31-01-2025',
      action: 'Edit | Delete',
      actionType: 'red',
    },
  ]);

  const onEdit = (item: any) => {
    // Implement your edit logic here
    console.log('Edit item:', item);
  };

  const onDelete = (item: any) => {
    // Implement your delete logic here
    console.log('Delete item:', item);
  };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    fetchData();
    const backAction = () => {
      navigation.navigate('TeacherAttendance');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Student Attendance</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.navigate('TeacherAttendance')}>
              <Image
                source={require('../../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../../assets/back.png')}
                style={styles.bckBtnIcon}
              />
              <Text style={styles.bckBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stdAttBtn} onPress={() => {}}>
              <Text style={styles.stdAttBtnText}>Mark Student Attendance</Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
          <View style={styles.tblDataCtr}>
            <ScrollView
              horizontal
              style={{flex: 1, padding: 10}}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={refetch} />
              }>
              {data ? (
                <RenderHtml
                  contentWidth={Dimensions.get('window').width}
                  source={{html: data}}
                  customHTMLElementModels={customHTMLElementModels}
                  tagsStyles={{
                    h4: {
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#000',
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: '100%',
                      marginLeft: -10,
                    },
                    th: {
                      backgroundColor: '#f2f2f2',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      marginHorizontal: -5,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: 125, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -10,
                      marginTop: -10,
                    },
                    td: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      textAlign: 'center',
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -2,
                      borderBottomColor: 'white',
                    },
                    tr: {
                      backgroundColor: '#fff',
                      marginLeft: -3
                    },
                    a: {
                      width: 100,
                      backgroundColor: '#3B82F6',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 5,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 10,
                    },
                  }}
                />
              ) : (
                <View style={styles.attendanceCtr}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: 'rgba(0,0,0,0.6)',
                      textAlign: 'center',
                    }}>
                    No record present in the database!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StdAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  accountContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: '5%',
  },
  actHeadingContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  tblHdCtr: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
  bckBtnCtr: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bckBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bckBtnIcon: {
    height: 16,
    width: 16,
    tintColor: '#fff',
    marginRight: 5,
  },
  actionBtn: {
    height: 10,
  },
  stdAttBtn: {
    backgroundColor: '#24953D',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  stdAttBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attendanceCtr: {
    height: 300,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
