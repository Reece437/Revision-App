import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Dimensions, TextInput, TouchableNativeFeedback, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Animated, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar, CheckBox, BottomBar } from '../components/MainComponents';
import {
	isMergable,
	removeUntitled,
	titleLengthFix,
	duplicateCheck
} from '../functions/MainFunctions';
import { auth, db } from '../firebase';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';



export default function App({navigation}) {
	const [selectionBox, setSelectionBox] = useState(false);
	const [mergeItems, setMergeItems] = useState([]);
	const [noCards, setNoCards] = useState(false);
	const [storageItems, setStorageItems] = useState();
	
	const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
	const AnimatedTouchableNativeFeedback = Animated.createAnimatedComponent(TouchableNativeFeedback);
	
	
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
	
	const RevisionCard = (props) => {
		let {data, index} = props;
		const [value, setValue] = useState(false);
		const [renderComponent, setRenderComponent] = useState(true);
		
		console.log(index)
		
		// This is used to stop the search bar from emptying on removal of card set
		if (renderComponent) {  
			if (data.length == undefined) {
				return (
					<View style={styles.Card}>
						<Text style={{padding: 5, fontSize: 30, color: 'white'}}>No card sets</Text>
						<Text style={{padding: 5, color: 'white'}}>Please create some card sets</Text>
					</View>	
				);
			} else {
				return (
					<>
			  			<View>
							{selectionBox ?  
							(isMergable(data, index) ? 
							<View style={styles.Card}>
							<Text style={{padding: 5, fontSize: 24, color: 'white', width: '65%'}}>{data[index].title}</Text>
							<Text style={{padding: 5, color: 'white', fontSize: 15}}>{data[index].description}</Text>
							<CheckBox value={value} 
							onClick={() => {
								let y = !value;
								if (y) {
									let x = mergeItems;
									x.push(index);
									setMergeItems(x); 
								} else {
									let x = mergeItems;
									for (let i: number = 0; i < x.length; i++) {
										if (x[i] == index) {
											x.splice(i, 1);
											break;
										}
									}
									setMergeItems(x);
								}
								setValue(!value);
							}} style={{marginLeft: 5}} />
							</View>: <View style={styles.Card}> 
							<Text style={{padding: 5, fontSize: 24, color: 'white', width: '65%'}}>{data[index].title}</Text>
							<Text style={{padding: 5, fontSize: 15, color: 'white'}}>No cards in this set</Text>
							</View>) : null}
						</View>
						{!selectionBox ? <View style={styles.Card}>
						<Text style={{padding: 5, fontSize: 24, color: 'white', width: '65%'}}>{data[index].title}</Text>
						<Text style={{padding: 5, color: 'white', fontSize: 15}}>{data[index].description}</Text>
						<TouchableOpacity
							style={styles.trash}
							onPress={() => {
								Alert.alert(
									'Are you sure you want to delete this set?',
									'Choose one of the following:',
									[
										{
											text: 'Yes, delete',
											onPress: () => {
												data.splice(index, 1);
												db.collection('users').doc(auth.currentUser?.uid).set({data});
												updateStorageItems();
												//setRenderComponent(false)
											}
										},
										{
											text: 'No, keep',
											style: 'cancel'
										}
									]
								)
								
							}}>
								<Text style={{fontSize: 30}}>🗑</Text>
							</TouchableOpacity>
							<TouchableOpacity 
							style={styles.playButton}
							onPress={() => {
								db.collection('users').doc(auth.currentUser?.uid).get().then(doc => {
									data = doc.data().data;
									let firstCardSet = data[index];
									data.splice(index, 1);
									data.unshift(firstCardSet);
									db.collection('users').doc(auth.currentUser?.uid).set({data})
									navigation.navigate('Play', {
										i: 0,
									});
								});
							}}>
								<Text style={{fontSize: 40, color: 'white'}}>▶</Text>
							</TouchableOpacity>
							<TouchableOpacity 
							style={styles.editButton}
							onPress={() => {
								db.collection('users').doc(auth.currentUser?.uid).get().then(doc => {
									data = doc.data().data
									let firstCardSet = data[index];
									data.splice(index, 1);
									data.unshift(firstCardSet);
									db.collection('users').doc(auth.currentUser?.uid).set({data})
									navigation.navigate('Other', {
										i: 0,
										n: data[0].card.length - 1
									});
								});
							}}>
								<Text style={{fontSize: 30}}>✏️</Text>
							</TouchableOpacity>
						</View> : null}
					</>
				);
			}
		} else {
			return false;
		}
	}
	
	checkSearchResults = (searchText) => {
		for (let i = 0; i < storageItems.length; i++) {
			if (storageItems[i].title.toLowerCase().includes(searchText.toLowerCase())) {
				return true;
			}
		} return false;
	}
	
	const AllCards = () => {
	  	const [searchText, setSearchText] = useState("");
	  	const [loadText, setLoadText] = useState("Loading.")
	  	let data = storageItems;
	  	let x: object[] = [];
		let len;
		try {
			len = storageItems.length;
		} catch(err) {
			setInterval(() => {
				if (loadText == "Loading...") {
					setLoadText("Loading.")
				} else {
					setLoadText(loadText + '.');
				}
			}, 500)
			return (
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
				</View>
			);
		}
		//console.log(len)
		if (len == 0) {
			return (
				<View style={styles.Card}>
					<Text style={{padding: 5, fontSize: 30, color: 'white'}}>No card sets</Text>
					<Text style={{padding: 5, color: 'white'}}>Please create some card sets</Text>
				</View>	
			);
		} else {
			if (selectionBox) {
				return (
					<View style={{flex: 1}}>
	  					<TouchableOpacity onPress={() => {setSelectionBox(false); setMergeItems([])}}>
	  						<Text style={{fontSize: 40, color: 'white', textAlign: 'right', paddingRight: 10}}>&times;</Text>
	  					</TouchableOpacity>
	  					<View style={{margin: 5, paddingBottom: 40}}>
	  						<SearchBar 
	  							onTextChange={newText => {
	  								setSearchText(newText);
	  							}}
	  							value={searchText}
	  						/>
	  					</View>
	  					{checkSearchResults(searchText) ? <FlatList
	  						data={storageItems}
	  						renderItem={({item}) => {
	  							if (item.title.toLowerCase().includes(searchText.toLowerCase())) {
	  								return <RevisionCard key={storageItems.indexOf(item)} data={storageItems} index={storageItems.indexOf(item)} />
	  							}
	  						}}
	  						keyExtractor={(item) => storageItems.indexOf(item)}
	  						style={{marginBottom: 55}}
	  					/> : <NoResult />}
	  				</View>
  				);
			} else {
				return (
					<View style={{flex: 1}}>
	  					<View style={{margin: 5, paddingBottom: 40}}>
	  						<SearchBar 
	  							onTextChange={newText => {
	  								setSearchText(newText);
	  							}}
	  							value={searchText}
	  						/>
	  					</View>
	  					{checkSearchResults(searchText) ? <FlatList
	  						data={storageItems}
	  						renderItem={({item}) => {
	  							if (item.title.toLowerCase().includes(searchText.toLowerCase())) {
	  								return <RevisionCard key={storageItems.indexOf(item)} data={storageItems} index={storageItems.indexOf(item)} />
	  							}
	  						}}
	  						keyExtractor={(item) => storageItems.indexOf(item)}
	  						style={{marginBottom: 55}}
	  					/> : <NoResult />}
	  				</View>
				);
			}
		}
		/*else {
			for (let i = 0; i < len; i++) {
				if ((data[i].title.toLowerCase()).includes(searchText.toLowerCase())) {
					x.push(<RevisionCard key={i} data={storageItems} index={i} />);
				}
  			}
  			if (x.length == 0) {
  				x.push(<NoResult />)
  			}
  			if (selectionBox) {
  				return (
  					<View style={{flex: 1}}>
  						<TouchableOpacity onPress={() => {setSelectionBox(false); setMergeItems([])}}>
  							<Text style={{fontSize: 40, color: 'white', textAlign: 'right', paddingRight: 10}}>&times;</Text>
  						</TouchableOpacity>
  						<View style={{margin: 5, paddingBottom: 40}}>
  							<SearchBar 
  								onTextChange={newText => {
  									setSearchText(newText);
  								}}
  								value={searchText}
  							/>
  						</View>
  						<ScrollView style={{flexGrow: 0.9}}>{x}</ScrollView>
  					</View>
  				);
  			}
  			return (
  				<View style={{flex: 1}}>
  					<View style={{margin: 5, paddingBottom: 40}}>
  						<SearchBar 
  							onTextChange={newText => {
  								setSearchText(newText);
  							}}
  							value={searchText}
  						/>
  					</View>
  					<ScrollView style={{flexGrow: 0.9}}>
  						{x}
  					</ScrollView>
  				</View>
  			);
		}*/
	}
	
	const addLocalStorageItems = (): void => {
		let data = storageItems;
		data.unshift({
			title: '',
			description: ''
		});
		db.collection('users').doc(auth.currentUser?.uid).set({data});
		updateStorageItems();
		navigation.navigate('Other', {
			i: 0,
			n: 0
		})
	}
	
	const mergeCardSets = () => {
		if (mergeItems.length <= 1) {
			alert("You haven't selected enough sets to merge");
			return;
		}
		let data = storageItems;
		mergeItems.sort();
		let newCardSet = {
			title: 'Merged card set',
			description: 'This is a merged card set'
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
	}
	const AddButton = () => {
		const [render, setRender] = useState(false);
		const scaleValue = useRef(new Animated.Value(0)).current;
		
		useEffect(() => {
			if (render) {
				Animated.spring(scaleValue, {
					friction: 6,
					useNativeDriver: true,
					toValue: 1
				}).start()
			} else {
				Animated.spring(scaleValue, {
					friction: 6,
					useNativeDriver: true,
					toValue: 0
				}).start()
			}
		}, [render]);
		
		return (
			<>
			{!selectionBox ? <AnimatedTouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 35)}
				onPress={() => setRender(!render)}>
				<View style={styles.addButton}>
					<Text style={[styles.addButtonText]}>+</Text>
				</View>
			</AnimatedTouchableNativeFeedback> : null}
			{!selectionBox ? <AnimatedTouchableOpacity style={[styles.addSecondary, {transform: [{scale: scaleValue}]}]}
				onPress={() => addLocalStorageItems()}>
				<Icon name="create-outline" size={24} />
			</AnimatedTouchableOpacity> : null}
			{!selectionBox ? <AnimatedTouchableOpacity style={[styles.addTertiary, {transform: [{scale: scaleValue}]}]}
				onPress={() => {
				if (storageItems.length <= 1) {
					alert("You don't have enough card sets to use the merge feature");
					setRender(false);
				} else {
					setSelectionBox(true); setRender(false)
				}
			}}>
				<Icon name="git-network-outline" size={24} />
			</AnimatedTouchableOpacity> : null}
			{selectionBox ? <TouchableNativeFeedback
			background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 50)}
			onPress={() => mergeCardSets()}>
			<View style={styles.addButton}>
				<Icon name="git-network-outline" size={40} />
			</View>
			</TouchableNativeFeedback> : null}
			</>
		);
	}
	
	useEffect(() => {
		const unsubscribe = db.collection('users').doc(auth.currentUser?.uid).onSnapshot(doc => {
			updateStorageItems();
		});
		return unsubscribe;
	}, [])
	
	return (
		<View style={styles.container}>
			<AllCards />
			{/*<ResetStorage />*/}
			<AddButton />
			<BottomBar />
			<StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
		</View>
	);
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