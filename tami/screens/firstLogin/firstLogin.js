import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const tamiImage = require('../../assets/Images/tami.png');
const ellipseImage = require('../../assets/Images/Ellipse138.png');

const FirstLoginScreen = ({ navigation }) => {
  const handleStart = async () => {
    try {
      // 1. AsyncStorage에 'hasLaunched'라는 키로 'true' 값을 저장합니다.
      await AsyncStorage.setItem('hasLaunched', 'true');
      // 2. 'Login' 화면으로 이동합니다. (replace를 사용해 뒤로가기 방지) 그렇대요 navigate 함부로 쓰지 마셈 ㅋ
      navigation.replace('Login');
    } catch (error) {
      console.error('AsyncStorage 에러:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* 상단 텍스트와 캐릭터 이미지를 포함하는 콘텐츠 영역 */}
        <View style={styles.content}>
          <Text style={styles.title}>
            반가워요! 오늘부터{'\n'}낭비없는 스케쥴 계획을 도와줄{'\n'}
            <Text style={styles.highlight}>타미</Text> 에요!
          </Text>
          <Text style={styles.subtitle}>
            저와 함께 낭비없는 스케쥴을 만들어봐요!
          </Text>

          {/* 캐릭터 이미지와 그림자를 포함하는 컨테이너 */}
          <View style={styles.imageContainer}>
            <Image source={ellipseImage} style={styles.ellipse} />
            <Image source={tamiImage} style={styles.character} />
          </View>
        </View>

        {/* 하단 '시작하기' 버튼 */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>시작하기!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f7fe',
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30, // 하단 여백
  },

  content: {
    alignItems: 'center',
    paddingTop: height * 0.1, // 화면 상단에서 약간의 여백
  },

  title: {
    fontSize: 28,
    color: '#222b45',
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'Pretendard-Bold',
  },

  highlight: {
    color: '#addeff',
    fontFamily: 'Pretendard-Bold',
  },

  subtitle: {
    fontSize: 16,
    color: '#a6a6a6',
    textAlign: 'center',
    marginTop: 27,
    fontFamily: 'Pretendard-Regular',
  },

  imageContainer: {
    marginTop: 97,
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  character: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  ellipse: {
    position: 'absolute',
    bottom: 20,
    width: '110%',
    height: 60,
    // resizeMode: 'contain',
    // opacity: 1,
    // zIndex: 1
  },

  button: {
    width: '100%',
    backgroundColor: '#addeff',
    paddingVertical: 18,
    borderRadius: 30, // 둥근 모서리
    alignItems: 'center',
    justifyContent: 'center',
    // // 그림자 효과 (iOS)
    // shadowColor: '#000',
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // // 그림자 효과 (Android)
    // elevation: 5,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Pretendard-Regular',
  },
});

export default FirstLoginScreen;
