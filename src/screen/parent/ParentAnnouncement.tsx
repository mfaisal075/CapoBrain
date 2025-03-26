import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

const ParentAnnouncement = ({navigation}: any) => {
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

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-left"
          size={38}
          color={'#fff'}
          style={{paddingHorizontal: 10}}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={require('../../assets/schoolnews.png')}
        />
        <Text style={styles.schoolText}>Announcements</Text>
      </View>

      <ScrollView
        style={styles.bottom}
        contentContainerStyle={styles.scrollContent}>
        {/* News Section */}
        <Text style={styles.sectionTitle}>News</Text>
        {news.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image
                style={styles.updateIcon}
                source={require('../../assets/iconupdate.png')}
              />
              <Text style={styles.cardTitle}>{item.new_name}</Text>
            </View>
            <Text style={styles.cardDate}>
              {new Date(item.new_date).toLocaleDateString()} | Posted by:
              {item.new_postedby}
            </Text>
            <Text style={styles.cardDescription}>{item.new_desc}</Text>
          </View>
        ))}

        {/* Notices Section */}
        <Text style={styles.sectionTitle}>Notices</Text>
        {notices.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image
                style={styles.updateIcon}
                source={require('../../assets/iconupdate.png')}
              />
              <Text style={styles.cardTitle}>{item.notice_title}</Text>
            </View>
            <Text style={styles.cardDate}>
              {new Date(item.notice_date).toLocaleDateString()}
            </Text>
            <Text style={styles.cardDescription}>{item.notice_desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ParentAnnouncement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b82f6',
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
});
