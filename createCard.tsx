import React, { useState, useCallback } from 'react';
import { TextInput, ScrollView, AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

export default function createCard({route, navigation}) {
	const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
	return (
		<View style={styles.container}>
			<TextInput 
			style={styles.input}
			placeholder='Enter text here' />
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight
	},
	text: {
		fontSize: 40,
		textAlign: 'center',
		margin: 30
	},
	input: {
    	height: 80,
    	margin: 12,
		borderWidth: 1,
    	padding: 10,
    	fontSize: 20,
    	fontStyle: 'normal'
	},
});