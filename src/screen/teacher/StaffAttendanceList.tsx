import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import NavBar from '../../components/NavBar';
import {DataTable} from 'react-native-paper';

const StaffAttendanceList = ({navigation}: any) => {
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );

  const [items] = useState([
    {
      date: '13-Nov-2024',
      clockin: '10:40:00',
      clockout: '--:--:--',
      status: '',
      actionType: '',
    },
    {
      date: '15-Nov-2024',
      clockin: '10:42:00',
      clockout: '3:42:00',
      status: 'Present',
      actionType: 'green',
    },
    {
      date: '16-Nov-2024',
      clockin: '10:50:00',
      clockout: '11:00:00',
      status: 'Present',
      actionType: 'green',
    },
    {
      date: '15-Nov-2024',
      clockin: '--:--:--',
      clockout: '--:--:--',
      status: 'Absent',
      actionType: 'red',
    },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);
  return (
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Attendance List</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.goBack()}>
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
            <TouchableOpacity style={styles.stdAttBtn}>
              <Text style={styles.stdAttBtnText}>Student Attendance</Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
          <View style={styles.tblDataCtr}>
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  {['Date', 'Clock in', 'Clock out', 'Status'].map(
                    (title, index) => (
                      <DataTable.Title
                        key={index}
                        textStyle={{
                          color: 'black',
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                        style={{
                          width: 100, // Reduced width for the first header
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                          backgroundColor: '#F0F0F0',
                        }}>
                        {title}
                      </DataTable.Title>
                    ),
                  )}
                </DataTable.Header>

                {items.length > 0 ? (
                  items.map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.date,
                        item.clockin,
                        item.clockout,
                        item.status,
                      ].map((value, idx) => (
                        <DataTable.Cell
                          key={idx}
                          textStyle={{color: '#000', fontSize: 12}}
                          style={{
                            width: 100, // Reduced width for the first cell
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                          }}>
                          {value}
                        </DataTable.Cell>
                      ))}
                      <DataTable.Cell
                        key={'action'}
                        textStyle={{color: '#000', fontSize: 12}}
                        style={{
                          width: 100,
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                        }}>
                        <TouchableOpacity
                          disabled={item.actionType !== 'green'}
                          onPress={() => {
                            if (item.actionType === 'green') {
                              // Handle the action here
                              {
                              }
                            }
                          }}>
                          <View
                            style={{
                              backgroundColor: item.actionType,
                              padding: 5,
                              borderRadius: 5,
                              alignItems: 'center',
                            }}>
                            <Text style={{color: '#fff', fontSize: 12}}>
                              {item.status}
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

export default StaffAttendanceList;

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
  stdAttBtn: {
    backgroundColor: '#3B82F6',
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
