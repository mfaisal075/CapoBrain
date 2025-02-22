import {
  BackHandler,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

const SummerHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<any>(null);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/studentsummerhomework',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Set user data for student details
        setUserData(response.data);

        return response.data.output;
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
      throw new Error('User is not authenticated');
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true, // Fetch new data when screen is focused
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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
            <Text style={styles.tblHdCtr}>Summer Vacation Homework</Text>
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
            <TouchableOpacity
              style={[
                styles.bckBtn,
                {backgroundColor: '#3B82F6', marginRight: 8},
              ]}
              onPress={() => navigation.navigate('SummerHomeworkResult')}>
              <Text style={styles.bckBtnText}>Summer Homework Result</Text>
            </TouchableOpacity>
          </View>

          {/* Student Details */}

          <View style={{width: '100%'}}>
            <ScrollView
              horizontal
              style={{flex: 1, padding: 10, paddingHorizontal: 0}}
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
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#000',
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: '100%',
                      marginLeft: 0,
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
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -10,
                    },
                    td: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      textAlign: 'center',
                      width: 90, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -3,
                    },
                    tr: {
                      backgroundColor: '#fff',
                    },
                    h6: {
                      marginVertical: 0,
                      textAlign: 'center',
                    },
                    span: {
                      backgroundColor: '#28a745', // Green background (Approved)
                      color: '#fff', // White text
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      alignSelf: 'center', // Center the badge
                    },
                    center: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    a: {
                      backgroundColor: '#3B82F6',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  }}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SummerHomework;

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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bckBtnCtr: {
    height: 'auto',
    width: '100%',
    justifyContent: 'flex-start', // Align buttons to the right
    flexDirection: 'row-reverse', // Reverse the direction of the buttons
    alignItems: 'center',
    paddingRight: 20,
    flexWrap: 'wrap',
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
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
});
