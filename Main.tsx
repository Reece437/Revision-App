import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './App.tsx';
import createCard from './createCard.tsx';
import Play from './Play.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer
    initialRouteName="Home">
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}}name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}}name="createCard" component={createCard} />
    	<Stack.Screen options={{headerShown: false}}name="Play" component={Play} />
      </Stack.Navigator>
     </NavigationContainer>
  );
}