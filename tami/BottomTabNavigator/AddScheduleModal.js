'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 색상 값 로컬스토리지에 저장할거임
import { X, Check, Calendar as CalendarIcon } from 'lucide-react-native'; // 이거 뭐 이미지라는데 잘 모르겠음 일단 쓸게 고맙다 ai야 ㅋㅋ
import DateTimePicker from '@react-native-community/datetimepicker';

const box = require('../assets/Images/Calendar/box.png');
const edit = require('../assets/Images/Calendar/Edit.png');

const COLOR_PALETTE = [
  '#FFB1B2',
  '#FFBFA8',
  '#FFEE8C',
  '#D7FFE9',
  '#A5FBFF',
  '#409EFF',
  '#C9B1FF',
];

const AddScheduleModal = ({ navigation, route }) => {
  // 이거 ai 썼는데도 ㅅㅂ 안돼ㅐㅐㅐㅐㅐㅐ
  const initialDate =
    route.params?.initialDate || new Date().toISOString().split('T')[0];

  const [scheduleText, setScheduleText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        console.log('★★★ AsyncStorage에서 가져온 userInfo:', userInfoString); // 디버깅

        if (userInfoString) {
          const parsedUserInfo = JSON.parse(userInfoString);
          console.log('★★★ 파싱된 userInfo:', parsedUserInfo); // 디버깅
          console.log('★★★ userInfo.id 값:', parsedUserInfo.id); // 디버깅
          setUserInfo(parsedUserInfo);
        } else {
          Alert.alert('오류', '로그인 정보가 없습니다. 다시 로그인해주세요.', [
            { text: '확인', onPress: () => navigation.navigate('Login') },
          ]);
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
        Alert.alert('오류', '사용자 정보를 불러오는데 실패했습니다.');
      }
    };
    getUserInfo();
  }, []);

  const formatDate = date => date.toISOString().split('T')[0];

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const saveScheduleColor = async (scheduleId, color, date, content) => {
    try {
      const existingColors = await AsyncStorage.getItem('scheduleColors');
      const colorData = existingColors ? JSON.parse(existingColors) : {};

      colorData[scheduleId] = {
        color: color,
        date: date,
        content: content,
      };

      await AsyncStorage.setItem('scheduleColors', JSON.stringify(colorData));
    } catch (error) {
      console.error('색상 저장 오류:', error);
    }
  };

  const handleAddSchedule = async () => {
    if (!userInfo) {
      Alert.alert('오류', '사용자 정보가 없습니다.');
      return;
    }

    // ★★★ userId 값 검증 추가 ★★★
    if (!userInfo.id) {
      Alert.alert('오류', '사용자 ID가 없습니다. 다시 로그인해주세요.');
      console.error('★★★ userInfo.id가 없음:', userInfo);
      return;
    }

    if (!scheduleText.trim()) {
      Alert.alert('입력 오류', '일정 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = {
        userId: userInfo.id, // 또는 userInfo.loginId를 시도해볼 수도 있음
        date: formatDate(selectedDate),
        content: scheduleText,
      };

      // ★★★ 서버로 보내는 데이터 확인 ★★★
      console.log(
        '★★★ 서버로 보내는 데이터:',
        JSON.stringify(requestBody, null, 2),
      );

      const response = await fetch('http://10.0.2.2:8082/user/addSchedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log('★★★ 서버 응답 상태:', response.status);
      console.log('★★★ 서버 응답 텍스트:', responseText);

      if (!responseText || !responseText.startsWith('{')) {
        Alert.alert(
          '서버 오류',
          `서버에서 올바르지 않은 응답을 받았습니다: ${responseText.substring(
            0,
            100,
          )}`,
        );
        return;
      }

      const result = JSON.parse(responseText);

      if (response.ok && result.success) {
        // 서버에서 반환된 일정 ID를 사용해 색상 정보를 로컬에 저장
        if (result.scheduleId || result.id) {
          const scheduleId = result.scheduleId || result.id;
          await saveScheduleColor(
            scheduleId,
            selectedColor,
            formatDate(selectedDate),
            scheduleText,
          );
        }

        Alert.alert('성공', '일정이 추가되었습니다.');
        navigation.goBack();
      } else {
        Alert.alert('오류', result.message || '일정 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Add Schedule Error:', error);
      Alert.alert('네트워크 오류', '서버 연결에 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Pressable style={styles.modalBackdrop} onPress={() => navigation.goBack()}>
      <Pressable
        style={styles.modalContainer}
        onPress={e => e.stopPropagation()}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <X size={28} color="#222B45" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>일정</Text>
            <TouchableOpacity
              onPress={handleAddSchedule}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <Check size={28} color="#222B45" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Image source={box} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="일정을 입력하세요."
                value={scheduleText}
                onChangeText={setScheduleText}
              />
            </View>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <CalendarIcon
                size={20}
                color="#8F9BB3"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Image source={edit} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>색상</Text>
              </View>
              <View style={styles.colorPalette}>
                {COLOR_PALETTE.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorSwatch, { backgroundColor: color }]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Check size={18} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F4',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222B45' },
  content: { paddingTop: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  input: { flex: 1, fontSize: 16 },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
  },
  dateText: { fontSize: 16, color: '#222B45' },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#585A66',
    marginRight: 8,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddScheduleModal;
