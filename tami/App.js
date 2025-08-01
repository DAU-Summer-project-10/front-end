import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator/BottomTabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}