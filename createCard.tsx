import React, {useRef, useState, useCallback} from "react";
import { AsyncStorage, Modal, TouchableOpacity, View, TextInput, Text, Platform, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

export default function TempScreen({route, navigation}) {
	const [modalVisible, setModalVisible] = useState(false);
	const [title, setTitle] = useState(AsyncStorage.revisionCards[route.params.i].title);
	const [description, setDescription] = useState(AsyncStorage.revisionCards[route.params.i].description);
	const richText1 = useRef();
	const richText2 = useRef();
	const [n, setN] = useState(0);
	const [, updateState] = useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	
	const createCardInterface = index => {
		if (!AsyncStorage.revisionCards[route.params.i].card) {
			AsyncStorage.revisionCards[route.params.i].card = [{question: '', answer: ''}];
		} else if (!AsyncStorage.revisionCards[route.params.i].card[index]) {
			AsyncStorage.revisionCards[route.params.i].card.push({
				question: '',
				answer: ''
			});
		}
		try {
			richText1.current.setContentHTML(
				AsyncStorage.revisionCards[route.params.i].card[index].question
			);
			richText2.current.setContentHTML(
				AsyncStorage.revisionCards[route.params.i].card[index].answer
			);
		} catch(err) {
			//richText1.current.setContentHTML('')
		}
		return (
		<SafeAreaView style={{marginTop: StatusBar.currentHeight, marginLeft: 5, marginRight: 5}}>
            {n != 0 ? <TouchableOpacity style={{
				position: 'absolute',
				top: 0,
				left: 5,
			}} onPress={() => {
				setN(n - 1)
				forceUpdate();
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Previous</Text>
			</TouchableOpacity> : null}
			<TouchableOpacity style={{
				position: 'absolute',
				top: 0,
				right: 5,
			}} onPress={() => {
				setN(n + 1);
				forceUpdate();
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Next</Text>
			</TouchableOpacity>
            <TextInput 
            	placeholder={'Title..'}
            	onChangeText={newText => {
            		setTitle(newText);
            		AsyncStorage.revisionCards[route.params.i].title = newText;
            	}}
            	value={title}
            	style={styles.title}
            />
            <TextInput 
            	placeholder={'Description...'}
            	onChangeText={newText => {
            		setDescription(newText)
            		AsyncStorage.revisionCards[route.params.i].description = newText;
            	}}
            	value={description}
            	style={styles.description}
            />
            <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent/>
    		{Toolbar(richText1, {padding: 0})}
            <ScrollView>
        		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.editor}>
                    <RichEditor
                    	initialHeight={50}
                    	initialContentHTML={AsyncStorage.revisionCards[route.params.i].card[index].question}
                    	placeholder={'Enter question here...'}
                        ref={richText1}
                        onChange={ questionHTML => {
                            AsyncStorage.revisionCards[route.params.i].card[index].question = questionHTML;
                        }}
                        androidHardwareAccelerationDisabled={true} 
                    />
                </KeyboardAvoidingView>
            </ScrollView>
            {Toolbar(richText2, {marginTop: 15})}
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.editor}>
                    <RichEditor
                    	initialHeight={50}
                    	initialContentHTML={AsyncStorage.revisionCards[route.params.i].card[index].answer}
                    	placeholder={'Enter answer here...'}
                        ref={richText2}
                        onChange={ answerHTML => {
                            AsyncStorage.revisionCards[route.params.i].card[index].answer = answerHTML;
                        }}
                        androidHardwareAccelerationDisabled={true} 
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
		);
	}
	const Toolbar = (editor, style) => {
		return (
			<RichToolbar
            	style={style}
            	placeholder={'Enter answer here...'}
                editor={editor}
                actions={[ actions.insertImage, actions.setBold,
					actions.setItalic, actions.insertBulletsList,
					actions.insertOrderedList, actions.insertLink,
					actions.keyboard, actions.setStrikethrough,
					actions.setUnderline, actions.removeFormat,
					actions.insertVideo, actions.checkboxList,
					actions.undo, actions.redo,]}
                iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), }}
            />
		);
	}
	return (
		<>
        	<View>
        		{createCardInterface(n)}
        	</View>
        </>
    );
};
const styles = StyleSheet.create({
	title: {
		borderWidth: 1,
		borderColor: 'black',
		fontSize: 30,
		marginTop: 30,
		padding: 5
	},
	description: {
		borderWidth: 1,
		borderColor: 'black',
		fontSize: 15,
		padding: 5,
	},
	editor: {
		flex: 1,
		borderWidth: 1,
		borderColor: 'black'
	},
});