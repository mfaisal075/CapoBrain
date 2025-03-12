import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TeacherComment = ({navigation}: any) => {
  const [comment, setComment] = useState('');

  const [comments, setComments] = useState([
    {name: 'Ahmad', text: '---', date: '2024-12-06'},
    {name: 'Ahmad', text: 'Done', date: '2024-12-06'},
    {name: 'Ahmad', text: '....', date: '2024-12-06'},
  ]);
  const handleCommentSubmit = () => {
    if (comment.trim() === '') {
      Alert.alert('Error', 'Please enter a comment.');
      return;
    }

    const newComment = {
      name: 'You',
      text: comment,
      date: new Date().toISOString().split('T')[0],
    };

    setComments([...comments, newComment]);
    setComment('');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherTodos' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Staff's Comments</Text>
      </View>

      <View style={styles.todoContainer}>
        <Text style={styles.todoLabel}>Todo Name:</Text>
        <Text style={styles.todoValue}>Check Notebooks</Text>
      </View>

      <ScrollView>
        <View>
          {comments.map((item, index) => (
            <View
              key={index}
              style={[
                styles.commentBox,
                {backgroundColor: item.name === 'You' ? '#A5B68D' : '#4F959D'},
              ]}>
              <Text style={styles.commentName}>{item.name}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentDate}>Posted on: {item.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.addCommentText}>Add a Comment</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write your comment here..."
          value={comment}
          onChangeText={text => setComment(text)}
        />
      </View>

      <TouchableOpacity onPress={handleCommentSubmit}>
        <View style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TeacherComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  todoContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
  },
  todoLabel: {
    fontSize: 18,
  },
  todoValue: {
    fontSize: 18,
    marginLeft: 10,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    width: wp('90%'),
    alignSelf: 'center',
    marginVertical: 10,
    padding: 10,
  },
  commentName: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
  },
  commentDate: {
    color: 'white',
    textAlign: 'right',
    marginTop: 5,
  },
  addCommentText: {
    marginLeft: 10,
    fontSize: 20,
    marginTop: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'center',
    width: wp('90%'),
    height: 45,
    marginTop: 7,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    marginLeft: 20,
    width: 70,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
});
