import React, { Component } from 'react';
import { Dimensions, ScrollView, AsyncStorage, StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

export default class App extends Component {
  constructor(props) {
  	super(props);
  	if (!AsyncStorage.revisionCards) {
  		AsyncStorage.revisionCards = [{
  			title: 'No cards',
  			description: 'Please create some revision cards'
  		}];
  	}
  }
  revisionCard(index) {
	var x = [];
	x.push(
		<>
		<View style={styles.Card}>
			<Text style={{padding: 5, fontSize: 30}}>{AsyncStorage.revisionCards[index].title}</Text>
			<Text style={{padding: 5}}>{AsyncStorage.revisionCards[index].description}</Text>
		</View>
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
				this.forceUpdate();
			}}>
				<Text style={{fontSize: 30}}>🗑</Text>
			</TouchableOpacity>
		</View>
		</>
	);
	return <View>{x}</View>
  }
  allCards() {
  	let x = [];
  	try {
  		let len = AsyncStorage.revisionCards.length;
  		for (let i = 0; i < len; i++) {
  			x.push(<View>{this.revisionCard(i)}</View>);
  		}
  		return (
  			<ScrollView style={{flexGrow: 0.8}}>
  				<View>{x}</View>
  			</ScrollView>
  			)
  	} catch(err) {
  		return (
  			<View style={styles.Card}>
  				<Text style={{margin: 5, fontSize: 30, textAlign: 'left'}}>No cards</Text>
  			</View>
  		)
  	}
  }
  addLocalStorageItems() : void {
	if (AsyncStorage.revisionCards[0].title == 'No cards') {
		AsyncStorage.revisionCards = [];
	}
	AsyncStorage.revisionCards.push({title: 'Hello there', description: 'First revision set'},
	{title: 'Bye', description: 'Second revision set'}); //this is for testing 
  	this.forceUpdate();
  }
  render() {
  	return (
		<View style={styles.container}>
    		{this.allCards()}
    		<TouchableOpacity style={styles.addButton} 
    		onPress={() => this.addLocalStorageItems()}>
    			<Text style={styles.addButtonText}>+</Text>
    		</TouchableOpacity>
    		<StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent/>
    	</View>
	);
  }
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
  	margin: 5
  },
  trash: {
  	position: 'absolute',
  	left: 315,
  	top: -85,
  }
});