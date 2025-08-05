'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2 } from 'lucide-react-native';

// 이미지 파일들
const leftArrowImage = require('../assets/Images/Calendar/leftArrow.png');
const rightArrowImage = require('../assets/Images/Calendar/rightArrow.png');
const addLogoImage = require('../assets/Images/Calendar/addLogo.png');
const lineImage = require('../assets/Images/Calendar/line.png');

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [schedules, setSchedules] = useState([]);
  const [scheduleColors, setScheduleColors] = useState({}); // 색상 정보 저장
  const [isLoading, setIsLoading] = useState(true);

  // 로컬에 저장된 색상 정보를 불러오는 함수
  const loadScheduleColors = async () => {
    try {
      const colorData = await AsyncStorage.getItem('scheduleColors');
      if (colorData) {
        setScheduleColors(JSON.parse(colorData));
      }
    } catch (error) {
      console.error('색상 정보 로드 오류:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (!userInfoString) {
        navigation.navigate('Login');
        return;
      }
      const userInfo = JSON.parse(userInfoString);

      const response = await fetch(
        `http://10.0.2.2:8082/user/getAllUserInfo/${userInfo.id}`,
      );
      const data = await response.json();
      setSchedules(data.schedules || []);

      // 색상 정보도 함께 로드
      await loadScheduleColors();
    } catch (error) {
      Alert.alert('오류', '일정 정보를 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = scheduleId => {
    Alert.alert('일정 삭제', '정말로 이 일정을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: async () => {
          try {
            const response = await fetch(
              `http://10.0.2.2:8082/user/deleteSchedule/${scheduleId}`,
              {
                method: 'DELETE',
              },
            );
            if (response.ok) {
              const updatedColors = { ...scheduleColors };
              delete updatedColors[scheduleId];
              setScheduleColors(updatedColors);
              await AsyncStorage.setItem(
                'scheduleColors',
                JSON.stringify(updatedColors),
              );

              Alert.alert('성공', '일정이 삭제되었습니다.');
              fetchSchedules();
            } else {
              Alert.alert('오류', '일정 삭제에 실패했습니다.');
            }
          } catch (error) {
            Alert.alert('오류', '네트워크 또는 서버에 문제가 발생했습니다.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchSchedules();
    }, []),
  );

  // ★★★ 로컬 색상 정보를 사용해서 캘린더 점 표시 ★★★
  const markedDates = useMemo(() => {
    const dotsByDate = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.date]) acc[schedule.date] = { dots: [] };

      // 로컬에 저장된 색상 정보가 있으면 사용, 없으면 기본 색상
      const color = scheduleColors[schedule.id]?.color || '#409EFF';
      acc[schedule.date].dots.push({ color: color, key: schedule.id });
      return acc;
    }, {});

    if (selectedDate) {
      dotsByDate[selectedDate] = {
        ...dotsByDate[selectedDate],
        selected: true,
        selectedColor: '#0080FF',
        selectedTextColor: '#FFFFFF',
      };
    }
    return dotsByDate;
  }, [schedules, scheduleColors, selectedDate]);

  const selectedDateSchedules = useMemo(
    () => schedules.filter(s => s.date === selectedDate),
    [schedules, selectedDate],
  );

  const renderCustomHeader = date => {
    const month = date.toString('MMMM');
    const year = date.toString('yyyy');
    return (
      <View style={styles.customHeaderContainer}>
        <Text style={styles.headerYear}>{year}</Text>
        <Text style={styles.headerMonth}>{month}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>캘린더</Text>
      </View>

      <Calendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={day => setSelectedDate(day.dateString)}
        renderHeader={renderCustomHeader}
        renderArrow={direction => (
          <TouchableOpacity style={styles.arrowContainer}>
            <Image
              source={direction === 'left' ? leftArrowImage : rightArrowImage}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
        )}
        monthFormat={'yyyy MMMM'}
        theme={{
          backgroundColor: '#F2F7FE',
          calendarBackground: '#F2F7FE',
          textSectionTitleColor: '#8F9BB3',
          textDayFontFamily: 'Pretendard-Regular',
          todayTextColor: '#0080FF',
          dayTextColor: '#222B45',
          textDisabledColor: '#CED3DE',
          selectedDayTextColor: '#FFFFFF',
          selectedDayBackgroundColor: '#0080FF',
          'stylesheet.day.basic': {
            selected: {
              backgroundColor: '#0080FF',
              borderRadius: 8,
            },
          },
        }}
        style={styles.calendar}
      />

      <View style={styles.dividerContainer}>
        <Image source={lineImage} style={styles.dividerLine} />
      </View>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('AddSchedule', { initialDate: selectedDate })
            }
          >
            <Text style={styles.addButtonText}>추가하기</Text>
            <Image source={addLogoImage} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={selectedDateSchedules}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.scheduleItem}>
                <View
                  style={[
                    styles.scheduleColorBar,
                    {
                      backgroundColor:
                        scheduleColors[item.id]?.color || '#409EFF',
                    },
                  ]}
                />
                <View style={styles.scheduleContentContainer}>
                  <Text style={styles.scheduleContent}>{item.content}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSchedule(item.id)}
                >
                  <Trash2 size={20} color="#FF3D71" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>등록된 일정이 없습니다.</Text>
            }
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F7FE',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#222B45',
  },
  calendar: {
    marginHorizontal: 10,
  },
  customHeaderContainer: {
    alignItems: 'center',
    padding: 10,
  },
  headerYear: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#8F9BB3',
  },
  headerMonth: {
    fontSize: 32,
    fontFamily: 'Pretendard-Bold',
    color: '#222B45',
    marginTop: 2,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  dividerContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    width: '10%',
    height: 2,
    resizeMode: 'stretch',
    get resizeMode() {
      return this._resizeMode;
    },
    set resizeMode(value) {
      this._resizeMode = value;
    },
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F2F7FE',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222B45',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addButtonText: {
    color: 'black',
    fontFamily: 'Pretendard-Bold',
  },
  addIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  scheduleColorBar: {
    width: 8,
    height: '100%',
  },
  scheduleContentContainer: {
    flex: 1,
    padding: 20,
  },
  scheduleContent: {
    fontSize: 16,
    color: '#222B45',
  },
  deleteButton: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    marginTop: 30,
    color: '#8F9BB3',
  },
});

export default CalendarScreen;
