import {
  Alert,
  Animated,
  BackHandler,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useUser} from '../Ctx/UserContext';
import {FlatList} from 'react-native';
import {TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';

interface DownloadData {
  id: number;
  cls_name: string;
  sec_name: string;
  file_date: string;
  file_title: string;
  file_notes: string;
}

const Download = ({navigation}: any) => {
  const {token} = useUser();
  const [downloadData, setDownloadData] = useState<DownloadData[]>([]);

  const downloadFile = async (url: any) => {
    try {
      const fileName = url.split('/').pop();
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
      };

      const download = RNFS.downloadFile(options);

      download.promise.then(response => {
        if (response.statusCode === 200) {
          Alert.alert('Success', `File downloaded to ${downloadDest}`);
        } else {
          Alert.alert('Error', 'Failed to download file');
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'An error occurred while downloading the file');
    }
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/files_fetchstdfiles?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setDownloadData(response.data.files);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      throw new Error('User is not authenticated');
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
      navigation.navigate('Home');
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
        <Text style={styles.headerText}>Download Material</Text>
      </View>
      <FlatList
        data={downloadData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() =>
                  downloadFile(
                    `https://demo.capobrain.com/files_download/${item.file_notes}`,
                  )
                }>
                <Image
                  style={styles.actionIcon}
                  source={require('../assets/dpd.png')}
                />
              </TouchableOpacity>

              <Text style={styles.title}>{item.file_title}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {item.file_date}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Download;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    top: 5,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '1%',
    borderWidth: 1,
    borderColor: '#3b82f6',
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
