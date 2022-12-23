import { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Text, TextInput, StatusBar, Animated } from 'react-native';
import { styles } from './AddMultipleStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebase'

export default function App({navigation}) {
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);
	
	const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
	
	const [cardSets, setCardSets] = useState([{
		title: '',
		description: '',
		card: [{
			isCorrect: null,
			question: '',
			answer: ''
		}],
		lastAttempted: null
	}]);
	
	
	
	const MinusButton = ({index}) => (
		<TouchableOpacity
		style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: -4, top: 35}}
		onPress={() => {
			setCardSets((prev) => {
				prev.splice(index, 1)
				return prev
			});
			forceUpdate()
		}}>
			<Icon name="remove-circle-outline" size={30} color={'red'} />
		</TouchableOpacity>
	)
	
	const AddButton = () => (
		<TouchableOpacity
		style={{marginTop: 10, marginLeft: 10, borderRadius: 30, width: 50, height: 50, marginBottom: 50}}
		onPress={() => {
			setCardSets((prev) => [
				...prev,
				{
					title: '',
					description: '',
					card: [{
						isCorrect: null,
						question: '',
						answer: ''
					}],
					lastAttempted: null
				}
			]);
		}}>
			<LinearGradient colors={['purple', 'blue']}
				style={{borderRadius: 30, width: 50, height: 50, marginBottom: 50, alignItems: 'center', justifyContent: 'center'}}
				start={{x: 0.7, y: 0.1}}
			>
				<Icon name="add-outline" color="white" size={24} />
			</LinearGradient>
		</TouchableOpacity>
	)
	
	const NewCardSet = ({index, data, func}) => {
		const [title, setTitle] = useState(data[index].title);
		const [description, setDescription] = useState(data[index].description);
		
		return (
			<View style={{borderBottomWidth: 0.5, borderColor: 'white'}}>
				<TextInput
					placeholder={'Title for Card Set'}
			       	placeholderTextColor={'#e3ecef74'}
					style={styles.titleBox}
					value={title}
					onChangeText={(newText) => {
						setTitle(newText);
						data[index].title = newText;
						func(data)
					}}
				/>
				<TextInput
					placeholder={'Description for Card Set'}
			        placeholderTextColor={'#e3ecef74'}
			        style={styles.descriptionBox}
					value={description}
					onChangeText={(newText) => {
						setDescription(newText)
						data[index].description = newText;
						func(data);
					}}
				/>
				<MinusButton index={index} />
			</View>
		);
	}

	
	const create = () => {
		db.collection('users').doc(auth.currentUser?.uid).get().then(doc => {
			let data = doc.data().data;
			for (let i = 0; i < cardSets.length; i++) {
				data.unshift(cardSets[i]);
			}
			db.collection('users').doc(auth.currentUser?.uid).set({data});
		});
		navigation.replace('Home');
	}
	
	const CreateButton = () => {
		
		return (
			<TouchableOpacity style={{position: 'absolute', right: 0, borderRadius: 30, width: 120, height: 50, marginBottom: 50, marginRight: 10, marginTop: 10}}
			onPress={create}>
				<LinearGradient colors={['purple', 'blue']}
					style={{borderRadius: 30, width: 120, height: 50, alignItems: 'center', justifyContent: 'center'}}
					start={{x: 0.7, y: 0.1}}
				>
					<Text style={{color: 'white', fontSize: 24}}>Create</Text>
				</LinearGradient>
			</TouchableOpacity>
		);
	}
	
	return (
		<ScrollView style={[styles.container, {paddingTop: StatusBar.currentHeight}]}>
			{cardSets.map((data, index) => <NewCardSet index={index} data={cardSets} func={setCardSets} key={index} />)}
			<View style={{flex: 1, flexDirection: 'row'}}>
				<AddButton />
				<CreateButton />
			</View>
		</ScrollView>
	);
}