import React from 'react';
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
} from 'react-native';

// 새로 제공된 SNS 로고 이미지들을 불러옵니다.
const kakaoLogo = require('./assets/Images/kakaoLogo.png');
const naverLogo = require('./assets/Images/naverLogo.png');
const facebookLogo = require('./assets/Images/facebookLogo.png');
const googleLogo = require('./assets/Images/googleLogo.png');
const appleLogo = require('./assets/Images/appleLogo.png');

const LoginScreen = () => {
    return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
        {/* ScrollView를 추가하여 작은 화면에서도 모든 콘텐츠가 보이도록 합니다. */}
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
          {/* 상단 영역: 뒤로가기 버튼과 환영 메시지 */}
                <View>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backButtonText}>{'<'}</Text>
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                안녕하세요 :){'\n'}
                            <Text style={styles.highlight}>타미</Text>입니다.
                        </Text>
                        <Text style={styles.subtitle}>저와 함께 낭비없는 스케줄을 만들어봐요!</Text>
                    </View>
                </View>

          {/* 중간 영역: 로그인 폼과 링크 */}
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder="아이디 입력" placeholderTextColor="#A5A5A5"/>
                        <TextInput style={styles.input} placeholder="비밀번호 입력" placeholderTextColor="#A5A5A5" secureTextEntry/>
                        <TouchableOpacity style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>로그인</Text>
                        </TouchableOpacity>
                    </View>
                    

                    <View style={styles.linksContainer}>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>아이디 찾기</Text>
                        </TouchableOpacity>
                        <View style={styles.separator}/>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>비밀번호 찾기</Text>
                        </TouchableOpacity>
                        <View style={styles.separator}/>
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
                    <TouchableOpacity style={styles.socialLogoWrapper}>
                        <Image source={kakaoLogo} style={styles.socialLogo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialLogoWrapper}>
                        <Image source={naverLogo} style={styles.socialLogo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialLogoWrapper}>
                        <Image source={facebookLogo} style={styles.socialLogo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialLogoWrapper}>
                        <Image source={googleLogo} style={styles.socialLogo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialLogoWrapper}>
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
    justifyContent: 'space-between', // 콘텐츠를 위, 중간, 아래로 분산
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
  // '안녕하세요' 문구를 감싸는 컨테이너에 y축 간격(marginTop)을 적용합니다.
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
    alignItems: 'center'
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
    fontFamily: 'Pretendard-Bold'
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
  // SNS 로그인 컨테이너에 y축 간격(marginTop)을 적용합니다.
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
  // 모든 로고가 동일한 스타일을 사용하도록 통일합니다.
  socialLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default LoginScreen;