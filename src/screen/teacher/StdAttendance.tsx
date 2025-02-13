import {
  Alert,
  BackHandler,
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

const StdAttendance = ({navigation}: any) => {
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );

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
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  {[
                    'Sr#',
                    'Student',
                    'Class',
                    'Section',
                    'Status',
                    'Date',
                    'Actions',
                  ].map((title, index) => (
                    <DataTable.Title
                      key={index}
                      textStyle={{
                        color: 'black',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: index === 0 ? 50 : index === 6 ? 150 : 125, // Adjusted width for Actions column
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        backgroundColor: '#F0F0F0',
                      }}>
                      {title}
                    </DataTable.Title>
                  ))}
                </DataTable.Header>

                {items.length > 0 ? (
                  items.slice(from, to).map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.sr,
                        item.student,
                        item.class,
                        item.section,
                        item.status,
                        item.date,
                      ].map((value, idx) => (
                        <DataTable.Cell
                          key={idx}
                          textStyle={{color: '#000', fontSize: 12}}
                          style={{
                            width: idx === 0 ? 50 : idx === 6 ? 150 : 125, // Adjusted width for Actions column
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                          }}>
                          {value}
                        </DataTable.Cell>
                      ))}
                      <DataTable.Cell
                        key={'action'}
                        style={{
                          width: 150,
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {/* Edit Button */}
                        <TouchableOpacity onPress={() => onEdit(item)}>
                          <View
                            style={{
                              backgroundColor: '#24953D',
                              paddingVertical: 8,
                              paddingHorizontal: 10,
                              borderRadius: 5,
                              marginRight: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={require('../../assets/pencil.png')}
                              style={{
                                height: 12,
                                width: 12,
                                marginRight: 5,
                                tintColor: 'white',
                              }}
                            />
                            <Text style={{color: '#fff', fontSize: 12}}>
                              Edit
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity onPress={() => onDelete(item)}>
                          <View
                            style={{
                              backgroundColor: 'red',
                              paddingVertical: 8,
                              paddingHorizontal: 4,
                              borderRadius: 5,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={require('../../assets/bin.png')}
                              style={{
                                height: 12,
                                width: 12,
                                marginRight: 5,
                                tintColor: 'white',
                              }}
                            />
                            <Text style={{color: '#fff', fontSize: 12}}>
                              Delete
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))
                ) : (
                  <DataTable.Row>
                    <DataTable.Cell
                      textStyle={{
                        color: 'gray',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: '100%',
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        justifyContent: 'center',
                      }}>
                      No data found
                    </DataTable.Cell>
                  </DataTable.Row>
                )}

                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(items.length / itemsPerPage)}
                  onPageChange={page => setPage(page)}
                  label={`${from + 1}-${to} of ${items.length}`}
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                  showFastPaginationControls
                  selectPageDropdownLabel={'Show Entries'}
                  theme={{
                    colors: {
                      primary: '#000',
                      elevation: {
                        level2: '#fff',
                      },
                      text: '#616161',
                      onSurface: '#616161',
                    },
                    dark: false,
                    roundness: 1,
                  }}
                />
              </DataTable>
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
});
