import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  ImageBackground,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useUser} from '../../Ctx/UserContext';

interface News {
  id: number;
  new_name: string;
  new_desc: string;
  new_date: string;
  new_postedby: string;
}

interface Notice {
  id: number;
  notice_title: string;
  notice_desc: string;
  notice_date: string;
}

const TeacherAnnouncement = ({navigation}: any) => {
  const {token} = useUser();
  const [news, setNews] = useState<News[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Fetch news and notices from the API
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        'https://demo.capobrain.com/fetchprofile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setNews(response.data.news);
      setNotices(response.data.notice);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fetchAnnouncements();

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
    fetchAnnouncements();

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<News | Notice | null>(null);

  function handleCardClick(item: News | Notice): void {
    setSelectedItem(item);
    setIsModalVisible(true);
  }

  function closeModal(): void {
    setIsModalVisible(false);
    setSelectedItem(null);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-left"
          size={38}
          color={'#fff'}
          style={{paddingHorizontal: 10, paddingTop: 15}}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={require('../../assets/schoolnews.png')}
        />
        <Text style={styles.schoolText}>School Updates</Text>
      </View>

      <ScrollView
        style={styles.bottom}
        contentContainerStyle={styles.scrollContent}>
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

        {/* News Section */}
        <Text style={styles.sectionTitle}>News</Text>
        {news.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleCardClick(item)}>
            <View style={styles.cardHeader}>
              <Icon name="newspaper" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>{item.new_name}</Text>
            </View>
            <Text style={styles.cardDate}>
              {new Date(item.new_date).toLocaleDateString()} | Posted by:
              {item.new_postedby}
            </Text>
            <Text
              style={styles.cardDescription}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.new_desc}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Notices Section */}
        <Text style={styles.sectionTitle}>Notices</Text>
        {notices.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleCardClick(item)}>
            <View style={styles.cardHeader}>
              <Icon name="bell" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>{item.notice_title}</Text>
            </View>
            <Text style={styles.cardDate}>
              {new Date(item.notice_date).toLocaleDateString()}
            </Text>
            <Text
              style={styles.cardDescription}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.notice_desc}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for Complete Details */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedItem && 'new_name' in selectedItem
                  ? selectedItem.new_name
                  : selectedItem?.notice_title}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={24} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDate}>
              {selectedItem &&
                new Date(
                  'new_date' in selectedItem
                    ? selectedItem.new_date
                    : selectedItem.notice_date,
                ).toLocaleDateString()}
            </Text>
            <Text style={styles.modalDescription}>
              {selectedItem &&
                ('new_desc' in selectedItem
                  ? selectedItem.new_desc
                  : selectedItem.notice_desc)}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TeacherAnnouncement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b82f6',
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
  header: {
    width: wp('100%'),
    height: hp('30%'),
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: 80,
    height: 80,
    tintColor: 'white',
  },
  schoolText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  bottom: {
    backgroundColor: 'white',
    height: hp('70%'),
    width: wp('100%'),
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 30,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('10%'),
    paddingTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginLeft: wp('5%'),
    marginBottom: hp('1%'),
  },
  card: {
    width: wp('90%'),
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  updateIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3b82f6',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: hp('1%'),
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
  },

  // Modal Styling
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('90%'),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3b82f6',
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: hp('2%'),
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
  },
});
