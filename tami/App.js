import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 화면 컴포넌트들ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ
import FirstLoginScreen from './screens/firstLogin/firstLogin';
import LoginScreen from './screens/login/login';
import MainTabNavigator from './BottomTabNavigator/BottomTabNavigator';
import AddScheduleModal from './BottomTabNavigator/AddScheduleModal';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 기본 화면 그룹 */}
        <Stack.Group>
          <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Group>

        {/* 모달 화면 그룹: 아래에서 위로 올라오는 화면들ㅇㅇㅇㅇㅇ */}
        <Stack.Group
          screenOptions={{
            presentation: 'transparentModal', // 배경이 투명하게 하는거
            animation: 'slide_from_bottom', // 아래에서 위로 올라오는거임
          }}
        >
          <Stack.Screen name="AddSchedule" component={AddScheduleModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
