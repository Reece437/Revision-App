import React, { useState, useCallback } from 'react';
import { Dimensions, ScrollView, AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { createCard } from './createCard.tsx';

export default function App({navigation}) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  if (!AsyncStorage.revisionCards) {
  	AsyncStorage.revisionCards = [{
  		title: 'No cards',
  		description: 'Please create some revision cards'
  	}];
  }
  const revisionCard = index => {
	var x = [];
	x.push(
		<>
		<View style={styles.Card}>
			<Text style={{padding: 5, fontSize: 30}}>{AsyncStorage.revisionCards[index].title}</Text>
			<Text style={{padding: 5}}>{AsyncStorage.revisionCards[index].description}</Text>
		</View>
		</>
		)
	if (AsyncStorage.revisionCards[index].title != 'No cards') {
	x.push(
		<>
		<View>
			<TouchableOpacity 
			style={styles.trash}
			onPress={() => {
				AsyncStorage.revisionCards.splice(index, 1);
				if (AsyncStorage.revisionCards.length == 0) {
					AsyncStorage.revisionCards = [{
						title: 'No cards',
						description: 'Please create some revision cards'
					}]
				}
				forceUpdate();
			}}>
				<Text style={{fontSize: 30}}>🗑</Text>
			</TouchableOpacity>
		</View>
		<View>
			<TouchableOpacity style={styles.playButton}>
				<Text style={{fontSize: 40}}>▶</Text>
			</TouchableOpacity>
		</View>
		<View>
			<TouchableOpacity 
			style={styles.editButton}
			onPress={() => navigation.navigate('createCard',)}>
				<Text style={{fontSize: 30}}>✏️</Text>
			</TouchableOpacity>
		</View>
		</>
	)
	}
	return <View>{x}</View>
  }
  const allCards = () => {
  	let x = [];
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
  		alert(err.message);
  		return (
  			<View style={styles.Card}>
  				<Text style={{margin: 5, fontSize: 30, textAlign: 'left'}}>No cards</Text>
  			</View>
  		)
  	}
  }
  const addLocalStorageItems = () => {
	if (AsyncStorage.revisionCards[0].title == 'No cards') {
		AsyncStorage.revisionCards = [];
	}
	AsyncStorage.revisionCards.push({title: 'Hello there', description: 'First revision set'},
	{title: 'Bye', description: 'Second revision set'}); //this is for testing 
  	forceUpdate();
  }
  return (
		<View style={styles.container}>
    		{allCards()}
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