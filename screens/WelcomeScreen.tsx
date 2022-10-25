import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Login from './Login';


export default function WelcomeScreen({route}) {
	return (
		<ScrollView 
			style={{ flex: 1}}
			pagingEnabled={true}
			horizontal={true}
		>
			
		</ScrollView>
	);
}