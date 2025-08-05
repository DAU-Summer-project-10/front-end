'use client';

import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SNS 로고 이미지들
const kakaoLogo = require('../../assets/Images/kakaoLogo.png');
const naverLogo = require('../../assets/Images/naverLogo.png');
const facebookLogo = require('../../assets/Images/facebookLogo.png');
const googleLogo = require('../../assets/Images/googleLogo.png');
const appleLogo = require('../../assets/Images/appleLogo.png');

const developmentAlert = () => {
  Alert.alert('SNS 계정으로 로그인', '개발 중 입니다!', [
    { text: '확인', onPress: () => console.log('SNS알림 - 확인 버튼 누름') },
  ]);
};

const LoginScreen = ({ navigation }) => {
  // 하 진짜 자살마렵네 걍 Tlqkf!!!!!!!!!!

  const [userId, setUserId] = useState(''); // 아이디 입력값을 기억
  const [password, setPassword] = useState(''); // 비밀번호 입력값을 기억
  const [loading, setLoading] = useState(false); // 로딩 중인지 아닌지 기억

  //로그인 버튼을 눌렀을 때 실행될거
  const handleLogin = async () => {
    // handleLogin 함수 맨 앞에 추가 임시 mock 용이라는데 모르겟음 일단 해
    if (userId === 'admin' && password === 'admin') {
      const mockUserInfo = {
        id: 1,
        loginId: 'admin',
        name: '관리자',
        originalData: { id: 1, loginId: 'admin', name: '관리자' },
      };

      await AsyncStorage.setItem('userInfo', JSON.stringify(mockUserInfo));
      Alert.alert('로그인 성공 (임시)', `${mockUserInfo.name}님 환영합니다!`);
      navigation.replace('Main');
      return;
    }
    // ★★★ 함수 시작 확인 ★★★
    console.log('★★★ handleLogin 함수 시작!');
    Alert.alert('디버그', 'handleLogin 함수가 시작되었습니다!');

    // 입력값 검사
    if (!userId || !password) {
      console.log('★★★ 입력값 없음 - userId:', userId, 'password:', password);
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log(
      '★★★ 입력값 확인 완료 - userId:',
      userId,
      'password:',
      password,
    );
    console.log('★★★ 비밀번호 길이:', password.length);
    setLoading(true); // "지금 로딩 중!"으로 상태 변경

    try {
      console.log('★★★ 서버 요청 시작...');
      Alert.alert('디버그', '서버에 요청을 보냅니다...');

      console.log(
        '★★★ 서버로 보낼 데이터:',
        JSON.stringify(
          {
            id: userId,
            pw: password,
          },
          null,
          2,
        ),
      );

      // 서버에 "이 사람 회원 맞나요?"라고 물어보기 ---
      const response = await axios.post('http://10.0.2.2:8080/user/login', {
        id: userId,
        pw: password,
      });

      console.log('★★★ 서버 응답 받음! status:', response.status);
      Alert.alert('디버그', `서버 응답 상태: ${response.status}`);

      // 서버가 "성공!"이라고 답변했을 때 ---
      if (response.status === 200) {
        console.log('★★★ 로그인 성공!'); // 콘솔에 성공 메시지 출력

        // ★★★ 서버 응답 데이터 전체 구조 확인 ★★★
        const userData = response.data;
        console.log(
          '★★★ 서버에서 받은 전체 데이터:',
          JSON.stringify(userData, null, 2),
        );

        // ★★★ 응답이 문자열인지 확인 (에러 메시지인 경우) ★★★
        if (typeof userData === 'string') {
          console.log('★★★ 서버에서 에러 메시지를 받음:', userData);
          Alert.alert('로그인 실패', userData);
          return;
        }

        // ★★★ 응답이 객체인 경우 (성공) ★★★
        console.log('★★★ userData.id:', userData.id);
        console.log('★★★ userData.loginId:', userData.loginId);
        console.log('★★★ userData.userId:', userData.userId);
        console.log('★★★ userData.user:', userData.user);

        Alert.alert('디버그', `서버 데이터: ${JSON.stringify(userData)}`);

        // ★★★ 다양한 가능성을 고려한 사용자 정보 저장 ★★★
        const userInfo = {
          // 가능한 모든 ID 필드를 저장
          id: userData.id || userData.loginId || userData.userId || userId, // 입력한 userId라도 저장
          loginId: userData.loginId || userId,
          userId: userData.userId || userData.id,
          name: userData.name || userData.username || '사용자',
          // 원본 데이터도 함께 저장 (디버깅용)
          originalData: userData,
        };

        console.log(
          '★★★ AsyncStorage에 저장할 userInfo:',
          JSON.stringify(userInfo, null, 2),
        );

        // 사용자 정보를 AsyncStorage에 저장하기 ---
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('★★★ 사용자 정보 저장 완료!');

        // 로그인 성공 알림 후 메인 화면으로 이동
        Alert.alert('로그인 성공', `${userInfo.name}님 환영합니다!`);
        navigation.replace('Main');
      }
    } catch (error) {
      // 서버가 "실패!"라고 답변했을 때 ---
      console.log('★★★ 로그인 에러 발생!');
      console.error('★★★ 에러 상세:', error);
      console.log('★★★ 에러 메시지:', error.message);

      Alert.alert('디버그 - 에러 발생', `에러: ${error.message}`);
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      // --- 모든 과정이 끝나면 반드시 실행 ---
      console.log('★★★ handleLogin 함수 종료!');
      setLoading(false); // "로딩 끝!"으로 상태 변경
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('FirstLogin')}
            >
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                안녕하세요 :){'\n'}
                <Text style={styles.highlight}>타미</Text>입니다.
              </Text>
              <Text style={styles.subtitle}>
                저와 함께 낭비없는 스케줄을 만들어봐요!
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.inputContainer}>
              {/* 아이디 입력: 글자가 바뀔 때마다 'userId' 기억 상자의 내용을 업데이트 */}
              <TextInput
                style={styles.input}
                placeholder="아이디 입력"
                placeholderTextColor="#A5A5A5"
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="비밀번호 입력"
                placeholderTextColor="#A5A5A5"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {/*로그인 버튼 */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" /> // 로딩 아이콘
                ) : (
                  <Text style={styles.loginButtonText}>로그인</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.linksContainer}>
              <TouchableOpacity>
                <Text style={styles.linkText}>아이디 찾기</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity>
                <Text style={styles.linkText}>비밀번호 찾기</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity>
                <Text style={styles.linkText}>회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 하단 SNS 로그인 영역 */}
          <View style={styles.socialLoginContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>SNS 계정으로 로그인</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialLogosContainer}>
              <TouchableOpacity
                style={styles.socialLogoWrapper}
                onPress={developmentAlert}
              >
                <Image source={kakaoLogo} style={styles.socialLogo} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialLogoWrapper}
                onPress={developmentAlert}
              >
                <Image source={naverLogo} style={styles.socialLogo} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialLogoWrapper}
                onPress={developmentAlert}
              >
                <Image source={facebookLogo} style={styles.socialLogo} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialLogoWrapper}
                onPress={developmentAlert}
              >
                <Image source={googleLogo} style={styles.socialLogo} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialLogoWrapper}
                onPress={developmentAlert}
              >
                <Image source={appleLogo} style={styles.socialLogo} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F7FE',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222B45',
  },
  titleContainer: {
    marginTop: 62,
  },
  title: {
    fontSize: 28,
    // fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
    color: '#222B45',
    lineHeight: 40,
  },
  highlight: {
    color: '#0766FE',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#A6A6A6',
    marginTop: 5,
    marginBottom: 5,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 62,
    width: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ADDEFF',
  },
  loginButton: {
    height: 62,
    width: 380,
    backgroundColor: '#ADDEFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  linkText: {
    fontSize: 14,
    color: 'black',
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 16,
  },
  socialLoginContainer: {
    marginTop: 170,
    paddingBottom: 30,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#A5A5A5',
    fontSize: 12,
  },
  socialLogosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLogoWrapper: {
    marginHorizontal: 10,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default LoginScreen;
