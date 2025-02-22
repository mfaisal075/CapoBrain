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
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

interface UserData {
  student: {
    student_id: string;
    cand_name: string;
  };
  parent: {
    par_fathername: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  school: {
    scl_institute_name: string;
  };
  branch: {
    bra_name: string;
  };
}

const SummerHomeWorkResult = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstudentsummerhomeworkmarking',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(response.data);
        return response.data.output;
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error('User is not authenticated');
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
      navigation.navigate('LMS');
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
            <Text style={styles.tblHdCtr}>Summer Vacation Homework Result</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.navigate('LMS')}>
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
          </View>

          {/* Student Details */}
          <View style={styles.resultsCtr}>
            <View style={styles.headingCtr}>
              <Text style={styles.rsltHeading}>
                {userData?.school.scl_institute_name}
              </Text>
              <Text style={styles.branchText}>{userData?.branch.bra_name}</Text>
            </View>
            <View style={styles.stdDetails}>
              <View style={styles.detailsCtr}>
                <Text style={styles.stdDetailsText}>Student ID:</Text>
                <Text style={styles.stdDetailsText}>Student Name:</Text>
                <Text style={styles.stdDetailsText}>Father Name:</Text>
                <Text style={styles.stdDetailsText}>Class:</Text>
                <Text style={styles.stdDetailsText}>Section:</Text>
              </View>
              <View style={styles.detailsCtr}>
                <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                  {userData?.student.student_id}
                </Text>
                <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                  {userData?.student.cand_name}
                </Text>
                <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                  {userData?.parent.par_fathername}
                </Text>
                <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                  {userData?.class.cls_name}
                </Text>
                <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                  {userData?.section.sec_name}
                </Text>
              </View>
            </View>
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
                        width: '100%',
                      },
                      h6: {
                        marginVertical: 0,
                        textAlign: 'center',
                      },
                    }}
                  />
                ) : null}
              </ScrollView>
            </View>
            <View style={styles.attendanceCtr}>
              <View style={styles.printBtnCtr}>
                <TouchableOpacity style={styles.printBtn}>
                  <Icon name="file" size={20} color={'#fff'} />
                  <Text style={styles.printBtnText}>Print</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SummerHomeWorkResult;

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
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Student Details Container
  resultsCtr: {
    width: 'auto',
    height: 'auto',
  },
  headingCtr: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  rsltHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  branchText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    marginTop: 15,
  },
  examPickerCtr: {
    width: '60%',
    marginHorizontal: 20,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  stdDetails: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailsCtr: {
    width: '35%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 10,
  },
  stdDetailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  printBtnCtr: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  printBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  tblDataCtr: {
    marginTop: 10,
    marginBottom: 20,
    height: 'auto',
    width: '100%',
    paddingLeft: 5,
  },
});
