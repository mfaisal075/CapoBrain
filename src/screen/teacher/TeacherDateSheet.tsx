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
import React, {useEffect} from 'react';
import NavBar from '../../components/NavBar';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
} from 'react-native-render-html';

const TeacherDateSheet = ({navigation}: any) => {
  const {token} = useUser();

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchdatesheet',
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

  useEffect(() => {
    refetch();
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
            <Text style={styles.tblHdCtr}>Date Sheet</Text>
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

          {/* Student Details */}
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
                      marginBottom: -3,
                      borderBottomColor: 'white',
                    },
                    tr: {
                      backgroundColor: '#fff',
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

export default TeacherDateSheet;

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
    height: 300,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Add Date Sheet modal styling
  addSbjCtr: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  modalBody: {
    borderTopWidth: 0.5,
    borderColor: 'gray',
    paddingTop: 5,
  },
  pickerCtr: {
    height: 'auto',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: '5%',
  },
  picker: {
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    position: 'absolute',
    left: 15,
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
  dataCtr: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
  },
  clsIconCtr: {
    position: 'absolute',
    right: 20,
    top: -45,
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
});
