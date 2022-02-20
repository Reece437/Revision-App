import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, TouchableWithoutFeedback, TouchableNativeFeedback, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App({navigation}) {
	const [selectionBox, setSelectionBox] = useState(false);
	const [noCards, setNoCards] = useState(false);
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const [storageItems, setStorageItems] = useState();
	const [render, setRender] = useState(false);
	
	const CheckBox = (props: {value: boolean, onPress: function, style: object}) => {
		if (!props.value) {
			props.value = false;
		}
		return (
			<TouchableOpacity onPress={props.onPress}
			style={[{width: 20, height: 20, borderWidth: 1, borderColor: 'white'}, props.style || null]}>
				<Text style={{color: 'white'}}>{props.value ? '/' : ''}</Text>
			</TouchableOpacity>
		);
	}
  	const RevisionCard = (data: object[], index: number) => {
	const [value, setValue] = useState(false);
	if (data[index].title == '' ) {
		data[index].title = 'Untitled';
		AsyncStorage.setItem('revisionCards', JSON.stringify(data));
	}
	if (data[index].description == '' ) {
		data[index].description = "You didn't give me a description";
		AsyncStorage.setItem('revisionCards', JSON.stringify(data));
	}
	if (noCards) {
		return (
			<View 
  			style={styles.Card}>
					<Text style={{padding: 5, fontSize: 30, color: 'white'}}>{data[index].title}</Text>
					<Text style={{padding: 5, color: 'white'}}>{data[index].description}</Text>
			</View>	
		);
	} else {
		return (
			<View 
  				style={styles.Card}>
  				<View>
					<Text style={{padding: 5, fontSize: 30, color: 'white'}}>{data[index].title}</Text>
					{selectionBox ? <CheckBox value={value} onPress={() => setValue(!value)} style={{marginLeft: 5}} /> : null}
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
											console.log(list.length)
											if (list.length == 0) {
												setNoCards(true);
											}
										})
										forceUpdate();
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
					onPress={() => navigation.navigate('Other', {
						i: index,
						n: 0,
					})}>
						<Text style={{fontSize: 30}}>✏️</Text>
					</TouchableOpacity>
				</View> : null}
			</View>
		);
	}
  }
  const AllCards = () => {
  	let x: object[] = [];
  	try {
			let len: number = storageItems.length;
			console.log(len)
			if (len == 0) {
				return(<ScrollView style={{flexGrow: 0.8}}>{RevisionCard([{
					title: 'No card sets',
					description: 'Please create some card sets'
				}], 0)}</ScrollView>)
			} else {
				for (let i = 0; i < len; i++) {
  					x.push(<View key={i}>{RevisionCard(storageItems, i)}</View>)
  				}
  				return(<ScrollView style={{flexGrow: 0.8}}>{x}</ScrollView>);
			}
	} catch(err) {
  		console.log(err.message)
  		return(<Text style={{color: 'white'}}>Error</Text>)
  	}
  }
	const addLocalStorageItems = (): void => {
		if (noCards) {
			AsyncStorage.clear()
			AsyncStorage.setItem('revisionCards', JSON.stringify([]));
			setNoCards(false);
		}
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
		setSelectionBox(true);
		//return;
	}
	useEffect(() => {
		navigation.addListener('focus', () => {
			AsyncStorage.getItem('revisionCards').then(data => {
				data = JSON.parse(data);
				if (data.length == 0 || data.length == undefined) {
  					setNoCards(true);
  				}
				setStorageItems(data);
			})
			setRender(false);
			forceUpdate();
		});
	});
	return (
		<View style={styles.container}>
			<AllCards />
			<TouchableNativeFeedback
			background={TouchableNativeFeedback.Ripple('#a7a7a7', false, )}
			onPress={() => setRender(!render)}>
			<View style={styles.addButton}>
				<Text style={styles.addButtonText}>+</Text>
			</View>
			</TouchableNativeFeedback>
			{render && !selectionBox ? <TouchableOpacity style={styles.addSecondary}
			onPress={() => addLocalStorageItems()}>
				<Text style={{textAlign: 'center'}}>New</Text>
			</TouchableOpacity> : null}
			{render && !selectionBox ? <TouchableOpacity style={styles.addTertiary}
			onPress={() => {setSelectionBox(true); setRender(false)}}>
				<Text style={{textAlign: 'center'}}>Merge</Text>
			</TouchableOpacity> : null}
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
  	fontSize: 60
  },
  Card: {
  	borderWidth: 1,
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
	}
});