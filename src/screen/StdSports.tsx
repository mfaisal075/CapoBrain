import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';

interface Sports {
  id: number;
  sport_name: string;
  date: string;
  time: string;
}

const StdSports = ({navigation}: any) => {
  const {token} = useUser();
  const [sports, setSports] = useState<Sports[]>([]);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/navbarsportsnotify',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setSports(response.data.sports);
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
  }, []);
  return (
    <View style={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sports Notification</Text>
      </View>

      <FlatList
        data={sports}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.circle}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: 'white',
                    alignSelf: 'center',
                  }}
                  source={require('../assets/9.png')}
                />
              </View>

              <View style={{marginLeft: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.label}>Sports Category: </Text>
                  <Text style={styles.value}>{item.sport_name}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.label}>Sport Name: </Text>
                  <Text style={styles.value}>{item.sport_name}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.label}>Date: </Text>
                  <Text style={styles.value}>{item.date}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.label}>Time: </Text>
                  <Text style={styles.value}>{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default StdSports;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  card: {
    width: wp('100%'),
    height: 'auto',
    borderColor: 'gray',
    padding: 15,
  },
  label: {
    color: 'black',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  circle: {
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
});
