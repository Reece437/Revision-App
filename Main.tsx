import React, { useState, useEffect, useCallback} from 'react';
import { Alert, TextInput, TouchableNativeFeedback, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from './SearchBar.tsx';

export default function App({navigation}) {
	const [selectionBox, setSelectionBox] = useState(false);
	const [mergeItems, setMergeItems] = useState([]);
	const [noCards, setNoCards] = useState(false);
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const [storageItems, setStorageItems] = useState();
	const [render, setRender] = useState(false);
	const [reRender, setReRender] = useState(true);
	
	// For testing purposes only 
	const ResetStorage: React.FC = () => (
		<TouchableOpacity style={styles.reset} 
		onPress={() => {
			AsyncStorage.clear()
			setNoCards(true);
		}}>
			<Text style={{color: 'white'}}>Clear</Text>
		</TouchableOpacity>
	);
	
	const NoResult = () => (
		<View style={styles.Card}>
			<Text style={{padding: 5, fontSize: 30, color: 'white'}}>No result</Text>
			<Text style={{padding: 5, color: 'white'}}>There aren't any card sets with this title</Text>
		</View>	
	);
	const removeUntitled = (data) => {
		try {
			for (let i = 0; i < data.length; i++) {
				if (data[i].title == '') {
					data[i].title = "Untitled";
				}
				if (data[i].description == '') {
					data[i].description = 'You didn\'t give me a description';
				}
			} return data;
		} catch(err) {
			return data;
		}
	}
	
	const duplicateCheck = (data): object[] => {
		let n: number = 1;
		data = removeUntitled(data);
		try {
			for (let i = 0; i < data.length; i++) {
				n = 1
				if (data[i].title == '') data[i].title = 'Untitled';
				for (let j = i + 1; j < data.length; j++) {
					if (data[i].title == data[j].title) {
						data[j].title += ` [${n}]`;
						n++
					}
				}
			}
		} catch(err) {
			//console.log(err.message);
			return data;
		}
		return data;
	}
	const isMergable = (data, index: number): boolean => {
		for (let i = 0; i < data[index].card.length; i++) {
			if (data[index].card[i].question != '' ||
			data[index].card[i].answer != '') return true;
		} return false;
	}
	const updateStorageItems = (): void => {
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			//console.log(data.length);
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
			setStorageItems(duplicateCheck(data));
		})
	}
	interface CheckBoxParameters {
		value: boolean;
		style?: object;
		onClick?: () => void;
		checkedBackgroundColor?: string;
	}
	const CheckBox: React.FC = (props: CheckBoxParameters) => {
		if (!props.value) {
			props.value = false;
		}
		return (
			<TouchableOpacity onPress={props.onClick}
			style={[{width: 40, height: 40, borderWidth: 1, borderColor: 'white', justifyContent: 'center', alignItems: 'center'}, {backgroundColor: props.value ? props.checkedBackgroundColor || 'blue' : null}, props.style || null]}>
				<Text style={{color: 'white', textAlign: 'center', fontSize: 25}}>{props.value ? '✓' : ''}</Text>
			</TouchableOpacity>
		);
	}
  	const RevisionCard = (props) => {
	let data = props.data;
	console.log('data in func ' + typeof(data));
	let index = props.index;
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
					(isMergable(data, index) ? <CheckBox value={value} onClick={() => {
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
						console.log(mergeItems);
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
										data.splice(index, 1);
										AsyncStorage.setItem('revisionCards', JSON.stringify(data));
										AsyncStorage.getItem('revisionCards').then(list => {
											list = JSON.parse(list)
											//console.log(list.length)
											if (list.length == 0) {
												setNoCards(true);
											}
										})
										setRenderComponent(false);
										//updateStorageItems();
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
					onPress={() => navigation.navigate('Play', {
						i: index
					})}>
						<Text style={{fontSize: 40, color: 'white'}}>▶</Text>
					</TouchableOpacity>
					<TouchableOpacity 
					style={styles.editButton}
					onPress={() => {
						navigation.navigate('Other', {
							i: index,
							n: data[index].card.length - 1
						})
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
  		console.log(err.message);
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
			data.push({
				title: '',
				description: ''
			});
			AsyncStorage.setItem('revisionCards', JSON.stringify(data))
			navigation.navigate('Other', {
				i: data.length - 1,
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
			//console.log(mergeItems);
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
    		data.push(newCardSet);
			AsyncStorage.setItem('revisionCards', JSON.stringify(data));
			setStorageItems(data);
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
			<ResetStorage />
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