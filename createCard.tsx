import React, {useRef, useState, useCallback, useEffect} from "react";
import {TouchableOpacity, View, TextInput, Text, Platform, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TempScreen({route, navigation}) {
	const [all, setAll] = useState();
	const richText1 = useRef();
	const richText2 = useRef();
	const [n, setN] = useState(0);
	const [, updateState] = useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	
	const createLocalStorageItems = index => {
		console.log('n: ' + n);
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			if (!data[route.params.i].card) {
				data[route.params.i].card = [{
					question: '',
					answer: ''
				}]
				AsyncStorage.setItem('revisionCards', JSON.stringify(data));
			}
		})
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			if (!data[route.params.i].card[index]) {
				console.log('yes');
				data[route.params.i].card.push({
					question: '',
					answer: ''
				})
				console.log(data[route.params.i].card.length)
				console.log(data[route.params.i])
				AsyncStorage.setItem('revisionCards', JSON.stringify(data));
			}
		})
	}
	const CreateCardInterface = props => {
		const data = props.data;
		const index = props.index
		const [title, setTitle] = useState(data[route.params.i].title);
		const [description, setDescription] = useState(data[route.params.i].description);
		try {
			richText1.current.setContentHTML(
				data[route.params.i].card[index].question
			);
			richText2.current.setContentHTML(
				data[route.params.i].card[index].answer
			);
		} catch(err) {
			console.log(err.message);
		}
		return (
		<View style={{marginTop: StatusBar.currentHeight, marginLeft: 5, marginRight: 5}}>
            <Text style={{textAlign: 'center', fontSize: 30}}>Card No. {n + 1} {'\n'}
			<Text style={{fontSize: 12}}>Total number of cards: {data[route.params.i].card.length}</Text></Text>
            {n != 0 ? <TouchableOpacity style={{
				position: 'absolute',
				top: 5,
				left: 5,
			}} onPress={() => {
				setN(n - 1)
				//displayContent();
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Previous</Text>
			</TouchableOpacity> : null}
			<TouchableOpacity style={{
				position: 'absolute',
				top: 5,
				right: 5,
			}} onPress={() => {
				setN(n + 1);
				//displayContent();
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Next</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {
				data[route.params.i].card.splice(index, 1);
				AsyncStorage.setItem('revisionCards', JSON.stringify(data));
				if (n + 1 < data[route.params.i].card.length) {
					setN(n + 1)
				} else {
					if (n != 0) setN(n - 1);
					else setN(0);
				}
			}}>
    			<Text style={{textAlign: 'right', fontSize: 25}}>🗑</Text>
    		</TouchableOpacity>
            <TextInput 
            	placeholder={'Title...'}
            	onChangeText={newText => {
            		setTitle(newText);
            		data[route.params.i].title = newText;
            		AsyncStorage.setItem('revisionCards', JSON.stringify(data));
            		//AsyncStorage.revisionCards[route.params.i].title = newText;
            	}}
            	value={title}
            	style={styles.title}
            />
            <TextInput 
            	placeholder={'Description...'}
            	onChangeText={newText => {
            		setDescription(newText)
            		data[route.params.i].description = newText
            		AsyncStorage.setItem('revisionCards', JSON.stringify(data));
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
                    	initialContentHTML={data[route.params.i].card[index].question}
                    	placeholder={'Enter question here...'}
                        ref={richText1}
                        onChange={ questionHTML => {
                            data[route.params.i].card[index].question = questionHTML;
                            AsyncStorage.setItem('revisionCards', JSON.stringify(data));
                            //AsyncStorage.revisionCards[route.params.i].card[index].question = questionHTML;
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
                    	initialContentHTML={data[route.params.i].card[index].answer}
                    	placeholder={'Enter answer here...'}
                        ref={richText2}
                        onChange={ answerHTML => {
                        	data[route.params.i].card[index].answer = answerHTML;  
                            AsyncStorage.setItem('revisionCards', JSON.stringify(data));
                            //AsyncStorage.revisionCards[route.params.i].card[index].answer = answerHTML;
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
	const displayContent = async () => {
		//createLocalStorageItems(n);
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			if (!data[route.params.i].card) {
				data[route.params.i].card = [{
					question: '',
					answer: ''
				}]
			}
			if (!data[route.params.i].card[n]) {
				data[route.params.i].card.push({
					question: '',
					answer: ''
				})
			}
			AsyncStorage.setItem('revisionCards', JSON.stringify(data));
			setAll(<CreateCardInterface data={data} index={n} />);
		})
	}
	useEffect(() => {
		displayContent();
	}, [n])
	return (
        <>{all}</>
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