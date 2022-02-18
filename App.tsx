import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Main.tsx';
import Other from './Other.tsx';
import play from './play.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
  	<View style={{flex: 1, backgroundColor: 'black'}}>
  	<NavigationContainer>
    	<Stack.Navigator screenOptions={{animationEnabled: false}}>
    		<Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
    		<Stack.Screen options={{headerShown: false}} name="Other" component={Other} />
    		<Stack.Screen options={{headerShown: false}} name="Play" component={play} />
    	</Stack.Navigator>
    </NavigationContainer>
    </View>
  );
}
