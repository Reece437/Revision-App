import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TouchableWithoutFeedback, Alert, Dimensions, TextInput, TouchableNativeFeedback, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar, CheckBox, BottomBar } from './components/MainComponents';
import {
	isMergable,
	removeUntitled,
	titleLengthFix,
	duplicateCheck
} from './MainFunctions';
import { auth, db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Overlay } from './components/Overlay';
import { RevisionCard } from './components/RevisionCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';


const AddButton = ({selectionBox, addLocalStorageItems, AddMultiple, mergeCardSets, setSelectionBox, storageItems}) => {
	const [render, setRender] = useState(false);
	const scaleValue = useSharedValue(0)
	const scaleValueStyle = useAnimatedStyle(() => {
		return {
			transform: [{scale: withSpring(scaleValue.value, {
				mass: 0.8
			})}]
		}
	})
	
	
	useEffect(() => {
		if (render) {
			scaleValue.value = 1
		} else {
			scaleValue.value = 0
		}
	}, [render]);
	
	return (
		<>
		{!selectionBox ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 35)}
			onPress={() => setRender(!render)}>
			<View style={styles.addButton}>
				<Text style={[styles.addButtonText]}>+</Text>
			</View>
		</TouchableNativeFeedback> : null}
		{!selectionBox ? <Animated.View style={[{zIndex: 11}, styles.addSecondary, scaleValueStyle]}>
			<TouchableOpacity
				onPress={addLocalStorageItems}
				onLongPress={AddMultiple}>
				<Icon name="create-outline" size={24} />
			</TouchableOpacity> 
		</Animated.View>: null}
		{!selectionBox ? <Animated.View style={[{zIndex: 11}, styles.addTertiary, scaleValueStyle]}>
			<TouchableOpacity 
				onPress={() => {
				if (storageItems.length <= 1) {
					alert("You don't have enough card sets to use the merge feature");
					setRender(false);
				} else {
					setRender(false)
					setSelectionBox(true); 
				}
				//forceUpdate();
			}}>
				<Icon name="git-network-outline" size={24} />
			</TouchableOpacity>
		</Animated.View> : null}
		{selectionBox ? <TouchableNativeFeedback
		background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 35)}
		onPress={mergeCardSets}>
		<View style={styles.addButton}>
			<Icon name="git-network-outline" size={40} />
		</View>
		</TouchableNativeFeedback> : null}
		</>
	);
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTouchableNativeFeedback = Animated.createAnimatedComponent(TouchableNativeFeedback);
	
