import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../Ctx/UserContext';

const Std_Notification = ({navigation}: any) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {token} = useUser();

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/navbarmessage',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setNotifications(response.data.message);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Render each notification item
  const renderNotificationItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => {
        setSelectedNotification(item);
        setModalVisible(true);
      }}>
      <Text style={styles.notificationTitle}>{item.msg_subject}</Text>
      <Text style={styles.notificationDate}>{item.msg_date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <TouchableOpacity
          style={{padding: 8}}
          onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={28}
            color={'#000'}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Notification</Text>
      </View>

      {/* List of Notifications */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal to Display Notification Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.titleCtr}>
              <Text style={styles.modalTitle}>Message</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={20} color={'#000'} />
              </TouchableOpacity>
            </View>

            {/* Notification Content */}
            <View style={styles.notificationContentContainer}>
              {/* Subject Row */}
              <View style={styles.row}>
                <Text style={styles.boldTxt}>Subject</Text>
                <Text style={styles.dataTxt}>
                  {selectedNotification?.msg_subject}
                </Text>
              </View>

              {/* Message Row */}
              <View style={styles.row}>
                <Text style={styles.boldTxt}>Message</Text>
                <Text style={styles.dataTxt}>
                  {selectedNotification?.msg_message}
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Std_Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  notificationDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  titleCtr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  notificationContentContainer: {
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  boldTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1, // Takes 50% of the row
  },
  dataTxt: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1, // Takes 50% of the row
    marginLeft: 8, // Adds spacing between label and data
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
