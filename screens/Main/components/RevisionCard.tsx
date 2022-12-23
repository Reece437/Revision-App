import { useState, useRef } from 'react';
import { StyleSheet, StatusBar, Dimensions, View, TouchableWithoutFeedback, TouchableOpacity, Text, Alert } from 'react-native';
import { isMergable } from '../MainFunctions'
import { CheckBox } from './MainComponents'
import { auth, db } from '../../../firebase'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const setLastAttempted = () => {
	const date = new Date();
	
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	let hour = (date.getHours()).toString();
	let minute = (date.getMinutes()).toString();
	
	if (minute.length == 1) {
		minute = "0" + minute;
	}
	
	if (hour.length == 1) {
		hour = "0" + hour;
	}
	
	return {
		day: day,
		month: month,
		year: year,
		hour: hour,
		minute: minute
	}
}

const calculateLastAttempt = (data, index) => {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	
	const info = data[index].lastAttempted
	
	if (info === null) {
		return "Has not been attempted"
	}
	
	let dateString;
	if (day == info.day && month == info.month && year == info.year) {
		dateString = "Today";
	} else if (day == info.day + 1 && month == info.month && year == info.year) {
		dateString = "Yesterday";
	} else {
		dateString = `${info.day}/${info.month}/${info.year}`;
	}
	
	return `${dateString} at ${info.hour}:${info.minute}`
}

export const RevisionCard = (props) => {
	let {data, index, selectionBox, searchText, merge, mergeItems} = props;
	const [value, setValue] = useState(mergeItems.includes(index));
	const [renderComponent, setRenderComponent] = useState(true);
	const scaleValue = useSharedValue(0);
	
	const animation = () => {
		scaleValue.value = 1
		setTimeout(() => {
			scaleValue.value = 0
		}, 3400)
	}
	
	const scaleValueStyle = useAnimatedStyle(() => {
		return {
			transform: [{scale: withTiming(scaleValue.value, {
				duration: 400
			})}]
		}
	});
	
	const QuestionInfo = () => {
		
		let correct = 0;
		let incorrect = 0;
		let notAnswered = 0;
		let total;
		try {
			total = data[index].card.length;
		} catch (err) {
			return null;
		}
		for (let i = 0; i < total; i++) {
			switch (data[index].card[i].isCorrect) {
				case true:
					correct += 1;
					break;
				case false:
					incorrect += 1;
					break;
				default: 
					notAnswered += 1;
					break;
			}
		}
		
		return (
			<View>
				<TouchableWithoutFeedback style={{flex: 1}}
				onPress={animation}>
					<View style={{flex: 1, flexDirection: 'row', opacity: 0.6}}>
						<View style={{backgroundColor: 'green', height: 8, width: `${(correct / total) * 100}%` }} />
						<View style={{backgroundColor: '#af0000', height: 8, width: `${(incorrect / total) * 100}%` }} />
						<View style={{backgroundColor: '#565656', height: 8, width: `${(notAnswered / total) * 100}%`}} />
					</View>
				</TouchableWithoutFeedback>
				<BoxInfo styled={scaleValueStyle} correct={correct} incorrect={incorrect} notAnswered={notAnswered} />
			</View>
		);
	}
	
	const BoxInfo = ({correct, incorrect, notAnswered, styled}) => {
		return (
			<Animated.View style={[styled, {width: 120, height: 60, backgroundColor: 'black', borderRadius: 10, borderWidth: 2, borderColor: 'white', position: 'absolute', zIndex: 10, marginTop: 15, marginLeft: 5, padding: 5}]}>
				<Text style={{fontSize: 12, color: 'white'}}>Correct: {correct}</Text>
				<Text style={{fontSize: 12, color: 'white'}}>Incorrect: {incorrect}</Text>
				<Text style={{fontSize: 12, color: 'white'}}>Not Answered: {notAnswered}</Text>
			</Animated.View>
		);
	}
	
	// This is used to stop the search bar from emptying on removal of card set
	
	if (!data[index].title.toLowerCase().includes(searchText.toLowerCase())) {
		return null;
	}
	
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
								console.log(x)
								merge(x);
								console.log('merged')
							} else {
								let x = mergeItems;
								for (let i: number = 0; i < x.length; i++) {
									if (x[i] == index) {
										x.splice(i, 1);
										break;
									}
								}
								merge(x);
							}
							setValue(!value);
						}} style={{marginLeft: 5}} />
						</View>: <View style={styles.Card}> 
						<Text style={{padding: 5, fontSize: 24, color: 'white', width: '65%'}}>{data[index].title}</Text>
						<Text style={{padding: 5, fontSize: 15, color: 'white'}}>No cards in this set</Text>
						</View>) : null}
					</View>
					{!selectionBox ? <View style={styles.Card}>
					<QuestionInfo style={{position: 'absolute', top: 0}} />
					<Text style={{padding: 5, fontSize: 24, color: 'white', width: '65%'}}>{data[index].title}</Text>
					<Text style={{padding: 5, color: 'white', fontSize: 15}}>{data[index].description}</Text>
					<Text style={{padding: 5, color: 'white', fontSize: 12, fontStyle: 'italic'}}>Last Attempted: {calculateLastAttempt(data, index)}</Text>
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
								data[index].lastAttempted = setLastAttempted();
								data.splice(index, 1);
								data.unshift(firstCardSet);
								db.collection('users').doc(auth.currentUser?.uid).set({data})
								props.Play()
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
								props.Edit()
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