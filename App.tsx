import React, { Component } from 'react'
//import { StatusBar } from 'expo-status-bar';
import { AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

export default class App extends Component {
  revisionCard(index) {
	var x = [];
	x.push(
		<>
			<Text style={{padding: 5, fontSize: 30}}>{AsyncStorage.revisionCards[index].title}</Text>
			<Text style={{padding: 5}}>{AsyncStorage.revisionCards[index].description}</Text>
		</>
	);
	return <View style={{borderWidth: 1, borderColor: 'black', margin: 5}}>{x}</View>
  }
  allCards() {
  	let x = [];
  	try {
  		let len = AsyncStorage.revisionCards.length;
  		for (let i = 0; i < len; i++) {
  			x.push(<View>{this.revisionCard(i)}</View>);
  		}
  		return <View>{x}</View>
  	} catch(err) {
  		return <Text>No cards</Text>
  	}
  }
  addLocalStorageItems() : void {
	AsyncStorage.revisionCards = [{title: 'Hello there', description: 'First revision set'}, 
	{title: 'Bye', description: 'second revision set'}]; //this is for testing 
  	this.forceUpdate();
  }
  render() {
  	let cards = [];
	 return (
		<View style={styles.container}>
    		{this.allCards()}
    		<TouchableOpacity style={styles.addButton} 
    		onPress={() => this.addLocalStorageItems()}>
    			<Text style={styles.addButtonText}>+</Text>
    		</TouchableOpacity>
    		<StatusBar style="auto" />
    	</View>
	);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight / 3
  },
  addButton: {
  	position: 'absolute',
  	alignItems: 'center',
  	right: 10,
  	bottom: 10,
  	backgroundColor: 'red',
  	width: 100,
  	height: 100,
  	borderRadius: 50
  },
  addButtonText: {
  	textAlign: 'center',
  	fontSize: 60
  }
});
