import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, ListItem, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


AsyncStorage.getItem('revisionCards').then(data => {
	data = JSON.parse(data);
	console.log(data)
})

export default function Home({navigation}) {
	const [count, setCount] = useState(0)
	const [all, setAll] = useState();
	const [noCards, setNoCards] = useState(false);
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	
  	const RevisionCard = (data, index) => {
	console.log('data ' + data[index]);
	if (noCards) {
		return (
			<View 
  			style={styles.Card}>
					<Text style={{padding: 5, fontSize: 30}}>{data[index].title}</Text>
					<Text style={{padding: 5}}>{data[index].description}</Text>
			</View>	
		);
	} else {
		return (
			<View 
  				style={styles.Card}>
  				<View>
					<Text style={{padding: 5, fontSize: 30}}>{data[index].title}</Text>
					<Text style={{padding: 5}}>{data[index].description}</Text>
				</View>
				<View>
				<TouchableOpacity
					style={styles.trash}
					onPress={() => {
						data.splice(index, 1);
						console.log(data.length);
						AsyncStorage.setItem('revisionCards', JSON.stringify(data));
						AsyncStorage.getItem('revisionCards').then(list => {
							list = JSON.parse(list)
							console.log('list: ' + list.length);
							if (list.length == 0) {
								console.log('yes');
								AsyncStorage.setItem('revisionCards', JSON.stringify([{
									title: 'No card sets',
									description: 'Please create some revision card sets'
								}]));
								setNoCards(true);
							}
						})
						AllCards();
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
						<Text style={{fontSize: 40}}>▶</Text>
					</TouchableOpacity>
				</View>
				<View>
					<TouchableOpacity 
					style={styles.editButton}
					onPress={() => navigation.navigate('createCard', {
						i: index
					})}>
						<Text style={{fontSize: 30}}>✏️</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
  }
  const AllCards = () => {
  	var x = [];
  	try {
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			//if (typeof(data) == 'object')
			let len = data.length;
			for (let i = 0; i < len; i++) {
  				x.push(<View key={i}>{RevisionCard(data, i)}</View>)
  			}
  			setAll(<ScrollView style={{flexGrow: 0.8}}>{x}</ScrollView>);
		})
	} catch(err) {
  		console.log(err.message)
  		setAll(<View>Error</View>)
  	}
  }
	const addLocalStorageItems = () => {
		if (noCards) {
			AsyncStorage.clear()
			AsyncStorage.setItem('revisionCards', JSON.stringify([]))
		}
		AsyncStorage.getItem('revisionCards').then(data => {
			if (data == null) {
				data = [];
			} else {
				data = JSON.parse(data)
			}
			data.push({title: 'new', description: 'this is new'});
			AsyncStorage.setItem('revisionCards', JSON.stringify(data))
		})
		setNoCards(false);
		setCount(count + 1);
		//AllCards();
		/*AsyncStorage.revisionCards.push({
			title: '',
			description: ''
		});
		navigation.navigate('Other', {
			i: AsyncStorage.revisionCards.length - 1
		})*/
	}
	useEffect(() => {
		AsyncStorage.getItem('revisionCards').then(data => {
  		if (data == null) {
  			console.log('null')
  			AsyncStorage.setItem('revisionCards', JSON.stringify([{
  				title: 'No card sets',
  				description: 'Please create some card sets'
  			}]))
  			setNoCards(true);
  		}
  		}).then(() => AllCards());
	}, [count, noCards])
	return (
		<View style={styles.container}>
			{all}
			<TouchableOpacity 
			style={styles.addButton}
			onPress={() => addLocalStorageItems()}>
				<Text style={styles.addButtonText}>+</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {
				AsyncStorage.clear();
				AsyncStorage.setItem('revisionCards', JSON.stringify([{
					title: 'No card sets',
					description: 'Please create some card sets'
				}]));
				setNoCards(true);
				forceUpdate();
			}}>
				<Text>Clear all</Text>
			</TouchableOpacity>
		</View>
	);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  	borderColor: 'black',
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
  	top: -95
  },
  editButton: {
  	position: 'absolute',
  	left: 275,
  	top: -86
  }
});