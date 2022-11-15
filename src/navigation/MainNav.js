import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ChatScreen from '../Screens/ChatScreen';
import DashboardScreen from '../Screens/DashboardScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';

const StackNav = createStackNavigator();

const MainNav = () => {
  return(
<NavigationContainer>
  <StackNav.Navigator screenOptions={{headerShown:false}}>
    <StackNav.Screen name="LoginScreen" component={LoginScreen} />
    <StackNav.Screen name="SignUpScreen" component={SignUpScreen} />
    <StackNav.Screen name="DashboardScreen" component={DashboardScreen} />
    <StackNav.Screen name="ChatScreen" component={ChatScreen} />
  </StackNav.Navigator>
</NavigationContainer>
  )
};

export default MainNav;
