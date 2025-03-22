import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
      }
    } else {
      console.log('User is not Authenticated');
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();

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
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const SportCard = ({sport}: {sport: Sports}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    const onPressIn = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 1,
          duration: 1,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const onPressOut = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{scale: scaleAnim}, {translateY: translateYAnim}],
            },
          ]}>
          {/* Card content remains the same */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.circle}>
              <Image
                style={styles.iconImage}
                source={require('../assets/9.png')}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.label}>Sport Name: </Text>
                <Text style={styles.value}>{sport.sport_name}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.label}>Date: </Text>
                  <Text style={styles.value}>{sport.date}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 20}}>
                  <Text style={styles.label}>Time: </Text>
                  <Text style={styles.value}>{sport.time}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      nestedScrollEnabled>
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
        renderItem={({item}) => <SportCard sport={item} />}
        contentContainerStyle={styles.listContent}
      />
    </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  card: {
    width: wp('100%'),
    height: 75,
    borderColor: '#3b82f6',
    padding: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  label: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#3b82f6',
  },
  circle: {
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  iconImage: {
    width: 20,
    height: 20,
    tintColor: 'white',
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});
