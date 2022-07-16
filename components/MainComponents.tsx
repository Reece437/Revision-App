import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';

interface CheckBoxParameters {
	value: boolean; 
	style?: object;
	onClick: () => void;
	checkedBackgroundColor?: string;
}
export const CheckBox: React.FC = (props: CheckBoxParameters) => (
	<TouchableOpacity onPress={props.onClick}
	style={[{width: 40, height: 40, borderWidth: 1, borderColor: 'white', justifyContent: 'center', alignItems: 'center'}, {backgroundColor: props.value ? props.checkedBackgroundColor || 'blue' : null}, props.style || null]}>
		<Text style={{color: 'white', textAlign: 'center', fontSize: 25}}>{props.value ? '✓' : ''}</Text>
	</TouchableOpacity>
);
  	
interface SearchBarProps {
		onTextChange?: () => void;
		style?: object;
		onFocus?: () => void;
		textColor?: string;
		placeholder: string;
		value: string;
}

export const SearchBar = (props: SearchBarProps) => (
	<View style={{flex: 1}}>
		<TextInput
			onChangeText={props.onTextChange}
			style={styles.SearchBar}
			placeholder={props.placeholder || "Search"}
			value={props.value}
		/>
	</View>
);

export const BottomBar = () => (
	<View style={{flex: 1, 
		backgroundColor: '#656565', width: '100%', 
		height: 55, position: 'absolute',
		bottom: 0, zIndex: 1
	}}>
	</View>
);


const styles = StyleSheet.create({
	SearchBar: {
		backgroundColor: '#656565',
		borderRadius: 5,
		marginLeft: 7,
		padding: 5,
		height: 40,
		fontSize: 18,
		width: '95%'
	}
});