export default function App({navigation}) {
	const [loadText, setLoadText] = useState("Loading.")
	const [selectionBox, setSelectionBox] = useState(false);
	const [mergeItems, setMergeItems] = useState([]);
	const [noCards, setNoCards] = useState(false);
	const [storageItems, setStorageItems] = useState();
	const [visible, setVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	
	
	
	// For debugging purposes only 
	const ResetStorage: React.FC = () => (
		<TouchableOpacity style={styles.reset} 
		onPress={() => {
			AsyncStorage.setItem('revisionCards', JSON.stringify([]));
			setNoCards(true);
			updateStorageItems();
		}}>
			<Text style={{color: 'white'}}>Clear</Text>
		</TouchableOpacity>
	);
	
	const NoResult: React.FC = () => (
		<View style={styles.Card}>
			<Text style={{padding: 5, fontSize: 30, color: 'white'}}>No result</Text>
			<Text style={{padding: 5, color: 'white'}}>There aren't any card sets with this title</Text>
		</View>	
	);
	
	const updateStorageItems = (): void => {
		db.collection('users').doc(auth.currentUser?.uid).get().then(doc => {
			data = doc.data().data
			setStorageItems(duplicateCheck(data));
		});
	}
	
	const calculateLastAttempt = (data, index) => {
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		
		const info = data[index].lastAttempted
		
		if (info === null) {
			return "Has not been attempted"
		}
		
		let dateString;
		if (day == info.day && month == info.month && year == info.year) {
			dateString = "Today";
		} else if (day == info.day + 1 && month == info.month && year == info.year) {
			dateString = "Yesterday";
		} else {
			dateString = `${info.day}/${info.month}/${info.year}`;
		}
		
		return `${dateString} at ${info.hour}:${info.minute}`
	}
	
	const setLastAttempted = () => {
		const date = new Date();
		
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		let hour = (date.getHours()).toString();
		let minute = (date.getMinutes()).toString();
		
		if (minute.length == 1) {
			minute = "0" + minute;
		}
		
		if (hour.length == 1) {
			hour = "0" + hour;
		}
		
		return {
			day: day,
			month: month,
			year: year,
			hour: hour,
			minute: minute
		}
	}
	
	const checkSearchResults = (searchText) => {
		for (let i = 0; i < storageItems.length; i++) {
			if (storageItems[i].title.toLowerCase().includes(searchText.toLowerCase())) {
				return true;
			}
		} return false;
	}
	
	const addLocalStorageItems = (): void => {
		let data = storageItems;
		data.unshift({
			title: '',
			description: '',
			lastAttempted: null
		});
		db.collection('users').doc(auth.currentUser?.uid).set({data});
		updateStorageItems();
		navigation.navigate('Other', {
			i: 0,
			n: 0
		})
	}
	
	const mergeCardSets = () => {
		console.log('merge items: ' + mergeItems)
		if (mergeItems.length <= 1) {
			alert("You haven't selected enough sets to merge");
			return;
		}
		let data = storageItems;
		mergeItems.sort();
		let newCardSet = {
			title: 'Merged card set',
			description: 'This is a merged card set',
			lastAttempted: null
		};
		newCardSet.card = [];
		for (let i: number = 0; i < mergeItems.length; i++) {
			for (let j: number = 0; j < data[mergeItems[i]].card.length; j++) {
				newCardSet.card.push(data[mergeItems[i]].card[j]);
			}
		}
    	data.unshift(newCardSet);
		db.collection('users').doc(auth.currentUser?.uid).set({data});
		setMergeItems([]);
		setSelectionBox(false);
		setSearchText("")
	}
	
	
	useEffect(() => {
		const unsubscribe = db.collection('users').doc(auth.currentUser?.uid).onSnapshot(doc => {
			let data = doc.data().data;
			try {
				if (data.length != storageItems.length) {
					updateStorageItems();
				}
			} catch(err) {
				updateStorageItems();
			}
			
		});
		return unsubscribe;
	}, []);
	
	try {
		return (
			<View style={styles.container}>
				{visible ? <Overlay data={storageItems} outsideTouch={() => setVisible(false)} /> : null}
				<View style={{flex: 1}}>
					{selectionBox ? <TouchableOpacity onPress={() => {setSelectionBox(false); setMergeItems([])}}>
	  						<Text style={{fontSize: 40, color: 'white', textAlign: 'right', paddingRight: 10}}>&times;</Text>
	  				</TouchableOpacity> : null}
	  				<View style={{margin: 5, paddingBottom: 40}}>
	  					<SearchBar 
	  						onTextChange={newText => {
	  							setSearchText(newText);
	  						}}
	  						value={searchText}
	  					/>
	  				</View>
	  				{storageItems.length == 0 ? 
	  					<View style={styles.Card}>
	  						<Text style={{padding: 5, fontSize: 30, color: 'white'}}>No Card Sets</Text>
							<Text style={{padding: 5, color: 'white'}}>Please use the Add Button below to create some card sets</Text>
	  					</View> : checkSearchResults(searchText) ? <FlatList
	  					data={storageItems}
	  					renderItem={({item}) => 
	  						<RevisionCard searchText={searchText} merge={setMergeItems} 
	  							mergeItems={mergeItems} selectionBox={selectionBox} key={storageItems.indexOf(item)} 
	  							data={storageItems} index={storageItems.indexOf(item)} 
	  							Play={() => navigation.navigate('Play', {
									i: 0,
								})}
								Edit={() => navigation.navigate('Other', {
									i: 0,
									n: data[0].card.length - 1
								})}
	  						/>
	  					}
	  					keyExtractor={(item) => storageItems.indexOf(item)}
	  					style={{marginBottom: 55}}
	  				/> : <NoResult />}
	  			</View>
	  			<BottomBar />
				<AddButton selectionBox={selectionBox} setSelectionBox={setSelectionBox} addLocalStorageItems={addLocalStorageItems}
				mergeCardSets={mergeCardSets} AddMultiple={() => navigation.navigate('AddMultiple')} storageItems={storageItems} />
				<StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
			</View>
		);
	} catch(err) {
		setInterval(() => {
			if (loadText == "Loading...") {
				setLoadText("Loading.")
			} else {
				setLoadText(loadText + '.');
			}
		}, 500)
		return (
			<View style={styles.container}>
				<View style={{flex: 1, margin: 5}}>
					<SearchBar 
	  					onTextChange={newText => {
	  						setSearchText(newText);
	  					}}
	  					value={searchText}
	  				/>
	  				<View style={{flex: 1, alignItems: 'center'}}>
	  					<Text style={{color: 'white', fontSize: 24, position: 'relative', top: -300}}>{loadText}</Text>
	  				</View>
	  				<BottomBar />
					<StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight
  },
  addButton: {
  	flex: 1,
  	position: 'absolute',
  	alignItems: 'center',
  	left: (Dimensions.get('window').width / 2) - 30,
  	bottom: 15,
  	zIndex: 2,
  	backgroundColor: '#0ed186',
  	width: 70,
  	height: 70,
  	borderRadius: 50,
  	overflow: 'hidden',
  	justifyContent: 'center'
  },
  addButtonText: {
  	fontSize: 40,
  	paddingBottom: 5
  },
  Card: {
  	flex: 1,
  	borderBottomWidth: 0.5,
  	borderColor: '#a0a0a0cc',
  	margin: 0,
  	borderStyle: 'dashed'
  },
  trash: {
  	position: 'absolute',
  	left: 310,
  	top: 7,
  },
  playButton: {
  	position: 'absolute',
  	left: 230,
  	top: -5,
  },
  editButton: {
  	position: 'absolute',
  	left: 270,
  	top: 7
  },
	addSecondary: {
		zIndex: 2,
		position: 'absolute',
		bottom: 10,
		left: (Dimensions.get('window').width / 2) - 80,
		backgroundColor: '#0ed186',
		borderRadius: 50,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	addTertiary: {
		zIndex: 2,
		position: 'absolute',
		bottom: 10,
		right: (Dimensions.get('window').width / 2) - 92,
		backgroundColor: '#0ed186',
		borderRadius: 50,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	reset: {
		position: 'absolute',
		left: '10%',
		bottom: '10%'
	}
});