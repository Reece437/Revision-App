import 'react-native-gesture-handler';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Main';
import Other from './screens/CreateCard';
import play from './screens/play';
import Settings from './screens/Settings';
import Login from './screens/Login';


const Stack = createNativeStackNavigator();


export default function App() {
  const [theme, setTheme] = useState("");
  
  return (
  	<View style={{flex: 1, backgroundColor: 'black'}}>
  		<NavigationContainer>
    		<Stack.Navigator screenOptions={{animationEnabled: false}}>
    			<Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
    			<Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
    			<Stack.Screen options={{headerShown: false}} name="Settings" component={Settings} />
    			<Stack.Screen options={{headerShown: false}} name="Other" component={Other} />
    			<Stack.Screen options={{headerShown: false}} name="Play" component={play} />
    		</Stack.Navigator>
    	</NavigationContainer>
    </View>
  );
}
