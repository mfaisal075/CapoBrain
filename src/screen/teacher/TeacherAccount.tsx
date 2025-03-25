import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

interface UserData {
  teacher_account: {
    acc_payable_amount: string;
    acc_paid_amount: string;
    arrears_amount: string;
  };
}

interface Account {
  id: number;
  acc_date: string;
  acc_payable_amount: string;
  stationary_paid_amount: string;
  arrears_amount: string;
  acc_paid_amount: string;
  acc_balance: string;
  payment_method: string;
  payment_mode: string;
}

const TeacherAccount = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [accountData, setAccountData] = useState<UserData | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null,
  );
  const [originalData, setOriginalData] = useState<Account[]>([]);
  const Info = [
    {
      key: 'Salary Payable',
      value: accountData?.teacher_account.acc_payable_amount ?? '0',
    },
    {
      key: 'Paid Salary',
      value: accountData?.teacher_account.acc_paid_amount ?? '0',
    },
    {
      key: 'Inventory',
      value: accountData?.teacher_account.arrears_amount ?? '0',
    },
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/staffaccountdetails' + `?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOriginalData(response.data.accounts);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  const fetchAccountData = async () => {
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

        setAccountData(response.data);

        return response.data.newsoutput;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
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
    fetchAccountData();
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

  const EntryRow = ({label, value}: {label: string; value: string}) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{fontWeight: 'bold', color: '#3b82f6'}}>{label}</Text>
      <Text
        style={{
          color: '#3b82f6',
        }}>
        {value}
      </Text>
    </View>
  );

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

      <FlatList
        style={{paddingVertical: 15, paddingBottom: 30}}
        data={originalData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(item.id);
              setIsOpen(true);
            }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.title}>{item.payment_method}</Text>
                <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                  {formatDate(item.acc_date)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: '#3b82f6'}}>{item.payment_mode}</Text>
                <Text style={{color: '#3b82f6'}}>{item.acc_paid_amount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      <Modal isVisible={isOpen}>
        <View style={[styles.cards, {overflow: 'hidden'}]}>
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

          {selectedTransaction && (
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#3b82f6',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              {
                originalData.find(item => item.id === selectedTransaction)
                  ?.payment_method
              }
            </Text>
          )}

          <FlatList
            data={originalData.filter(
              entry => entry.id === selectedTransaction,
            )}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  marginLeft: '15%',
                  marginRight: '15%',
                  marginTop: 5,
                }}>
                <EntryRow label="Payable:" value={item.acc_payable_amount} />
                <EntryRow
                  label="Inventory:"
                  value={item.stationary_paid_amount ?? 0}
                />
                <EntryRow label="Arrears:" value={item.arrears_amount} />
                <EntryRow label="Balance:" value={item.acc_balance} />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(null);
              setIsOpen(false);
            }}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginBottom: 15,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default TeacherAccount;

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
    height: 180,
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
