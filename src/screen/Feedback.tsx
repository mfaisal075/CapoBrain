import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';

type TableRow = {
  sr: string;
  studentId: string;
  student: string;
  branch: string;
  class: string;
  section: string;
  action: string;
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [type, setType] = useState('Feedback');
  const [feedback, setFeedback] = useState<FeedBack[]>([]);
  const [review, setReview] = useState<Review[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  const originalData: TableRow[] = [
    {
      sr: '1',
      studentId: 'GCGS1124S001',
      student: 'Ayesha Zumar',
      branch: 'Main Branch',
      class: 'Five',
      section: 'A',
      action: '',
    },
  ];

  const itemz = [
    {label: 'Feedback', value: 'Feedback'},
    {label: 'Review', value: 'Review'},
  ];

  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  const items = [
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setTableData(originalData);
    } else {
      const filtered = originalData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(text.toLowerCase()),
        ),
      );
      setTableData(filtered);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentEntries = tableData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );
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

  useEffect(() => {
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

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
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

      <View style={{width: 150, marginTop: 10}}>
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
          placeholder="Feedback"
          style={styles.dropdown}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: 80, marginTop: 9}}>
          <DropDownPicker
            items={items}
            open={isOpen}
            setOpen={setIsOpen}
            value={entriesPerPage}
            setValue={callback => {
              setEntriesPerPage(prev =>
                typeof callback === 'function' ? callback(prev) : callback,
              );
            }}
            maxHeight={200}
            placeholder=""
            style={styles.dropdown}
          />
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={'gray'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Table */}
      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          {type === 'Feedback' ? (
            <FlatList
              style={styles.flatList}
              data={feedback}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {[
                    'Sr#',
                    'Student ID',
                    'Student',
                    'Branch',
                    'Class',
                    'Section',
                    'Action',
                  ].map(header => (
                    <Text
                      key={header}
                      style={[styles.column, styles.headTable]}>
                      {header}
                    </Text>
                  ))}
                </View>
              )}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.row,
                    {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                  ]}>
                  <Text style={styles.column}>{index + 1}</Text>
                  <Text style={styles.column}>{item.student_id}</Text>
                  <Text style={styles.column}>{item.cand_name}</Text>
                  <Text style={styles.column}>{item.bra_name}</Text>
                  <Text style={styles.column}>{item.cls_name}</Text>
                  <Text style={styles.column}>{item.sec_name}</Text>
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
              )}
            />
          ) : (
            <FlatList
              style={styles.flatList}
              data={review}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {[
                    'Sr#',
                    'Branch',
                    'Student ID',
                    'Student Name',
                    'Action',
                  ].map(header => (
                    <Text
                      key={header}
                      style={[styles.column, styles.headTable]}>
                      {header}
                    </Text>
                  ))}
                </View>
              )}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.row,
                    {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                  ]}>
                  <Text style={styles.column}>{index + 1}</Text>
                  <Text style={styles.column}>{item.bra_name}</Text>
                  <Text style={styles.column}>{item.student_id}</Text>
                  <Text style={styles.column}>{item.cand_name}</Text>
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
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <Text>
          Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
          {Math.min(currentPage * entriesPerPage, tableData.length)} of{' '}
          {tableData.length} entries
        </Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          <View style={styles.pageNumber}>
            <Text style={styles.pageText}>{currentPage}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* View Modal */}
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
              borderColor: '#6C757D',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text style={{color: '#6C757D', fontSize: 18}}>
                Feedback Detail
              </Text>

              <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
                <Text style={{color: '#6C757D'}}>✖</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: 'gray',
                width: wp('90%'),
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.lblText}>Name</Text>
                <Text style={styles.valueText}>
                  {feedbackData?.candidate.cand_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 50,
                }}>
                <Text style={styles.lblText}>Class</Text>
                <Text style={styles.valueText}>
                  {feedbackData?.class.cls_name}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.lblText}>Section</Text>
                <Text style={styles.valueText}>
                  {feedbackData?.section.sec_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 20,
                }}>
                <Text style={styles.lblText}>Added By</Text>
                <Text style={styles.valueText}>
                  {feedbackData?.feedback.fed_added_by}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginLeft: 10,
                marginTop: 10,
                flexDirection: 'row',
              }}>
              <Text style={styles.lblText}>Date</Text>
              <Text style={styles.valueText}>
                {feedbackData?.feedback.fed_date}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 10,
                marginTop: 10,
              }}>
              <Text style={styles.lblText}>Feedback:</Text>
              <Text style={styles.valueText}>
                {feedbackData?.feedback.fed_detials}
              </Text>
            </View>
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
              borderColor: '#6C757D',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text style={{color: '#6C757D', fontSize: 18}}>
                Show Staff Review Details
              </Text>

              <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
                <Text style={{color: '#6C757D'}}>✖</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: 'gray',
                width: wp('90%'),
              }}
            />

            <FlatList
              contentContainerStyle={{paddingBottom: 10}}
              style={{flexGrow: 0, marginTop: 10}}
              data={Info || []}
              keyExtractor={(item, index) =>
                item?.key ? item.key.toString() : index.toString()
              }
              renderItem={({item}) => {
                if (!item) return null;
                return (
                  <View style={styles.infoRow}>
                    <Text style={styles.text}>{item.key}:</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                );
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
    minHeight: 30,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 140,
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
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 20,
  },
  actionIcon: {
    width: 17,
    height: 17,
    tintColor: '#3b82f6',
    marginLeft: 30,
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
});
