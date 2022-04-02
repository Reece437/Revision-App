import React, {useRef, useState, useCallback, useEffect} from "react";
import {TouchableOpacity, View, TextInput, Text, Platform, StyleSheet, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";


export default function TempScreen({route, navigation}) {
	const richText1 = useRef();
	const richText2 = useRef();
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	
	interface editorProps {
		placeholder?: string;
		question: boolean;
		data: any;
		n?: number;
		onFocus?: () => void;
	}
	const Editor: React.FC = React.forwardRef((props: editorProps, ref) => {
		try {
			return (
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
		        style={styles.editor}>
		            <RichEditor
		              	key={'editor1'}
		              	editorStyle={{backgroundColor: 'black', color: 'white', caretColor: 'red'}}
		               	initialHeight={50}
		                initialContentHTML={props.question ? props.data[route.params.i].card[route.params.n].question :
		                	props.data[route.params.i].card[route.params.n].answer
		                }
		                placeholder={props.placeholder}
		                ref={ref}
		                autoCapitalize={'on'}
		                onChange={HTML => {
		                   	console.log('data: ' + props.data[route.params.i].card[props.n].question)
		                   	HTML = HTML.replace(/<img sr/g, `<img style='width: 110px; height: 110px;' sr`);
		                    props.question ? props.data[route.params.i].card[props.n].question = HTML :
		                    props.data[route.params.i].card[props.n].answer = HTML;
		                    AsyncStorage.setItem('revisionCards', JSON.stringify(props.data));
		                    //AsyncStorage.revisionCards[route.params.i].card[index].question = questionHTML;
		                }}
		                onFocus={props.onFocus}
		                androidHardwareAccelerationDisabled={false} 
		            />
		        </KeyboardAvoidingView>
			);
		} catch(err) {
			return (
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
		        style={styles.editor}>
		            <RichEditor
		              	key={'editor1'}
		              	editorStyle={{backgroundColor: 'black', color: 'white', caretColor: 'red'}}
		               	initialHeight={50}
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
		                    AsyncStorage.setItem('revisionCards', JSON.stringify(props.data));
		                    //AsyncStorage.revisionCards[route.params.i].card[index].question = questionHTML;
		                }}
		                androidHardwareAccelerationDisabled={false} 
		            />
		        </KeyboardAvoidingView>
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
			onPress={() => props.onPress(i)}>
				<Text style={{color: 'white', textAlign: 'center'}}>{i + 1}</Text>
			</TouchableOpacity>);
		}
		return (
			<ScrollView horizontal={true} style={{flexGrow: 0.001}}>{x}</ScrollView>
		);
	}
	const CreateCardInterface: React.FC = () => {
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
			updateStorageItems();
		}, [n, count]);
		const updateStorageItems = (): void => {
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
				setTitle(data[route.params.i].title);
				setDescription(data[route.params.i].description);
				richText1.current?.setContentHTML(data[route.params.i].card[n].question);
				setQuestion(data[route.params.i].card[n].question);
				richText2.current?.setContentHTML(data[route.params.i].card[n].answer);
				setAnswer(data[route.params.i].card[n].answer)
				setStorageItems(data);
			});
		}
		try {
			return (
				<View style={{marginTop: StatusBar.currentHeight, marginLeft: 5, marginRight: 5, flex: 1}}>
			        <Text style={{textAlign: 'center', fontSize: 30, color: 'white'}}>Card No. {n + 1} {'\n'}
					<Text style={{fontSize: 12, color: 'white'}}>Total number of cards: {data[route.params.i].card.length}</Text></Text>
			        <TouchableOpacity style={{
						position: 'absolute',
						top: 5,
						right: 5,
					}} onPress={() => {
						setN(data[route.params.i].card.length);
					}}>
						<Text style={{fontSize: 20, color: '#56ddfe'}}>New</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {
						data[route.params.i].card.splice(n, 1);
						AsyncStorage.setItem('revisionCards', JSON.stringify(data));
						if (n != 0) {
							setN(n - 1)
						} else setCount(count + 1)
					}} style={{width: 35, marginLeft: 310}}>
						<Text style={{textAlign: 'center', fontSize: 25}}>🗑</Text>
					</TouchableOpacity>
					<BoxCards data={data} onPress={setN} />
			        <ScrollView contentConatinerStyle={{marginBottom: 5}}>
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
			        {toolbar ? <Toolbar ref={richText1} /> : null}
			        {!toolbar ? <Toolbar ref={richText2} /> : null}
			        <Editor ref={richText1} n={n} placeholder={'Enter question here...'} question={true} data={data} onFocus={() => setToolbar(true)} />
			        <Editor ref={richText2} n={n} placeholder={'Enter answer here...'} style={{borderTopWidth: 0}} question={false} data={data} onFocus={() => setToolbar(false)} />
			        </ScrollView>
			        <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent/>
	        	</View>
			);
		} catch(err) {
			console.log(err.message);
			return <></>
		}
	}
	
	return (
        <View style={{flex: 1, backgroundColor: 'black'}} key={'all'}>
        	<CreateCardInterface />
        </View>
    );
};
const styles = StyleSheet.create({
	title: {
		borderWidth: 1,
		borderColor: 'white',
		fontSize: 30,
		padding: 5,
		color: 'white',
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
		fontSize: 24,
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
		marginBottom: 10,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
});