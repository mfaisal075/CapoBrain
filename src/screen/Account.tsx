import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ImageBackground,
} from 'react-native';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

interface AccountData {
  cand: {
    cand_bform: string;
    cand_name: string;
    student_id: string;
    add: string;
  };
  cand_class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  parent: {
    par_fathername: string;
  };
  user: {
    role: string;
    email: string;
    contact: string;
    name: string;
  };
  student_account: {
    stuacc_balance: string;
    stuacc_paid_amount: string;
    inventory_amount: string;
    stuacc_payable: string;
  };
}

interface AccountInfo {
  id: number;
  transaction_id: string;
  stuacc_date: string;
  monthlyfee_receivable: string;
  transport_received: string;
  inventory_received: string;
  arrears_amount: string;
  miscfee_receivable: string;
  stuacc_payable: string;
  stuacc_paid_amount: string;
  stuacc_balance: string;
  stuacc_payment_method: string;
  stuacc_status: string;
  monthly_fee: string;
  transportation_fee: string;
  inventory_amount: string;
  voucher_id: string;
}

const Account = ({navigation}: any) => {
  const {token} = useUser();

  const [accoutData, setAccountData] = useState<AccountData | null>(null);

  const [originalData, setOriginalData] = useState<AccountInfo[]>([]);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/fetchstd_account?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOriginalData(response.data.accounts);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  const Info = [
    {key: 'Receivable', value: accoutData?.student_account.stuacc_payable},
    {key: 'Paid', value: accoutData?.student_account.stuacc_paid_amount},
    {key: 'Inventory', value: accoutData?.student_account.inventory_amount},
    {key: 'Balance', value: accoutData?.student_account.stuacc_balance},
  ];

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fetchData();
    fetchAccountData();

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

  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null,
  );

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
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10, paddingVertical: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Accounts</Text>
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
          style={{marginBottom: 20}}
          data={originalData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => setSelectedTransaction(item.id)}>
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>{item.transaction_id}</Text>
                  <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                    {formatDate(item.stuacc_date)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: '#3b82f6'}}>
                    {item.stuacc_payment_method}
                  </Text>
                  <Text style={{color: '#3b82f6'}}>{item.monthly_fee}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#3b82f6', fontWeight: 'bold'}}>
            No data found in the database!
          </Text>
        </View>
      )}

      <Modal isVisible={!!selectedTransaction}>
        <View style={[styles.cards, {overflow: 'hidden'}]}>
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
                  ?.transaction_id
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
                <EntryRow label="Transport:" value={item.transport_received} />
                <EntryRow label="Inventory:" value={item.inventory_amount} />
                <EntryRow label="Arrears:" value={item.arrears_amount} />
                <EntryRow label="Others:" value={item.miscfee_receivable} />
                <EntryRow label="Payable:" value={item.stuacc_payable} />
                <EntryRow label="Paid:" value={item.stuacc_paid_amount} />
                <EntryRow label="Balance:" value={item.stuacc_balance} />
              </View>
            )}
          />
          <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
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

export default Account;

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
