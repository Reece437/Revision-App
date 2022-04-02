import React, { useState, useEffect, useCallback} from 'react';
import { Alert, TextInput, TouchableNativeFeedback, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar, CheckBox } from './components/MainComponents';
import {
	isMergable,
	removeUntitled,
	titleLengthFix,
	duplicateCheck
} from './functions/MainFunctions';

export default function App({navigation}) {
	const [selectionBox, setSelectionBox] = useState(false);
	const [mergeItems, setMergeItems] = useState([]);
	const [noCards, setNoCards] = useState(false);
	const [, updateState] = React.useState();
	//const forceUpdate = React.useCallback(() => updateState({}), []);
	const [storageItems, setStorageItems] = useState();
	const [render, setRender] = useState(false);
	const [reRender, setReRender] = useState(true);
	
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
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			try {
				if (data.length == 0 || data.length == undefined) {
	  				console.log("yes");
	  				setNoCards(true);
				}
			} catch(err) {
				console.log("error");
				AsyncStorage.setItem('revisionCards', JSON.stringify([]));
				setNoCards(true);
			}
			setStorageItems(titleLengthFix(duplicateCheck(data)));
		})
	}
	const RevisionCard = (props) => {
		let {data, index} = props;
		const [value, setValue] = useState(false);
		const [renderComponent, setRenderComponent] = useState(true);
		
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
					<View style={styles.Card}>
			  			<View>
							<Text style={{padding: 5, fontSize: 30, color: 'white'}}>{data[index].title}</Text>
							{selectionBox ?  
							(isMergable(data, index) ? 
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
							}} style={{marginLeft: 5}} /> : <Text style={{color: 'white', paddingLeft: 5}}>No cards in this set</Text>) : null}
							<Text style={{padding: 5, color: 'white'}}>{data[index].description}</Text>
						</View>
						{!selectionBox ? <View>
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
												AsyncStorage.getItem('revisionCards').then(data => {
													data = JSON.parse(data);
													data.splice(index, 1);
													AsyncStorage.setItem('revisionCards', JSON.stringify(data));
												});
												let cardSets = storageItems;
												cardSets.splice(index, 1);
												setStorageItems(cardSets);
												setRenderComponent(false);
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
								AsyncStorage.getItem('revisionCards').then(data => {
									data = JSON.parse(data)
									let firstCardSet = data[index];
									data.splice(index, 1);
									data.unshift(firstCardSet);
									AsyncStorage.setItem('revisionCards', JSON.stringify(data));
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
								AsyncStorage.getItem('revisionCards').then(data => {
									data = JSON.parse(data)
									let firstCardSet = data[index];
									data.splice(index, 1);
									data.unshift(firstCardSet);
									AsyncStorage.setItem('revisionCards', JSON.stringify(data));
									navigation.navigate('Other', {
										i: 0,
										n: data[0].card.length - 1
									});
								});
							}}>
								<Text style={{fontSize: 30}}>✏️</Text>
							</TouchableOpacity>
						</View> : null}
					</View>
				);
			}
		} else {
			return false;
		}
	}
	const AllCards = () => {
	  	const [searchText, setSearchText] = useState("");
	  	let data = storageItems;
	  	console.log(noCards)
	  	let x: object[] = [];
	  	try {
			let len: number = storageItems.length;
			//console.log(len)
			if (len == 0) {
				return (
					<ScrollView style={{flexGrow: 0.8}}>{RevisionCard([{
						title: 'No card sets',
						description: 'Please create some card sets'
					}], 0)}</ScrollView>);
			} else {
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
	  									setSearchText(newText.toLowerCase());
	  								}}
	  								value={searchText}
	  							/>
	  						</View>
	  						<ScrollView style={{flexGrow: 0.8}}>{x}</ScrollView>
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
	  					<ScrollView style={{flexGrow: 0.8}}>
	  						{x}
	  					</ScrollView>
	  				</View>
	  			);
			}
		} catch(err) {
	  		setNoCards(true)
	  		return (
	  			<View style={styles.Card}>
					<Text style={{padding: 5, fontSize: 30, color: 'white'}}>No card sets</Text>
					<Text style={{padding: 5, color: 'white'}}>Please create some card sets</Text>
				</View>	
			);
	  	}
	}
	const addLocalStorageItems = (): void => {
		setNoCards(false);
		setRender(false);
		setReRender(true);
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			data.unshift({
				title: '',
				description: ''
			});
			AsyncStorage.setItem('revisionCards', JSON.stringify(data))
			navigation.navigate('Other', {
				i: 0,
				n: 0
			})
		});
	}
	const mergeCardSets = () => {
		if (mergeItems.length <= 1) {
			alert("You haven't selected enough sets to merge");
			return;
		}
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
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
			AsyncStorage.setItem('revisionCards', JSON.stringify(data));
			updateStorageItems();
		})
		setMergeItems([]);
		setSelectionBox(false);
	}
	useEffect(() => {
		navigation.addListener('focus', () => {
			if (reRender) {
				updateStorageItems();
				setReRender(false);
			}
		});
	});
	return (
		<View style={styles.container}>
			<AllCards />
			{/*<ResetStorage />*/}
			{!selectionBox ? <TouchableNativeFeedback
			background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 50)}
			onPress={() => setRender(!render)}>
			<View style={styles.addButton}>
				<Text style={styles.addButtonText}>+</Text>
			</View>
			</TouchableNativeFeedback> : null}
			{render && !selectionBox ? <TouchableOpacity style={styles.addSecondary}
			onPress={() => addLocalStorageItems()}>
				<Text style={{textAlign: 'center', fontWeight: 'bold'}}>NEW</Text>
			</TouchableOpacity> : null}
			{render && !selectionBox ? <TouchableOpacity style={styles.addTertiary}
			onPress={() => {
				if (storageItems.length <= 1) {
					alert("You don't have enough card sets to use the merge feature");
					setRender(false);
				} else {
					setSelectionBox(true); setRender(false)
				}
			}}>
				<Text style={{textAlign: 'center', fontWeight: 'bold'}}>MERGE</Text>
			</TouchableOpacity> : null}
			{selectionBox ? <TouchableNativeFeedback
			background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 50)}
			onPress={() => mergeCardSets()}>
			<View style={styles.addButton}>
				<Text style={[styles.addButtonText, {fontSize: 20, paddingTop: 30, fontWeight: 'bold'}]}>MERGE</Text>
			</View>
			</TouchableNativeFeedback> : null}
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
  	position: 'absolute',
  	alignItems: 'center',
  	right: 10,
  	bottom: 10,
  	backgroundColor: '#64daf8',
  	width: 100,
  	height: 100,
  	borderRadius: 50,
  	overflow: 'hidden'
  },
  addButtonText: {
  	textAlign: 'center',
  	fontSize: 60,
  },
  Card: {
  	borderWidth: 2,
  	borderColor: 'white',
  	margin: 5,
  	borderRadius: 10
  },
  trash: {
  	position: 'absolute',
  	left: 310,
  	top: -80,
  },
  playButton: {
  	position: 'absolute',
  	left: 230,
  	top: -91,
  },
  editButton: {
  	position: 'absolute',
  	left: 275,
  	top: -80
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
	addButton1: {
		position: 'absolute',
		bottom: '15%',
		right: 35,
	},
	addButton2: {
		position: 'absolute',
		bottom: '25%',
		right: 35
	},
	addSecondary: {
		zIndex: 1,
		position: 'absolute',
		bottom: '15%',
		right: 35,
		backgroundColor: '#64daf8',
		borderRadius: 50,
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	addTertiary: {
		position: 'absolute',
		bottom: '22%',
		right: 35,
		backgroundColor: '#64daf8',
		borderRadius: 50,
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	reset: {
		position: 'absolute',
		left: '10%',
		bottom: '10%'
	}
});