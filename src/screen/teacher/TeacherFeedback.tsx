import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';

interface FeedbackData {
  id: number;
  feed_feedback: string;
  feed_feedbackby: string;
  feed_date: string;
  cls_name: string;
  sec_name: string;
  bra_name: string;
}

interface ReviewData {
  id: number;
  staff_id: string;
  bra_name: string;
  app_name: string;
}

interface FeedBackDetails {
  employee: {
    app_name: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  branch: {
    bra_name: string;
  };
  feedback: {
    feed_feedbackby: string;
    feed_date: string;
    feed_feedback: string;
  };
}

interface ReviewDetails {
  staff: {
    app_name: string;
    staff_id: string;
  };
  school: {
    scl_institute_name: string;
  };
  added_by: {
    name: string;
  };
  branch: {
    bra_name: string;
  };
  staffreview: {
    efective_tech_rate: string;
    tech_staff_rate: string;
    tech_itigration_rate: string;
    academic_rate: string;
    climate_rate: string;
  };
}

const TeacherFeedback = ({navigation}: any) => {
  const {token, userName} = useUser();
  const [isOpn, setIsOpn] = useState(false);
  const [isModalVisi, setModalVisi] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [type, setType] = useState('Feedback');
  const [feedbackDetail, setFeedbackDetail] = useState<FeedBackDetails | null>(
    null,
  );
  const [reviewDetails, setReviewDetails] = useState<ReviewDetails | null>(
    null,
  );

  const itemz = [
    {label: '📝 Feedback', value: 'Feedback'},
    {label: '⭐ Review', value: 'Review'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchportalreviewandfeedback' +
            `?feedbackandreview=${type}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (type === 'Feedback') {
          setFeedbackData(response.data.feedback);
        }
        if (type === 'Review') {
          setReviewData(response.data.staffreview);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  const Info = [
    {key: 'Staff ID', value: reviewDetails?.staff.staff_id},
    {key: 'Staff Name', value: reviewDetails?.staff.app_name},
    {key: 'Review By', value: reviewDetails?.added_by.name},
  ];

  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    fetchData();
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [type]);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {transform: [{translateY: moveAnim}]},
        ]}>
        <ImageBackground
          resizeMode="cover"
          style={styles.backgroundImage}
          source={require('../../assets/bgimg.jpg')}
        />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Feedback</Text>
      </View>

      <View style={{width: '95%', marginTop: 10, marginBottom: 10}}>
        <DropDownPicker
          items={itemz}
          open={isOpn}
          setOpen={setIsOpn}
          value={type}
          setValue={callback => {
            const newType =
              typeof callback === 'function' ? callback(type) : callback;
            setType(newType);
          }}
          maxHeight={200}
          placeholderStyle={{color: '#3b82f6'}}
          labelStyle={{color: '#3b82f6'}}
          textStyle={{color: '#3b82f6'}}
          placeholder="📝 Feedback"
          style={styles.dropdown}
          dropDownContainerStyle={{
            marginLeft: 10,
            borderColor: '#3b82f6',
          }}
          ArrowUpIconComponent={({style}) => (
            <Icon name="chevron-up" size={22} color="#3b82f6" style={style} />
          )}
          ArrowDownIconComponent={({style}) => (
            <Icon name="chevron-down" size={22} color="#3b82f6" style={style} />
          )}
          TickIconComponent={({style}) => (
            <Icon name="check" size={22} color="#3b82f6" style={style} />
          )}
        />
      </View>

      {type === 'Feedback' ? (
        <FlatList
          data={feedbackData}
          keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.title}>{userName}</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    const handleViewFeedback = async (id: number) => {
                      try {
                        const response = await axios.get(
                          `https://demo.capobrain.com/showfeedback?id=${id}&_token=${token}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        setFeedbackDetail(response.data);

                        setModalVisi(true);
                        // You can set the state here to pass the data to the modal
                        // setFeedbackDetail(feedbackDetail);
                      } catch (error) {
                        console.log(error);
                      }
                    };

                    handleViewFeedback(item.id);
                  }}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={reviewData}
          keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.title}>{item.app_name}</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    const handleViewReview = async (id: number) => {
                      try {
                        const response = await axios.get(
                          `https://demo.capobrain.com/staffreviewshow?id=${id}&_token=${token}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        setReviewDetails(response.data);
                        setModalVisi(true);
                      } catch (error) {
                        console.log(error);
                      }
                    };

                    handleViewReview(item.id);
                  }}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal */}
      <Modal isVisible={isModalVisi}>
        {type === 'Feedback' ? (
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              width: 'auto',
              maxHeight: 300,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#3b82f6',
              overflow: 'hidden',
            }}>
            <Text
              style={{
                color: '#3b82f6',
                fontSize: 18,
                textAlign: 'center',
                margin: 10,
                fontWeight: 'bold',
              }}>
              Feedback Detail
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: '#3b82f6',
                width: wp('90%'),
                marginBottom: 15,
              }}
            />

            <Text style={styles.lblText}>Feedback:</Text>
            <Text
              style={[
                styles.valueText,
                {marginLeft: '5%', marginRight: '10%'},
              ]}>
              {feedbackDetail?.feedback.feed_feedback}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginLeft: 10,
                marginRight: '5%',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.lblText}>Added By:</Text>
                <Text style={[styles.valueText, {marginLeft: 5}]}>
                  {feedbackDetail?.feedback.feed_feedbackby}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.lblText}>Date:</Text>
                <Text style={[styles.valueText, {marginLeft: 5}]}>
                  {formatDate(feedbackDetail?.feedback.feed_date ?? '--')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisi(!isModalVisi)}
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginTop: 'auto',
                marginBottom: 10,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              width: 'auto',
              maxHeight: 400,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#3b82f6',
              overflow: 'hidden',
            }}>
            <Animated.View
              style={[
                styles.animatedBackground,
                {transform: [{translateY: moveAnim}]},
              ]}>
              <ImageBackground
                resizeMode="cover"
                style={styles.backgroundImage}
                source={require('../../assets/bgimg.jpg')}
              />
            </Animated.View>
            <Text
              style={{
                color: '#3b82f6',
                fontSize: 18,
                textAlign: 'center',
                margin: 10,
                fontWeight: 'bold',
              }}>
              Show Staff Review Details
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: '#3b82f6',
                width: wp('90%'),
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginTop: 15,
              }}>
              <Text style={styles.lblText}>Academic Performance</Text>
              <Text style={[styles.valueText, {marginRight: 10}]}>
                {reviewDetails?.staffreview.efective_tech_rate}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginTop: 6,
              }}>
              <Text style={styles.lblText}>Behavior and Conduct</Text>
              <Text style={[styles.valueText, {marginRight: 10}]}>
                {reviewDetails?.staffreview.tech_staff_rate}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginTop: 6,
              }}>
              <Text style={styles.lblText}>
                Social and Emotional Development
              </Text>
              <Text style={[styles.valueText, {marginRight: 10}]}>
                {reviewDetails?.staffreview.tech_itigration_rate}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginTop: 6,
              }}>
              <Text style={styles.lblText}>Extra-curricular Involvement</Text>
              <Text style={[styles.valueText, {marginRight: 10}]}>
                {reviewDetails?.staffreview.academic_rate}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 10,
                marginTop: 6,
              }}>
              <Text style={styles.lblText}>Goal Setting and Progress</Text>
              <Text style={[styles.valueText, {marginRight: 10}]}>
                {reviewDetails?.staffreview.climate_rate}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisi(!isModalVisi)}
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginTop: 'auto',
                marginBottom: 10,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default TeacherFeedback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 4,
    textAlign: 'center',
    color: 'gray',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 35,
    marginLeft: 10,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 130,
    padding: 1,
    textAlign: 'center',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  paginationText: {
    fontWeight: 'bold',
  },
  pageNumber: {
    width: 22,
    height: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  pageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatList: {
    margin: 10,
    flex: 1,
  },
  lblText: {
    fontWeight: 'bold',
    color: '#3b82f6',
    marginLeft: '5%',
    marginTop: 5,
  },
  valueText: {
    color: '#3b82f6',
    marginTop: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 20,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    marginLeft: 40,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  value: {
    marginLeft: 10,
  },
  animatedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    marginLeft: '2%',
    marginRight: '3%',
    marginTop: '1%',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});
