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
import NavBar from '../components/NavBar';
import DropDownPicker from 'react-native-dropdown-picker';
import {Avatar} from 'react-native-paper';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

interface UserData {
  id: number;
  candidate: {
    cand_name: string;
  };
  bra: {
    bra_name: string;
  };
  parent: {
    par_fathername: string;
  };
  class: {
    cls_name: string;
  };
  school: {
    scl_institute_name: string;
  };
  section: {
    sec_name: string;
  };
}

const Result = ({navigation}: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchData = async (examType: string | null | undefined = null) => {
    if (token) {
      try {
        let url = 'https://demo.capobrain.com/fetchstd_result';
        if (examType) {
          url = `https://demo.capobrain.com/fetchexamtypresult?exam_type=${examType}&id=${userData?.id}&_token=${token}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const details = await axios.get(
          'https://demo.capobrain.com/fetchstd_result',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(details.data);
        return response.data.output;
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData', value], // Include value in the query key
    queryFn: () => fetchData(value), // Pass the selected exam type to fetchData
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    refetch();
  }, [value, refetch]);

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

  const examItems = [
    {label: 'Select Exams Type Filter', value: ''},
    {label: 'Mids', value: 'Mids'},
    {label: 'Annual', value: 'Annual'},
    {label: 'Mid', value: 'Mid'},
    {label: 'Final', value: 'Final'},
    {label: 'MID TERM', value: 'MID'},
    {label: 'ANNUAL TERM', value: 'ANNUAL%20TERM'},
    {label: 'MOCK TEST', value: 'MOCK%20TEST'},
    {label: 'Grand Test', value: 'Grand%20test'},
    {label: 'December Test', value: 'december%20test'},
    {label: 'Phase Test', value: 'phase%20test'},
    {label: 'Annualism', value: 'Annualism'},
  ];

  useEffect(() => {
    fetchData();
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
      <ScrollView nestedScrollEnabled>
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

          {/* Student Details */}
          <View style={styles.resultsCtr}>
            <View style={styles.headingCtr}>
              <Text style={styles.rsltHeading}>
                {userData?.school.scl_institute_name}
              </Text>
              <Text style={styles.branchText}>{userData?.bra.bra_name}</Text>
            </View>
            <View style={styles.examPickerCtr}>
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={open}
                value={value}
                setOpen={setOpen}
                setValue={setValue}
                placeholder="Select Exams Type Filter"
                items={examItems}
                style={{
                  borderColor: 'transparent',
                  backgroundColor: 'transparent',
                  borderRadius: 10,
                }}
                dropDownContainerStyle={{
                  borderColor: '#ccc',
                  borderRadius: 10,
                  height: 180,
                }}
                onChangeValue={selectedValue => {
                  setValue(selectedValue);
                }}
              />
            </View>
            <View style={styles.stdDetails}>
              <View style={styles.detailsCtr}>
                <Text style={styles.stdDetailsText}>Student Name:</Text>
                <Text style={styles.stdDetailsText}>Father Name:</Text>
                <Text style={styles.stdDetailsText}>Class:</Text>
                <Text style={styles.stdDetailsText}>Section:</Text>
              </View>
              <View style={styles.detailsCtr}>
                <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                  {userData?.candidate.cand_name}
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
              <View style={styles.picCtr}>
                <Avatar.Image
                  size={90}
                  source={require('../assets/avatar.png')}
                />
              </View>
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
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -3,
                    },
                    tr: {
                      marginTop: 2,
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
        </View>
      </ScrollView>
    </View>
  );
};

export default Result;

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

  // Results Styles
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
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  branchText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
    marginLeft: 30,
    marginTop: 15,
    textAlign: 'center',
  },
  examPickerCtr: {
    width: '90%',
    marginHorizontal: '5%',
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
    justifyContent: 'space-between',
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
  picCtr: {
    width: '30%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tblDataCtr: {
    marginTop: 10,
    marginBottom: 20,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
});
