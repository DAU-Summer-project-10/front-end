import { View, Text, TouchableOpacity } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import FirstLoginScreen from "./screens/firstLogin/firstLogin"
import LoginScreen from "./screens/login/login"
import BottomTabNavigator from "./BottomTabNavigator/BottomTabNavigator"

const Stack = createNativeStackNavigator()

// 모달 화면 예시 (실제로는 별도 파일로 분리해야 합니다)
const AddChecklistScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: 24, fontWeight: "bold" }}>체크리스트 추가 화면</Text>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
      <Text style={{ color: "blue", fontSize: 18 }}>닫기</Text>
    </TouchableOpacity>
  </View>
)

const App = () => {
  return (
    <NavigationContainer>
      {/* Root 스택 내비게이터 */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 기본 화면 그룹 */}
        <Stack.Group>
          <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Group>

        {/* 모달 화면 그룹 */}
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="AddChecklist" component={AddChecklistScreen} />
          {/* <Stack.Screen name="AddSchedule" component={AddScheduleScreen} /> */}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
