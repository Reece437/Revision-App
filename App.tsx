import 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Main';
import Other from './screens/CreateCard';
import play from './screens/play';
import Settings from './screens/Settings';
import Login from './screens/Login';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from './firebase'

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [signedIn, setSignedIn] = useState()
  
  useEffect(() => {
  	const unsubscribe = auth.onAuthStateChanged(user => {
  		if (user) {
  			setSignedIn(true);
  		} else {
  			setSignedIn(false);
  		}
  	});
  }, [])
  
  useEffect(() => {
  	const setScreen = async() => {
  		if (signedIn !== undefined) {
  			await SplashScreen.hideAsync();
  		}
  	}
  	setScreen();
  }, [signedIn])
  
  if (signedIn === undefined) {
  	return null;
  }
  
  return (
  	<NavigationContainer>
    	<Stack.Navigator initialRouteName={signedIn ? 'Home' : 'Login'} screenOptions={{animationEnabled: false}}>
    		<Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
    		<Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
    		<Stack.Screen options={{headerShown: false}} name="Settings" component={Settings} />
    		<Stack.Screen options={{headerShown: false}} name="Other" component={Other} />
    		<Stack.Screen options={{headerShown: false}} name="Play" component={play} />
    	</Stack.Navigator>
    </NavigationContainer>
  );
}
