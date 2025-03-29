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
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';

interface FeedBack {
  id: number;
  student_id: string;
  cand_name: string;
  bra_name: string;
  cls_name: string;
  sec_name: string;
}

interface FeedbackData {
  feedback: {
    fed_added_by: string;
    fed_detials: string;
    fed_date: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  candidate: {
    cand_name: string;
  };
}

interface Review {
  id: number;
  bra_name: string;
  cand_name: string;
  student_id: string;
}

interface ReviewData {
  stdreview: {
    caring_staff_rate: string;
    inpir_staff_rate: string;
    environment_rate: string;
    academic_rate: string;
    reward_rate: string;
  };
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
  addedby: {
    name: string;
  };
}

const Feedback = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpn, setIsOpn] = useState(false);
  const [type, setType] = useState('Feedback');
  const [feedback, setFeedback] = useState<FeedBack[]>([]);
  const [review, setReview] = useState<Review[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  const itemz = [
    {label: '📝 Feedback', value: 'Feedback'},
    {label: '⭐ Review', value: 'Review'},
  ];

  const Info = [
    {key: 'Student ID', value: reviewData?.student.student_id},
    {key: 'Student Name', value: reviewData?.student.cand_name},
    {key: 'Father Name', value: reviewData?.parent.par_fathername},
    {key: 'Class', value: reviewData?.class.cls_name},
    {key: 'Section', value: reviewData?.section.sec_name},
    {key: 'Reviewed By', value: reviewData?.addedby.name},
  ];
  const [isModalVisi, setModalVisi] = useState(false);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/fetchportalreviewandfeedback?feedbackandreview=${type}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (type === 'Feedback') {
          setFeedback(response.data.feedback);
        }
        if (type === 'Review') {
          setReview(response.data.staffreview);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

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
          source={require('../assets/bgimg.jpg')}
        />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
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
        feedback.length > 0 ? (
          <FlatList
            data={feedback}
            keyExtractor={(item, index) =>
              item.id.toString() || `item-${index}`
            }
            renderItem={({item}) => (
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>{item.student_id}</Text>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => {
                      const handleViewFeedback = async (id: number) => {
                        try {
                          const response = await axios.get(
                            `https://demo.capobrain.com/studentfeedback-show?id=${item.id}&_token=${token}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          setFeedbackData(response.data);
                          setModalVisi(true);
                        } catch (error) {
                          console.log(error);
                          throw error;
                        }
                      };

                      handleViewFeedback(item.id);
                    }}>
                    <Image
                      style={styles.actionIcon}
                      source={require('../assets/visible.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: '#3b82f6', fontWeight: 'bold'}}>
              No data found in the database!
            </Text>
          </View>
        )
      ) : review.length > 0 ? (
        <FlatList
          data={review}
          keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.title}>{item.student_id}</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    const handleViewReview = async (id: number) => {
                      try {
                        const response = await axios.get(
                          `https://demo.capobrain.com/stdreviewshow?id=${item.id}&_token=${token}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );
                        setReviewData(response.data);
                        setModalVisi(true);
                      } catch (error) {
                        console.log(error);
                        throw error;
                      }
                    };

                    handleViewReview(item.id);
                  }}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../assets/visible.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#3b82f6', fontWeight: 'bold'}}>
            No data found in the database!
          </Text>
        </View>
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
            <Animated.View
              style={[
                styles.animatedBackground,
                {transform: [{translateY: moveAnim}]},
              ]}>
              <ImageBackground
                resizeMode="cover"
                style={styles.backgroundImage}
                source={require('../assets/bgimg.jpg')}
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
              Feedback Detail
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: '#3b82f6',
                width: wp('90%'),
                marginBottom: 5,
              }}
            />

            <Text style={styles.lblText}>Feedback:</Text>
            <Text
              style={[
                styles.valueText,
                {marginLeft: '5%', marginRight: '10%'},
              ]}>
              {feedbackData?.feedback.fed_detials}
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
                  {feedbackData?.feedback.fed_added_by}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.lblText}>Date:</Text>
                <Text style={[styles.valueText, {marginLeft: 5}]}>
                  {formatDate(feedbackData?.feedback.fed_date ?? '--')}
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
              maxHeight: 'auto',
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
                source={require('../assets/bgimg.jpg')}
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
              <Text style={styles.valueText}>
                {reviewData?.stdreview.caring_staff_rate}
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
              <Text style={styles.valueText}>
                {reviewData?.stdreview.inpir_staff_rate}
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
              <Text style={styles.valueText}>
                {reviewData?.stdreview.environment_rate}
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
              <Text style={styles.valueText}>
                {reviewData?.stdreview.academic_rate}
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
              <Text style={styles.valueText}>
                {reviewData?.stdreview.reward_rate}
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

export default Feedback;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
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
  },
  actionIcon: {
    width: 17,
    height: 17,
    tintColor: '#3b82f6',
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
    marginRight: '2%',
    marginTop: '1%',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
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
});
