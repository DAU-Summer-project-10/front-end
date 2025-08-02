"use client"

import { useEffect, useState } from 'react';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/login/login';
import BottomTabNavigator from './BottomTabNavigator/BottomTabNavigator';
import FirstLoginScreen from './screens/firstLogin/firstLogin';

const Stack = createNativeStackNavigator();

const App = () => {
  // --- 상태 변수들 ---
  // isFirstLaunch: 첫 실행인지 아닌지를 저장할 변수 (null은 아직 확인 전이라는 의미)
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)

  // --- 앱이 처음 켜질 때 딱 한 번만 실행되는 로직 ---
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // AsyncStorage에서 'hasLaunched' 값을 가져옵니다.
        const hasLaunched = await AsyncStorage.getItem("hasLaunched")
        if (hasLaunched === null) {
          // 값이 null이면, 한 번도 실행된 적 없는 첫 실행입니다.
          setIsFirstLaunch(true)
        } else {
          // 값이 있으면, 이미 실행된 적이 있는 것입니다.
          setIsFirstLaunch(false)
        }
      } catch (error) {
        console.error("AsyncStorage 에러:", error)
        // 에러 발생 시 일단 첫 실행이 아닌 것으로 간주
        setIsFirstLaunch(false)
      }
    }

    checkFirstLaunch()
  }, []) // []가 비어있으면, 컴포넌트가 처음 마운트될 때 딱 한 번만 실행됩니다.

  // --- isFirstLaunch 상태에 따라 다른 화면을 보여주기 ---
  // 아직 확인 중(isFirstLaunch가 null)일 때는 로딩 화면을 보여줍니다.
  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* isFirstLaunch 값에 따라 시작 화면을 동적으로 결정합니다. */}
        {isFirstLaunch ? (
          // 첫 실행이면 FirstLogin을 스택에 추가하고 시작 화면으로 설정
          <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
        ) : null}
        {/* 로그인 화면과 메인 화면은 항상 스택에 포함됩니다. */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;