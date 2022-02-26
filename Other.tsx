import React, {useRef, useState, useCallback, useEffect} from "react";
import {TouchableOpacity, View, TextInput, Text, Platform, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";


export default function TempScreen({route, navigation}) {
	const [editor, setEditor] = useState(1)
	const [count, setCount] = useState(0)
	const [all, setAll] = useState(<Text>someValue</Text>);
	const richText1 = useRef();
	const richText2 = useRef();
	const [n, setN] = useState(route.params.n);
	const [, updateState] = useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	
	const BoxCards = (props: {data: object[]}) => {
		console.log('data ' + props.data);
		let len: number = props.data[route.params.i].card.length;
		let x: any = [];
		for (let i = 0; i < len; i++) {
			x.push(
			<TouchableOpacity style={styles.boxCard} key={i}
			onPress={() => setN(i)}>
				<Text style={{color: 'white', textAlign: 'center'}}>{i + 1}</Text>
			</TouchableOpacity>);
		}
		return (
			<ScrollView horizontal={true} style={{flexGrow: 0.001}}>{x}</ScrollView>
		);
	}
	interface CardInterface {
		data: object[];
		index: number;
	}
	const CreateCardInterface = (props: CardInterface) => {
		const data = props.data;
		const index = props.index
		const [title, setTitle] = useState(data[route.params.i].title);
		const [description, setDescription] = useState(data[route.params.i].description);
		const [question, setQuestion] = useState(data[route.params.i].card[index].question);
		const [answer, setAnswer] = useState(data[route.params.i].card[index].answer);
		
		return (
		<View style={{marginTop: StatusBar.currentHeight, marginLeft: 5, marginRight: 5, flex: 1}}>
            <Text style={{textAlign: 'center', fontSize: 30, color: 'white'}}>Card No. {n + 1} {'\n'}
			<Text style={{fontSize: 12, color: 'white'}}>Total number of cards: {data[route.params.i].card.length}</Text></Text>
            {n != 0 ? <TouchableOpacity style={{
				position: 'absolute',
				top: 5,
				left: 5,
			}} onPress={() => {
				setN(n - 1)
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Previous</Text>
			</TouchableOpacity> : null}
			<TouchableOpacity style={{
				position: 'absolute',
				top: 5,
				right: 5,
			}} onPress={() => {
				setN(n + 1);
			}}>
				<Text style={{fontSize: 20, color: '#56ddfe'}}>Next</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {
				data[route.params.i].card.splice(index, 1);
				AsyncStorage.setItem('revisionCards', JSON.stringify(data));
				if (n != 0) {
					setN(n - 1)
				}
				else setCount(count + 1)
				}
			}>
    			<Text style={{textAlign: 'right', fontSize: 25}}>🗑</Text>
    		</TouchableOpacity>
    		<BoxCards data={data}/>
            <TextInput 
            	placeholder={'Title...'}
            	placeholderTextColor={'#e3ecef74'}
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
            	placeholderTextColor={'#e3ecef74'}
            	onChangeText={newText => {
            		setDescription(newText)
            		data[route.params.i].description = newText
            		AsyncStorage.setItem('revisionCards', JSON.stringify(data));
            		//AsyncStorage.revisionCards[route.params.i].description = newText;
            	}}
            	value={description}
            	style={styles.description}
            />
            <ScrollView>
            <RichToolbar
            	editor={richText1}
                style={{backgroundColor: 'black', borderWidth: 1, borderColor: 'white', borderBottomColor: 'gray', marginTop: 5}}
                actions={[actions.setBold,
					actions.setItalic, actions.insertBulletsList,
					actions.insertOrderedList, actions.insertLink,
					actions.keyboard, actions.setStrikethrough,
					actions.setUnderline, actions.removeFormat,
					actions.checkboxList, actions.undo, actions.redo,
					actions.setSubscript, actions.setSuperscript, 
					actions.heading1, actions.heading2, actions.blockquote,
					actions.code, actions.alignLeft, actions.alignCenter, actions.alignRight, actions.alignFull]}
                iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), 
                	[actions.heading2] : ({tintColor}) => (<Text style={{color: tintColor}}>H2</Text>),
                	[actions.blockquote] : ({tintColor}) => (<Text style={{color: tintColor}}>BQ</Text>)
                	
                }}
            />
            	<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                	style={styles.editor}>
                    <RichEditor
                    	key={'editor1'}
                    	editorStyle={{backgroundColor: 'black', color: 'white', caretColor: 'red'}}
                    	initialHeight={50}
                    	initialContentHTML={data[route.params.i].card[index].question}
                    	placeholder={'Enter question here...'}
                        ref={richText1}
                        onFocus={() => setEditor(1)}
                        onChange={ questionHTML => {
                        	questionHTML = questionHTML.replace(/<img sr/g, `<img style='width: 110px; height: 110px;' sr`)
                            data[route.params.i].card[index].question = questionHTML;
                            AsyncStorage.setItem('revisionCards', JSON.stringify(data));
                            //AsyncStorage.revisionCards[route.params.i].card[index].question = questionHTML;
                        }}
                        androidHardwareAccelerationDisabled={false} 
                    />
                </KeyboardAvoidingView>
            <RichToolbar
            	onPressAddImage={() => addImage()}
            	editor={richText2}
                style={{backgroundColor: 'black', borderWidth: 1, borderColor: 'white', borderBottomColor: 'gray', marginTop: 5}}
                actions={[actions.setBold,
					actions.setItalic, actions.insertBulletsList,
					actions.insertOrderedList, actions.insertLink,
					actions.keyboard, actions.setStrikethrough,
					actions.setUnderline, actions.removeFormat,
					actions.checkboxList, actions.undo, actions.redo,
					actions.setSubscript, actions.setSuperscript, 
					actions.heading1, actions.heading2, actions.blockquote,
					actions.code, actions.alignLeft, actions.alignCenter, actions.alignRight, actions.alignFull]}
                iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), 
                	[actions.heading2] : ({tintColor}) => (<Text style={{color: tintColor}}>H2</Text>),
                	[actions.blockquote] : ({tintColor}) => (<Text style={{color: tintColor}}>BQ</Text>)
                	
                }}
            />
            	<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                	style={styles.editor}>
                    <RichEditor
                    	key={'editor2'}
                    	editorStyle={{backgroundColor: 'black', color: 'white', caretColor: 'red'}}
                    	initialHeight={50}
                    	initialContentHTML={data[route.params.i].card[index].answer}
                    	placeholder={'Enter answer here...'}
                        ref={richText2}
                        onFocus={() => {setEditor(2)}}
                        onChange={ answerHTML => {
                        	answerHTML = answerHTML.replace(/<img sr/, `<img style='width: 110px; height: 110px;' sr`);
                        	//console.log(answerHTML);
                            data[route.params.i].card[index].answer = answerHTML;
                            AsyncStorage.setItem('revisionCards', JSON.stringify(data));
                            //AsyncStorage.revisionCards[route.params.i].card[index].question = questionHTML;
                        }}
                        androidHardwareAccelerationDisabled={false} 
                    />
                </KeyboardAvoidingView>
               </ScrollView>
            <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent/>
        </View>
		);
	}
	const displayContent = (): void => {
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
	}, [n, count])
	return (
        <View style={{flex: 1, backgroundColor: 'black'}} key={'all'}>
        	{all}
        </View>
    );
};
const styles = StyleSheet.create({
	title: {
		borderWidth: 1,
		borderColor: 'white',
		fontSize: 30,
		marginTop: 20,
		padding: 5,
		color: 'white'
	},
	description: {
		borderWidth: 1,
		borderColor: 'white',
		fontSize: 15,
		padding: 5,
		color: 'white'
	},
	editor: {
		borderWidth: 1,
		borderColor: 'white',
		borderTopWidth: 0,
		fontSize: 18,
		padding: 5,
		minHeight: 30,
		color: 'white',
	},
	boxCard: {
		color: 'white',
		backgroundColor: '#3035f5',
		width: 35,
		height: 45,
		marginLeft: 2.5,
		marginRight: 2.5,
		marginTop: 5,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
});