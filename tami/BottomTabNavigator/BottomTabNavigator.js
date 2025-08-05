import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const chartIcon = require('../assets/Images/Navigator/Chart.png');
const calendarIcon = require('../assets/Images/Navigator/Calendar.png');
const homeIcon = require('../assets/Images/Navigator/Home.png');
const usersIcon = require('../assets/Images/Navigator/Users.png');
const bagIcon = require('../assets/Images/Navigator/Bag.png');
const tabBarBackground = require('../assets/Images/Navigator/Rectangle.png');

import test1Screen from './test1';
import test3Screen from './test3';
import test4Screen from './test4';
import test5Screen from './test5';
import CalendarScreen from './CalendarScreen';

const Tab = createBottomTabNavigator();

// 커스텀 탭 바 컴포넌트 --- 어 뭔지 이해하려고 해도 모르겠다 수고염 ㅋㅋ
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <ImageBackground
        source={tabBarBackground}
        style={styles.tabBarBackground}
      >
        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconSource;
            if (route.name === 'Chart') iconSource = chartIcon;
            else if (route.name === 'Calendar') iconSource = calendarIcon;
            else if (route.name === 'Home') iconSource = homeIcon;
            else if (route.name === 'Users') iconSource = usersIcon;
            else if (route.name === 'Bag') iconSource = bagIcon;

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.tabButton} // 모든 버튼에 동일한 tabButton 스타일 적용
              >
                {/* 홈 버튼일 경우 특별한 스타일을 적용할 View를 추가 */}
                <View
                  style={
                    route.name === 'Home' ? styles.homeButtonWrapper : null
                  }
                >
                  <Image
                    source={iconSource}
                    style={[
                      // 홈 버튼과 일반 아이콘의 크기를 다르게 설정
                      route.name === 'Home' ? styles.homeIcon : styles.tabIcon,
                      // 선택된 탭은 선명하게, 홈 버튼은 항상 선명하게
                      { opacity: isFocused || route.name === 'Home' ? 1 : 0.5 },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
          ;
        </View>
      </ImageBackground>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      // 기본 탭 바 대신 커스텀 탭 바를 사용
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }} // 각 화면의 헤더는 숨김
      initialRouteName="Home" // 메인을 홈탭으로 설정..
    >
      <Tab.Screen name="Chart" component={test1Screen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Home" component={test3Screen} />
      <Tab.Screen name="Users" component={test4Screen} />
      <Tab.Screen name="Bag" component={test5Screen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 100,
    elevation: 5,
  },
  tabBarBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  tabBarContent: {
    flexDirection: 'row',
    height: '100%',
    // justifyContent를 space-around로 유지하여 각 버튼이 차지한 공간 내에서 아이콘이 중앙에 오도록 함
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  homeButtonWrapper: {
    // 홈 버튼을 다른 버튼들보다 위로, 크게 만듭니다.
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 35, // 위로 띄우는 효과
  },
  homeIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default BottomTabNavigator;
