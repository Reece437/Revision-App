import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Dimensions, ListItem, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App({navigation}) {
	const [noCards, setNoCards] = useState(false);
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const [storageItems, setStorageItems] = useState();
	const [render, setRender] = useState(false);
	
  	const RevisionCard = (data, index) => {
	//console.log('data ' + data[index]);
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
					<Text style={{padding: 5, color: 'white'}}>{data[index].description}</Text>
				</View>
				<View>
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
				</View>
				<View >
					<TouchableOpacity 
					style={styles.playButton}
					onPress={() => navigation.navigate('Play', {
						i: index
					})}>
						<Text style={{fontSize: 40, color: 'white'}}>▶</Text>
					</TouchableOpacity>
				</View>
				<View>
					<TouchableOpacity 
					style={styles.editButton}
					onPress={() => navigation.navigate('Other', {
						i: index,
						n: 0,
					})}>
						<Text style={{fontSize: 30}}>✏️</Text>
					</TouchableOpacity>
				</View>
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
	const addLocalStorageItems = () => {
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
		return;
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
			forceUpdate();
		});
	});
	return (
		<View style={styles.container}>
			<AllCards />
			<TouchableOpacity 
			style={styles.addButton}
			onPress={() => setRender(!render)}>
				<Text style={styles.addButtonText}>+</Text>
			</TouchableOpacity>
			{render ? <TouchableOpacity style={styles.addSecondary}
			onPress={() => addLocalStorageItems()}>
				<Text style={{textAlign: 'center'}}>New</Text>
			</TouchableOpacity> : null}
			{render ? <TouchableOpacity style={styles.addTertiary}>
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
  	borderRadius: 50
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
		right: 35
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