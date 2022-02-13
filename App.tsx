import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, ScrollView, AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { createCard } from './createCard.tsx';
import { useIsFocused } from '@react-navigation/native';


export default function App({navigation}) {
  const [noCards, setNoCards] = useState(false);
  const isFocused = useIsFocused();
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  if (!AsyncStorage.revisionCards) {
  	AsyncStorage.revisionCards = [{
  		title: 'No card sets',
  		description: 'Please create some revision card sets'
  	}];
  	setNoCards(true);
  }
  
  const revisionCard = index => {
	let x: any = [];
	if (AsyncStorage.revisionCards[index].title == '') {
		AsyncStorage.revisionCards[index].title = 'Untitled'
	}
	if (AsyncStorage.revisionCards[index].description == '') {
		AsyncStorage.revisionCards[index].description = "You didn't give me a description";
	}
	x.push(
		<>
		<View style={styles.Card}>
			<Text style={{padding: 5, fontSize: 30}}>{AsyncStorage.revisionCards[index].title}</Text>
			<Text style={{padding: 5}}>{AsyncStorage.revisionCards[index].description}</Text>
		</View>
		</>
		)
	if (!noCards) {
	x.push(
		<>
		<View>
			<TouchableOpacity 
			style={styles.trash}
			onPress={() => {
				AsyncStorage.revisionCards.splice(index, 1);
				if (AsyncStorage.revisionCards.length == 0) {
					AsyncStorage.revisionCards = [{
						title: 'No card sets',
						description: 'Please create some revision card sets'
					}]
					setNoCards(true);
				}
				forceUpdate();
			}}>
				<Text style={{fontSize: 30}}>🗑</Text>
			</TouchableOpacity>
		</View>
		<View>
			<TouchableOpacity style={styles.playButton}
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
		</>
	)
	}
	return <View>{x}</View>
  }
  const allCards = () => {
  	let x: any = [];
  	try {
  		let len = AsyncStorage.revisionCards.length;
  		for (let i = 0; i < len; i++) {
  			x.push(<View>{revisionCard(i)}</View>);
  		}
  		return (
  			<ScrollView style={{flexGrow: 0.8}}>
  				<View>{x}</View>
  			</ScrollView>
  			)
  	} catch(err) {
  		//alert(err.message);
  		return (
  			<View style={styles.Card}>
  				<Text style={{margin: 5, fontSize: 30, textAlign: 'left'}}>No cards</Text>
  			</View>
  		)
  	}
  }
  const addLocalStorageItems = () => {
	if (noCards) {
		AsyncStorage.revisionCards = [];
		setNoCards(false);
	}
	
	AsyncStorage.revisionCards.push({
		title: '',
		description: ''
	});
	navigation.navigate('createCard', {
		i: AsyncStorage.revisionCards.length - 1
	})
  }
  return (
		<View style={styles.container}>
    		{isFocused ? allCards() : null}
    		<TouchableOpacity style={styles.addButton} 
    		onPress={() => addLocalStorageItems()}>
    			<Text style={styles.addButtonText}>+</Text>
    		</TouchableOpacity>
    		<StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent/>
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
  	left: 315,
  	top: -85,
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