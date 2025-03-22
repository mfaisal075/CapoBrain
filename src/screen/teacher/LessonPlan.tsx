import {
  Alert,
  BackHandler,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import RNFS from 'react-native-fs';

interface Lessons {
  id: number;
  date: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
  bra_name: string;
}

interface LessonsData {
  lesson: {
    date: string;
    les_desc: string;
    file: string;
  };
  class: {
    cls_name: string;
  };
  subject: {
    sub_name: string;
  };
  branch: {
    bra_name: string;
  };
}

const LessonPlan = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [originalData, setOriginalData] = useState<Lessons[]>([]);
  const [tableData, setTableData] = useState<Lessons[]>(originalData);
  const [visible, setVisible] = useState(false);
  const [lessonData, setLessonData] = useState<LessonsData | null>(null);

  const toggleModal = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showlesson?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLessonData(res.data);
      setVisible(!visible);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async (url: any) => {
    try {
      const fileName = url.split('/').pop();
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
      };

      const download = RNFS.downloadFile(options);

      download.promise.then(response => {
        if (response.statusCode === 200) {
          Alert.alert('Success', `File downloaded to ${downloadDest}`);
        } else {
          Alert.alert('Error', 'Failed to download file');
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'An error occurred while downloading the file');
    }
  };

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

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/lesson-fetchlesson' + `?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.lessons);
        setTableData(response.data.lessons);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
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
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lesson Plan List</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
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
          <FlatList
            style={styles.flatList}
            data={currentEntries}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {['Sr#', 'Branch', 'Class', 'Subject', 'Date', 'Action'].map(
                  header => (
                    <Text
                      key={header}
                      style={[styles.column, styles.headTable]}>
                      {header}
                    </Text>
                  ),
                )}
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
                <Text style={styles.column}>{item.cls_name}</Text>
                <Text style={styles.column}>{item.sub_name}</Text>
                <Text style={styles.column}>{formatDate(item.date)}</Text>
                <Text style={styles.column}>
                  <TouchableOpacity onPress={() => toggleModal(item.id)}>
                    <Icon name="eye" size={18} color="#3b82f6" />
                  </TouchableOpacity>
                </Text>
              </View>
            )}
          />
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
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Planned Lesson Details</Text>

            {/* First Row: Branch & Subject */}
            <View style={styles.modalRow}>
              <View style={styles.modalColumn}>
                <Text style={styles.label}>Branch:</Text>
                <Text style={styles.value}>{lessonData?.branch.bra_name}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Subject:</Text>
                <Text style={styles.value}>{lessonData?.subject.sub_name}</Text>
              </View>
            </View>

            {/* Second Row: Class & Section + Attach Button */}
            <View style={styles.modalRow}>
              <View style={styles.modalColumn}>
                <Text style={styles.label}>Class:</Text>
                <Text style={styles.value}>{lessonData?.class.cls_name}</Text>
              </View>
              <View style={styles.modalColumn}>
                <Text style={styles.label}>Attachment</Text>
                {/* Attachment Button */}
                <TouchableOpacity
                  style={styles.attachmentButton}
                  onPress={() => {
                    downloadFile(
                      `https://demo.capobrain.com/lessons/${lessonData?.lesson.file}`,
                    );
                  }}>
                  <Text style={styles.attachmentText}>Attachment</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Description */}
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{lessonData?.lesson.les_desc}</Text>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LessonPlan;

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

  //Modal Styling
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalColumn: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  attachmentButton: {
    marginTop: 10,
  },
  attachmentText: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
