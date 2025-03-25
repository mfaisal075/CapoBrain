import {
  Alert,
  Animated,
  BackHandler,
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
    const backAction = () => {
      navigation.navigate('TeacherTodos');
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
                {backgroundColor: item.name === 'You' ? 'white' : 'white'},
              ]}>
              <Text style={styles.commentName}>{item.name}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentDate}>Posted on: {item.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.addCommentText}>Add a Comment</Text>

      <View
        style={{
          flexDirection: 'row',
          marginBottom: '2%',
        }}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write your comment here..."
            value={comment}
            onChangeText={text => setComment(text)}
            placeholderTextColor={'#3b82f6'}
          />
        </View>

        <TouchableOpacity onPress={handleCommentSubmit}>
          <View style={styles.submitButton}>
            <Text style={styles.submitText}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  todoValue: {
    fontSize: 16,
    marginLeft: 10,
    color: '#3b82f6',
  },
  commentBox: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    width: wp('95%'),
    alignSelf: 'center',
    marginVertical: 5,
    padding: 5,
    borderRadius: 12,
    elevation: 5,
  },
  commentName: {
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 3,
  },
  commentText: {
    marginTop: 3,
    color: '#3b82f6',
  },
  commentDate: {
    color: '#3b82f6',
    textAlign: 'right',
    marginTop: 5,
    marginRight: 5,
  },
  addCommentText: {
    marginLeft: 10,
    fontSize: 16,
    marginTop: 10,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignSelf: 'center',
    width: wp('76%'),
    height: 45,
    marginTop: 5,
    borderRadius: 5,
    marginLeft: '2%',
    color: '#3b82f6',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    marginTop: 13,
    marginLeft: 4,
    width: 70,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2%',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
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
