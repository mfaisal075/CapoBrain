import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ParentAnnouncement = ({navigation}: any) => {
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
        <View style={styles.updates}>
          <View style={styles.updateHeader}>
            <Image
              style={styles.updateIcon}
              source={require('../../assets/iconupdate.png')}
            />
            <Text style={styles.heading}>Science & Technology Fair</Text>
          </View>
          <Text style={styles.Text}>
            Join us for {'School Name'}'s Annual Science & Technology Fair on{' '}
            {'Date'} to witness exciting student innovations!
          </Text>
        </View>

        <View style={styles.updates}>
          <View style={styles.updateHeader}>
            <Image
              style={styles.updateIcon}
              source={require('../../assets/iconupdate.png')}
            />
            <Text style={styles.heading}>Iqbal Day</Text>
          </View>

          <Text style={styles.Text}>Description</Text>
          <Text style={styles.Text}>09-Nov-2025</Text>
        </View>

        <View style={styles.updates}>
          <View style={styles.updateHeader}>
            <Image
              style={styles.updateIcon}
              source={require('../../assets/iconupdate.png')}
            />
            <Text style={styles.heading}>Quaid Day</Text>
          </View>

          <Text style={styles.Text}>Description</Text>
          <Text style={styles.Text}>25-Dec-2025</Text>
        </View>
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
  updates: {
    width: wp('90%'),
    alignSelf: 'center',
    padding: 5,
    marginTop: hp('1%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
    marginRight: 5,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3b82f6',
  },
  Text: {
    fontSize: 16,
  },
});
