import React, {useState} from 'react';
import {TextInput, Text, View, TouchableOpacity} from 'react-native';
import RenderHtml from 'react-native-render-html';


export default function createCard() {
	const [source, setSource] = useState({html: `<h1>hi</h1>`});
	return (
		<>
		<Text style={{marginTop: 30}}>
			<RenderHtml 
				source={source}
			/>
		</Text>
		<TouchableOpacity onPress={() => setSource({...source, html: source.html.replace('h1', 'i')})}>
			<Text>Italic</Text>
		</TouchableOpacity>
		</>
	)
}