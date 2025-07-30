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

// 화면 크기를 가져옵니다.
const { width, height } = Dimensions.get('window');

// 이미지 파일을 불러옵니다.
const tamiImage = require('./assets/Images/tami.png');
const ellipseImage = require('./assets/Images/Ellipse138.png');

const FirstLoginScreen = () => {
    return (
    // SafeAreaView는 노치나 하단 바 등 시스템 UI를 피해서 콘텐츠를 표시합니다.
        <SafeAreaView style={styles.safeArea}>
      {/* 상태 표시줄의 아이콘 색상을 어둡게 설정합니다. */}
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
        {/* 상단 텍스트와 캐릭터 이미지를 포함하는 콘텐츠 영역 */}
                <View style={styles.content}>
          {/* 환영 메시지 제목 */}
                    <Text style={styles.title}>
                        반가워요! 오늘부터{'\n'}낭비없는 스케쥴 계획을 도와줄{'\n'}
            {/* '타미' 부분에만 다른 스타일을 적용합니다. */}
                        <Text style={styles.highlight}>타미</Text> 에요!
                    </Text>
          {/* 부제목 */}
                    <Text style={styles.subtitle}>저와 함께 낭비없는 스케쥴을 만들어봐요!</Text>

          {/* 캐릭터 이미지와 그림자를 포함하는 컨테이너 */}
                    <View style={styles.imageContainer}>
            {/* 그림자 효과를 위한 타원 이미지 */}
                        <Image source={ellipseImage} style={styles.ellipse}/>
            {/* 메인 캐릭터 이미지 */}
                        <Image source={tamiImage} style={styles.character}/>
                    </View>
                </View>

        {/* 하단 '시작하기' 버튼 */}
                <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>시작하기!</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#f2f7fe', // Figma 배경색
    },

    container: {
    flex: 1,
    justifyContent: 'space-between', // 콘텐츠를 위, 아래로 분산 배치
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
    color: '#222b45', // Figma 제목 텍스트 색상
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'Pretendard-Bold'
    },

    highlight: {
    color: '#addeff', // Figma 강조 색상
    fontFamily: 'Pretendard-Bold'
    },

    subtitle: {
    fontSize: 16,
    color: '#a6a6a6', // Figma 부제목 텍스트 색상
    textAlign: 'center',
    marginTop: 27,
    fontFamily: 'Pretendard-Regular'
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
    backgroundColor: '#addeff', // Figma 버튼 배경색
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
    color: '#ffffff', // Figma 버튼 텍스트 색상
    fontSize: 18,
    fontFamily: 'Pretendard-Regular'
    },
});

export default FirstLoginScreen;