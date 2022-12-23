import React, {useRef, useState, useCallback, useEffect} from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {AppState, TouchableOpacity, View, TextInput, Text, Platform, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import { auth, db } from '../../firebase';

export default function TempScreen({route, navigation}) {
	const richText1 = useRef();
	const richText2 = useRef();
	
	interface editorProps {
		placeholder?: string;
		question: boolean;
		data: any;
		n?: number;
		onFocus?: () => void;
		fun?: () => void;
	}
	const Editor: React.FC = React.forwardRef((props: editorProps, ref) => {
		try {
			return (
				<View style={styles.editor}>
		            <RichEditor
		              	key={'editor1'}
		              	editorStyle={{backgroundColor: 'black', color: 'white', caretColor: 'red'}}
		               	initialHeight={80}
		                initialContentHTML={props.question ? props.data[route.params.i].card[route.params.n].question :
		                	props.data[route.params.i].card[route.params.n].answer
		                }
		                placeholder={props.placeholder}
		                ref={ref}
		                autoCapitalize={'on'}
		                onChange={HTML => {
		                   	HTML = HTML.replace(/<img sr/g, `<img style='width: 110px; height: 110px;' sr`);
		                    props.question ? props.data[route.params.i].card[props.n].question = HTML :
		                    props.data[route.params.i].card[props.n].answer = HTML;
		                    props.fun(props.data);
		                   	AsyncStorage.setItem('cards', JSON.stringify(props.data))
		                    AsyncStorage.setItem('shouldSave', JSON.stringify(true))
		                    //db.collection('users').doc(auth.currentUser?.uid).set({data: props.data});
		                }}
		                onFocus={props.onFocus}
		                androidHardwareAccelerationDisabled={false} 
		            />
		        </View>
			);
		} catch(err) {
			return (
				<View style={styles.editor}>
		            <RichEditor
		              	key={'editor1'}
		              	editorStyle={{backgroundColor: 'black', color: 'white', caretColor: 'red'}}
		               	initialHeight={80}
		                initialContentHTML={'<div></div>'}
		                placeholder={props.placeholder}
		                ref={ref}
		                autoCapitalize={'on'}
		                onFocus={props.onFocus}
		                onChange={HTML => {
		                   	console.log('data: ' + props.data[route.params.i].card[props.n].question)
		                   	HTML = HTML.replace(/<img sr/g, `<img style='width: 110px; height: 110px;' sr`);
		                    props.question ? props.data[route.params.i].card[props.n].question = HTML :
		                    props.data[route.params.i].card[props.n].answer = HTML;
		                    props.fun(props.data);
		                    AsyncStorage.setItem('cards', JSON.stringify(props.data))
		                    AsyncStorage.setItem('shouldSave', JSON.stringify(true));
		                 }}
		                androidHardwareAccelerationDisabled={false} 
		            />
		        </View>
			);
		}
	});
	
	const Toolbar: React.FC = React.forwardRef((props, ref) => (
		<View style={{flex: 1}}>
			<RichToolbar
	           	editor={ref}
	            style={{backgroundColor: 'black', borderWidth: 1, borderBottomWidth: 0, borderColor: 'white', marginTop: 5}}
	            actions={[actions.setBold,
					actions.setItalic, 
					actions.setStrikethrough,
					actions.setUnderline, 
					actions.insertBulletsList,
					actions.insertOrderedList, actions.heading1, actions.heading2, 
					actions.alignLeft, actions.alignCenter, actions.alignRight, actions.alignFull,
				]}
	            iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), 
	                [actions.heading2] : ({tintColor}) => (<Text style={{color: tintColor}}>H2</Text>),
	                [actions.blockquote] : ({tintColor}) => (<Text style={{color: tintColor}}>BQ</Text>),
	            }}
	        />
	        <RichToolbar
	           	editor={ref}
	            style={{backgroundColor: 'black', borderWidth: 1, borderTopWidth: 0, borderColor: 'white', marginBottom: 5}}
	            actions={[
					actions.removeFormat,
					actions.undo, actions.redo,
					actions.setSubscript, actions.setSuperscript,
					'plusminus', 'sqrt', 'sum', 'intergrate']}
	            iconMap={{ [actions.heading1]: ({tintColor}) => (<Text style={[{color: tintColor}]}>H1</Text>), 
	                plusminus: ({tintColor}) => (<Text style={{color: tintColor}}>&plusmn;</Text>),
	            	sqrt: ({tintColor}) => (<Text style={{color: tintColor}}>&radic;</Text>),
	            	sum: ({tintColor}) => (<Text style={{color: tintColor}}>&sum;</Text>),
	            	intergrate: ({tintColor}) => (<Text style={{color: tintColor}}>&int;</Text>)
	            }}
	            plusminus={() => ref.current?.insertHTML('&plusmn;')}
	        	sqrt={() => ref.current?.insertHTML('&radic;')}
	        	sum={() => ref.current?.insertHTML('&sum;')}
	        	intergrate={() => ref.current?.insertHTML('&int;')}
	        />
	    </View>
	));
	
	const BoxCards = (props: {data: object[], onPress: () => void}) => {
		let len: number = props.data[route.params.i].card.length;
		let x: any = [];
		for (let i = 0; i < len; i++) {
			x.push(
				<TouchableOpacity style={styles.boxCard} key={i}
					onPress={() => {
						props.onPress(i)
					}}>
					<LinearGradient colors={['purple', 'blue']}
						style={styles.boxCard}
						start={{x: 0.7, y: 0.1}}>
						<Text style={{color: 'white', textAlign: 'center'}}>{i + 1}</Text>
					</LinearGradient>
				</TouchableOpacity>
			);
		}
		return (
			<ScrollView horizontal={true} style={{flexGrow: 0}}>{x}</ScrollView>
		);
	}
		
	
	const Interface = () => {
		const [toolbar, setToolbar] = useState(true)
		const [storageItems, setStorageItems] = useState();
		const [title, setTitle] = useState();
		const [description, setDescription] = useState();
		const [question, setQuestion] = useState();
		const [answer, setAnswer] = useState();
		const [n, setN] = useState(route.params.n);
		const [count, setCount] = useState(0)
		const data = storageItems;
		
		useEffect(() => {
			const unsubscribe = AppState.addEventListener('change', async(newState) => {
				let shouldSave = await AsyncStorage.getItem('shouldSave');
				shouldSave = JSON.parse(shouldSave)
				if (shouldSave === true && newState == 'background') {
					console.log('background saved')
					await save();
					let info = await AsyncStorage.getItem('cards')
					info = JSON.parse(info);
					await db.collection('users').doc(auth.currentUser?.uid).set({data: info});
					AsyncStorage.setItem('shouldSave', JSON.stringify(false))
				}
			}) 
			return () => unsubscribe.remove()
		}, [])
		
		/*
		* This is necessary to reduce read and writes to firebase server
		*/
		////////////////
		const save = (doc) => {
			AsyncStorage.setItem('cards', JSON.stringify(doc));
			AsyncStorage.setItem('shouldSave', JSON.stringify(true));
		}
		
		useEffect(() => {
			const unsubscribe = navigation.addListener('beforeRemove', async() => {
				let data = await AsyncStorage.getItem('cards');
				data = JSON.parse(data)
				let shouldSave = await AsyncStorage.getItem('shouldSave');
				shouldSave = JSON.parse(shouldSave);
				if (shouldSave === true && data !== undefined) {
					db.collection('users').doc(auth.currentUser?.uid).set({data});
					AsyncStorage.setItem('shouldSave', JSON.stringify(false))
				}
			});
			return unsubscribe;
		}, [])
		
		const updateAll = () => {
			if (storageItems !== undefined) {
				const info = storageItems;
				richText1.current?.setContentHTML(info[route.params.i].card[n].question);
				setQuestion(info[route.params.i].card[n].question);
				richText2.current?.setContentHTML(info[route.params.i].card[n].answer);
				setAnswer(info[route.params.i].card[n].answer);
			}
		}
		
		const createNew = () => {
			const info = storageItems;
			info[route.params.i].card.push({
				question: '',
				answer: '',
				isCorrect: null
			});
			setStorageItems(info)
			save(info)
			setN(info[route.params.i].card.length - 1);
		}
		
		useEffect(() => {
			updateAll()
		}, [n, count])
		
		useEffect(() => {
			updateStorageItems();
		}, [])
		
		/////////////////
		const updateStorageItems = (): void => {
			db.collection('users').doc(auth.currentUser?.uid).get().then(doc => {
				let info = doc.data().data
				if (!info[route.params.i].card) {
					info[route.params.i].card = [{
						question: '',
						answer: '',
						isCorrect: null
					}]
				}
				if (!info[route.params.i].card[n]) {
					info[route.params.i].card.push({
						question: '',
						answer: '',
						isCorrect: null
					})
				}
				db.collection('users').doc(auth.currentUser?.uid).set({data: info})
				setTitle(info[route.params.i].title);
				setDescription(info[route.params.i].description);
				richText1.current?.setContentHTML(info[route.params.i].card[n].question);
				setQuestion(info[route.params.i].card[n].question);
				richText2.current?.setContentHTML(info[route.params.i].card[n].answer);
				setAnswer(info[route.params.i].card[n].answer);
				setStorageItems(info);
			});
		}
		
		try {
			return (
				<View style={{marginTop: StatusBar.currentHeight, flex: 1}}>
			        <Text style={{textAlign: 'center', fontSize: 30, color: 'white'}}>Card No. {n + 1} {'\n'}
					<Text style={{fontSize: 12, color: 'white'}}>Total number of cards: {data[route.params.i].card.length}</Text></Text>
			        <TouchableOpacity style={{
						position: 'absolute',
						top: 5,
						right: 5,
					}} onPress={() => {
						createNew()
					}}>
						<Text style={{fontSize: 20, color: '#56ddfe'}}>New</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {
						data[route.params.i].card.splice(n, 1);
						if (n != 0) {
							save(data);
							setStorageItems(data)
							setN(n - 1);
						} else {
							if (data[route.params.i].card.length == 0) {
								data[route.params.i].card = [{
									question: '',
									answer: ''
								}];
							}
							save(data)
							setStorageItems(data);
							setCount(count + 1)
						}
					}} style={{width: 35, marginLeft: 320}}>
						<Text style={{textAlign: 'center', fontSize: 25}}>🗑</Text>
					</TouchableOpacity>
					<BoxCards data={data} onPress={setN} />
			        <TextInput 
			        	placeholder={'Title for Card Set'}
			        	placeholderTextColor={'#e3ecef74'}
			        	onChangeText={newText => {
			        		setTitle(newText);
			        		data[route.params.i].title = newText;
			        		save(data);
			        		setStorageItems(data);
			        		//AsyncStorage.revisionCards[route.params.i].title = newText;
			        	}}
			        	value={title}
			        	style={styles.title}
			        />
			        <TextInput 
			        	placeholder={'Description for Card Set'}
			        	placeholderTextColor={'#e3ecef74'}
			        	onChangeText={newText => {
			        		setDescription(newText)
			        		data[route.params.i].description = newText
			        		save(data);
			        		setStorageItems(data);
			        		//AsyncStorage.revisionCards[route.params.i].description = newText;
			        	}}
			        	value={description}
			        	style={styles.description}
			        />
			        <ScrollView stickyHeaderIndices={[0]}>
				       	{toolbar ? <Toolbar ref={richText1} /> : <Toolbar ref={richText2} />}
				       	<KeyboardAvoidingView style={{flex: 1}} behavior="position" keyboardVerticalOffset={-50}>
					       	<Editor ref={richText1} fun={setStorageItems} n={n} placeholder={`Question for Card ${n + 1}`} question={true} data={data} onFocus={() => setToolbar(true)} />
					       	<Editor ref={richText2} fun={setStorageItems} n={n} placeholder={`Answer for Card ${n + 1}`} style={{borderTopWidth: 0}} question={false} data={data} onFocus={() => setToolbar(false)} />
					    </KeyboardAvoidingView>
				    </ScrollView>
			        <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent/>
	        	</View>
			)
		} catch(err) {
			return null;
		}
	}
	
	return (
        <View style={{flex: 1, backgroundColor: 'black'}} key={'all'}>
        	<Interface />
        </View>
    );
};
const styles = StyleSheet.create({
	title: {
		width: '100%',
		fontSize: 40,
		padding: 5,
		height: 80,
		color: 'white',
		//backgroundColor: '#ffffff00'
	},
	description: {
		width: '100%',
		fontSize: 18,
		padding: 5,
		color: 'white',
	},
	editor: {
		borderWidth: 1,
		borderColor: 'white',
		padding: 5,
	},
	boxCard: {
		width: 35,
		height: 45,
		marginLeft: 2.5,
		marginRight: 2.5,
		marginTop: 5,
		marginBottom: 3,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
});