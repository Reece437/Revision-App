import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

interface SearchBarProps {
		onTextChange?: () => void;
		style?: object;
		onFocus?: () => void;
		textColor?: string;
		placeholder: string;
		value: string;
}
export const SearchBar = (props: SearchBarProps) => {
	return (
		<View style={{flex: 1}}>
			<TextInput
				onChangeText={props.onTextChange}
				style={styles.SearchBar}
				placeholder={props.placeholder || "Search"}
				value={props.value}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	SearchBar: {
		backgroundColor: '#9f9f9f',
		borderRadius: 20,
		padding: 5,
		height: 40,
		fontSize: 18
	}
})
	