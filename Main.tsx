import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './App.tsx';
import CreateCard from './createCard.tsx';
import play from './Play.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="createCard" component={CreateCard} />
    	<Stack.Screen options={{headerShown: false}} name="Play" component={play} />
      </Stack.Navigator>
     </NavigationContainer>
  );
}
