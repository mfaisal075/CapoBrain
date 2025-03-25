import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
  Animated,
  ImageBackground,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ViewMode = 'month' | 'week' | 'day' | 'year';

const TeacherCalendar = ({navigation}: any) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const currentYear = new Date().getFullYear();

  const getWeekDates = (date: string) => {
    const selected = new Date(date);
    const weekDates: {
      [key: string]: {selected: boolean; selectedColor: string};
    } = {};
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(selected);
      newDate.setDate(selected.getDate() - selected.getDay() + i);
      const dateString = newDate.toISOString().split('T')[0];
      weekDates[dateString] = {
        selected: true,
        selectedColor: i === selected.getDay() ? '#3b82f6' : '#3b82f6',
      };
    }
    return weekDates;
  };

  const markedDates =
    viewMode === 'week'
      ? getWeekDates(selectedDate)
      : {[selectedDate]: {selected: true, selectedColor: '#3b82f6'}};

  const renderYearView = () => (
    <ScrollView contentContainerStyle={styles.yearContainer}>
      {Array.from({length: 12}).map((_, index) => {
        const monthDate = `${currentYear}-${(index + 1)
          .toString()
          .padStart(2, '0')}-01`;
        return (
          <View key={index} style={styles.monthContainer}>
            <Text style={styles.monthText}>
              {new Date(currentYear, index, 1).toLocaleString('default', {
                month: 'long',
              })}
            </Text>
            <Calendar
              current={monthDate}
              hideExtraDays
              disableMonthChange
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
                setViewMode('month');
              }}
              markedDates={markedDates}
              theme={{
                todayTextColor: 'red',
                arrowColor: '#3b82f6',
                textDayFontSize: 12,
                textMonthFontSize: 14,
                textDayHeaderFontSize: 12,
              }}
              style={styles.miniCalendar}
            />
          </View>
        );
      })}
    </ScrollView>
  );

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
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={38}
              color={'#fff'}
              style={{paddingHorizontal: 10, paddingTop: 20}}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Calendar Events</Text>
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setSelectedDate(new Date().toISOString().split('T')[0])
            }>
            <Text style={styles.buttonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setViewMode('year')}>
            <Text style={styles.buttonText}>Year</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setViewMode('month')}>
            <Text style={styles.buttonText}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setViewMode('week')}>
            <Text style={styles.buttonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setViewMode('day')}>
            <Text style={styles.buttonText}>Day</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        {viewMode === 'year' ? (
          renderYearView()
        ) : viewMode === 'day' ? (
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>Selected Date: {selectedDate}</Text>
          </View>
        ) : (
          <Calendar
            current={selectedDate}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            markingType={'custom'}
            theme={{
              todayTextColor: 'red',
              arrowColor: 'black',
            }}
            style={styles.mainCalendar}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default TeacherCalendar;

const styles = StyleSheet.create({
  header: {
    width: wp('100%'),
    height: hp('25%'),
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: hp('2%'),
    paddingLeft: 15,
  },
  backButton: {
    width: 20,
    height: 20,
    tintColor: 'white',
    marginRight: 10,
    marginTop: hp('2%'),
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    marginTop: hp('1.5%'),
    textAlign: 'center',
    flex: 1,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    marginTop: hp('4%'),
    left: -5,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  mainCalendar: {
    width: wp('80%'),
    height: 380,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  yearContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  monthText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  miniCalendar: {
    width: '100%',
    height: 'auto',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3b82f6',
    padding: 5,
  },
  monthContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
