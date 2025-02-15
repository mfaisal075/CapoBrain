import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ParentResult = ({navigation}: any) => {
  const [items] = useState([
    {
      sr: 1,
      branch: 'Main Branch',
      registration: 'FR#015',
      student: 'Hibba',
      father: 'Abdullah',
      bForm: '88775-7757784-4',
      class: 'Five',
    },
  ]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
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
            <Text style={styles.tblHdCtr}>Results</Text>
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

          {/* Table */}
          <View style={styles.tblDataCtr}>
            <ScrollView horizontal>
              <DataTable>
                {/* Table Header */}
                <DataTable.Header>
                  {[
                    'Sr#',
                    'Branch',
                    'Registration',
                    'Student',
                    'Father',
                    'B-Form',
                    'Class',
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

                {/* Table Rows */}
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.sr,
                        item.branch,
                        item.registration,
                        item.student,
                        item.father,
                        item.bForm,
                        item.class,
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

                      {/* Actions Cell with "Results Card" Button */}
                      <DataTable.Cell
                        style={{
                          width: 125,
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'green',
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                          onPress={() =>
                            console.log('Results Card for', item.student)
                          }>
                          <Icon
                            name="file"
                            size={16}
                            color={'#fff'}
                            style={{marginRight: 5}}
                          />
                          <Text style={{color: 'white', fontSize: 12}}>
                            Results Card
                          </Text>
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
              </DataTable>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ParentResult;

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
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
});
