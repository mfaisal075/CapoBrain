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
import NavBar from '../components/NavBar';
import {DataTable} from 'react-native-paper';

interface Item {
  sr: number;
  class: string;
  section: string;
  title: string;
  date: string;
  action: string;
}

const LMS = ({navigation}: any) => {
  const [items] = useState<Item[]>([]);
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
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
      {/* NavBar */}
      <NavBar />
      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Lecture</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../assets/back.png')}
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
                  {['Sr#', 'Class', 'Section', 'Title', 'Date', 'Action'].map(
                    (title, index) => (
                      <DataTable.Title
                        key={index}
                        textStyle={{
                          color: 'black',
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                        style={{
                          width: index === 0 ? 50 : '20%', // Reduced width for the first header
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

                {/* Table Rows */}
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.sr,
                        item.class,
                        item.section,
                        item.title,
                        item.date,
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
                      <DataTable.Cell
                        key={'action'}
                        textStyle={{color: '#000', fontSize: 12}}
                        style={{
                          width: 125,
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            console.log('Download clicked');
                          }}>
                          <View
                            style={{
                              backgroundColor: 'green',
                              padding: 10,
                              borderRadius: 5,
                              alignItems: 'center',
                            }}>
                            <Text style={{color: '#fff', fontSize: 14}}>
                              {item.action}
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
              </DataTable>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LMS;

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
});
