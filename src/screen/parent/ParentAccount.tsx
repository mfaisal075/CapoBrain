import {
  Animated,
  BackHandler,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface UserData {
  user: {
    role: string;
    email: string;
    contact: string;
    name: string;
    user_name: string;
    cnic: string;
  };
  parent_receiveable: number;
  parent_paid: number;
  parent_inventory: number;
  parent_balance: number;
}

interface Account {
  id: number;
  bra_name: string;
  form_id: string;
  cand_name: string;
  cls_name: string;
  sec_name: string;
  stuacc_balance: string;
}

const ParentAccount = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [originalData, setOriginalData] = useState<Account[]>([]);

  const Info = [
    {key: 'Receivable', value: userData?.parent_receiveable ?? '0'},
    {key: 'Paid', value: userData?.parent_paid ?? '0'},
    {key: 'Inventory', value: userData?.parent_inventory ?? '0'},
    {key: 'Balance', value: userData?.parent_balance ?? '0'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchchildren',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.candidates);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
      throw new Error('User is not authenticated');
    }
  };

  const balanceFetch = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchprofile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(response.data);
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

    balanceFetch();
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
    <View style={{backgroundColor: 'white', flex: 1}}>
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
        <Text style={styles.headerText}>Accounts</Text>
      </View>

      <View style={styles.box}>
        <FlatList
          data={Info}
          keyExtractor={item => item.key}
          renderItem={({item}) => (
            <View style={styles.info}>
              <Text style={styles.text}>{item.key}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          )}
        />
      </View>
      <Text
        style={{
          marginLeft: '3%',
          fontWeight: 'bold',
          fontSize: 18,
          color: '#3b82f6',
        }}>
        Account Details
      </Text>

      {originalData.length > 0 ? (
        <FlatList
          data={originalData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[styles.title, {width: '40%'}]}>
                  {item.cand_name}
                </Text>
                <Text
                  style={{color: '#3b82f6', width: '30%', textAlign: 'center'}}>
                  {item.form_id}
                </Text>
                <Text
                  style={{color: '#3b82f6', textAlign: 'right', width: '30%'}}>
                  {item.stuacc_balance}
                </Text>
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
    </View>
  );
};

export default ParentAccount;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    top: -6,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: 'white',
    marginLeft: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    padding: 2,
    color: 'white',
  },
  value: {
    padding: 2,
    color: 'white',
  },
  box: {
    marginTop: 10,
    width: '96%',
    borderRadius: 10,
    padding: 7,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    opacity: 1,
    marginBottom: 5,
    height: 130,
  },
  cards: {
    borderRadius: 10,
    marginBottom: 10,
    margin: '2%',
    height: 240,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginLeft: '2%',
    elevation: 5,
    opacity: 1,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginRight: '2%',
    marginTop: '1%',
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
