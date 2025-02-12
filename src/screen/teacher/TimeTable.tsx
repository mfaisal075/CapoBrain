import {
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

const TimeTable = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );

  const [items] = useState([
    {
      sr: 1,
      branch: 'Main Branch',
      class: 'Play Group',
      teacher: 'Isra',
      section: 'A',
      startTime: '08:00 AM',
      endTime: '09:00 PM',
    },
  ]);

  const filteredItems = items.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    setPage(0);
    return () => backHandler.remove();
  }, [itemsPerPage]);
  return (
    <View style={styles.container}>
      {/* Navbar */}
      <NavBar />

      <View style={styles.accountContainer}>
        <View style={styles.actHeadingContainer}>
          <Text style={styles.tblHdCtr}>Time Table</Text>
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
            <Text style={styles.bckBtnText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Table */}
        <View style={styles.tblDataCtr}>
          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                {[
                  'Sr#',
                  'Branch',
                  'Class',
                  'Teacher',
                  'Section',
                  'Start Time',
                  'End Time',
                ].map((title, index) => (
                  <DataTable.Title
                    key={index}
                    textStyle={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                    style={{
                      width: index === 0 ? 50 : 125, // Reduced width for the first header
                      paddingHorizontal: 5,
                      borderColor: '#000',
                      borderWidth: 0.5,
                      backgroundColor: '#F0F0F0',
                    }}>
                    {title}
                  </DataTable.Title>
                ))}
              </DataTable.Header>

              {filteredItems.length > 0 ? (
                filteredItems.slice(from, to).map((item, index) => (
                  <DataTable.Row key={index}>
                    {[
                      item.sr,
                      item.branch,
                      item.class,
                      item.teacher,
                      item.section,
                      item.startTime,
                      item.endTime,
                    ].map((value, idx) => (
                      <DataTable.Cell
                        key={idx}
                        textStyle={{color: '#000', fontSize: 12}}
                        style={{
                          width: idx === 0 ? 50 : 125, // Reduced width for the first cell
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                        }}>
                        {value}
                      </DataTable.Cell>
                    ))}
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
                numberOfPages={Math.ceil(filteredItems.length / itemsPerPage)}
                onPageChange={page => setPage(page)}
                label={`${from + 1}-${to} of ${filteredItems.length}`}
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
    </View>
  );
};

export default TimeTable;

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
  searchContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
  },
});
