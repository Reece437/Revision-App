import React, {useRef, useState, useCallback} from "react";
import {TouchableOpacity, View, TextInput, Text, Platform, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TempScreen({route, navigation}) {
	const [title, setTitle] = useState();
	const [description, setDescription] = useState();
	AsyncStorage.getItem('revisionCards').then(data => {
		data = JSON.parse(data);
		setTitle(data[route.params.i].title);
		setDescription(data[route.params.i].description)
	})
	const richText1 = useRef();
	const richText2 = useRef();
	const [n, setN] = useState(0);
	const [, updateState] = useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	
	const CreateCardInterface = index => {
		const [question, setQuestion] = useState();
		const [answer, setAnswer] = useState();
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			if (!data[route.params.i].card) {
				data[route.params.i].card = [{
					question: '',
					answer: ''
				}]
			}
			if (!data[route.params.i].card[index]) {
				data[route.params.i].card[index] = {
					question: '',
					answer: ''
				}
			}
			AsyncStorage.setItem('revisionCards', JSON.stringify(data));
		})
		/*if (!AsyncStorage.revisionCards[route.params.i].card) {
			AsyncStorage.revisionCards[route.params.i].card = [{question: '', answer: ''}];
		} 
		if (!AsyncStorage.revisionCards[route.params.i].card[index]) {
			AsyncStorage.revisionCards[route.params.i].card.push({
				question: '',
				answer: ''
			});
		}*/
		try {
			AsyncStorage.getItem('revisionCards').then(data => {
				data = JSON.parse(data);
				richText1.current.setContentHTML(
					data[route.params.i].card[index].question;
				);
				richText2.current.setContentHTML(
					data[route.params.i].card[index].answer;
				);
			})
			/*richText1.current.setContentHTML(
				AsyncStorage.revisionCards[route.params.i].card[index].question
			);
			richText2.current.setContentHTML(
				AsyncStorage.revisionCards[route.params.i].card[index].answer
			);*/
		} catch(err) {
			//alert(err.message)
		}
		return (
		<View style={{marginTop: StatusBar.currentHeight, marginLeft: 5, marginRight: 5}}>
            <Text style={{textAlign: 'center', fontSize: 30}}>Card No. {n + 1} {'\n'}
			<Text style={{fontSize: 12}}>Total cards: AsyncStorage.revisionCards[route.params.i].card.length</Text></Text>
            {n != 0 ? <TouchableOpacity style={{
				position: 'absolute',
				top: 5,
				left: 5,
			}} onPress={() => {
				setN(n - 1)
				forceUpdate();
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Previous</Text>
			</TouchableOpacity> : null}
			<TouchableOpacity style={{
				position: 'absolute',
				top: 5,
				right: 5,
			}} onPress={() => {
				setN(n + 1);
				forceUpdate();
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Next</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {
				AsyncStorage.getItem('revisionCards').then(data => {
					data = JSON.parse(data);
					data[route.params.i].splice(index, 1);
					AsyncStorage.setItem('revisionCards', JSON.stringify(data));
					if (n + 1 < data[route.params.i].card.length) {
						setN(n + 1)
					} else {
						if (n != 0) setN(n - 1);
						else setN(0);
					}
				})
				/*AsyncStorage.revisionCards[route.params.i].card.splice(index, 1);
				if (n + 1 < AsyncStorage.revisionCards[route.params.i].card.length) {
					setN(n + 1);
				} else {
					if (n != 0) {
						setN(n - 1);
					} else {
						setN(0);
						forceUpdate();
					}
				}*/
			}}>
    			<Text style={{textAlign: 'right', fontSize: 25}}>🗑</Text>
    		</TouchableOpacity>
            <TextInput 
            	placeholder={'Title..'}
            	onChangeText={newText => {
            		setTitle(newText);
            		AsyncStorage.getItem('revisionCards').then(data => {
            			data = JSON.parse(data);
            			data[route.params.i].title = newText;
            			AsyncStorage.setItem('revisionCards', data);
            		})
            		//AsyncStorage.revisionCards[route.params.i].title = newText;
            	}}
            	value={title}
            	style={styles.title}
            />
            <TextInput 
            	placeholder={'Description...'}
            	onChangeText={newText => {
            		setDescription(newText)
            		AsyncStorage.getItem('revisionCards').then(data => {
            			data = JSON.parse(data);
            			data[route.params.i].description = newText;
            			AsyncStorage.setItem('revisionCards', data);
            		})
            		//AsyncStorage.revisionCards[route.params.i].description = newText;
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
        </View>
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
	useEffect(() => {
		forceUpdate();
	}, [])
	return (
        <>{CreateCardInterface(n)}</>
    );
};
const styles = StyleSheet.create({
	title: {
		borderWidth: 1,
		borderColor: 'black',
		fontSize: 30,
		marginTop: 20,
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