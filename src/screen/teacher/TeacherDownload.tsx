import {
  BackHandler,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import NavBar from '../../components/NavBar';
import {Image} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

const TeacherDownload = ({navigation}: any) => {
  const {token} = useUser();

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/staff_fetchstafffiles',
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
            <Text style={styles.tblHdCtr}>Download Material</Text>
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
                      fontSize: 20,
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
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -10,
                      marginTop: -10
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
                      marginLeft: -3
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
                      backgroundColor: 'green',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 5,
                      color: '#fff',
                      textDecorationLine: 'none',
                      fontWeight: 'bold',
                      fontSize: 12,
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

export default TeacherDownload;

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
