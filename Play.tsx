import React, {useState, useEffect} from 'react';
import {
	StatusBar,
	AsyncStorage,
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import RenderHTML from 'react-native-render-html';


export default function Play({route, navigation}) {
	const [finished, setFinished] = useState(false)
	const [correct, setCorrect] = useState(0);
	const [incorrect, setIncorrect] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [n, setN] = useState(0)
	
	const removeUnfinishedCards = () => {
		let corrected: object[] = [];
		for (let i = 0; i < AsyncStorage.revisionCards[route.params.i].card.length;
		i++) {
			if (AsyncStorage.revisionCards[route.params.i].card[i].question == '' ||
			AsyncStorage.revisionCards[route.params.i].card[i].answer == '') {
				continue;
			} else {
				corrected.push(AsyncStorage.revisionCards[route.params.i].card[i]);
			}
		}	
		return corrected;
	}
	const shuffle = array => {
		array.sort(() => Math.random() - 0.5);
		return array;
	}
	const Retry = () => {
		setN(0);
		setShowAnswer(false);
		setCorrect(0);
		setIncorrect(0);
		setCards(shuffle(removeUnfinishedCards()));
		setFinished(false);
	}
	const displayQuestionAndAnswer = () => {
		if (cards.length == 0) {
			return (
				<View style={styles.box}>
					<Text style={{fontSize: 30}}>You have no cards in this set that have both a question, and an answer,
					please create some cards that meet this criteria.</Text>
				</View>
			);
		}
		let source: object = {
			html: !showAnswer ? `<div style='font-size: 50px;'>${cards[n].question}<div>`
			: `<div style='font-size:50px;'>${cards[n].answer}</div>`
		};
		return (
			<View style={{flex: 1}}>
			{!showAnswer ? <TouchableOpacity style={styles.box}
			onPress={() => {
				setShowAnswer(true)
			}}>
				<RenderHTML
					contentWidth={100}
					source={source}
				/>
			</TouchableOpacity> : 
			<View style={{flex: 1}}>
				<View style={styles.box}>
					<RenderHTML 
						contentWidth={100}
						source={source}
					/>
				</View>
				<Text style={styles.check}>Did you get it correct?</Text>
				<TouchableOpacity style={styles.incorrect}
				onPress={() => {
					setIncorrect(incorrect + 1)
					if (n + 1 != cards.length) {
						setN(n + 1);
						setShowAnswer(false);
					} else {
						setFinished(true);
					}
				}}>
					<Text style={{fontSize: 25}}>👎</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.correct}
				onPress={() => {
					setCorrect(correct + 1)
					if (n + 1 != cards.length) {
						setN(n + 1);
						setShowAnswer(false);
					} else {
						setFinished(true);
					}
				}}>
					<Text style={{fontSize: 25}}>👍</Text>
				</TouchableOpacity>
			</View>}
			</View>
		);
	}
	const finishedScreen = () => {
		return (
			<View style={styles.box}>
				<Text style={{fontSize: 32, color: '#0bb002'}}>You got {correct} correct.</Text>
				<Text style={{fontSize: 32, color: '#dc0000'}}>You got {incorrect} incorrect.</Text>
				<TouchableOpacity style={styles.retry}
				onPress={() => Retry()}>
					<Text style={{fontSize: 25, color: 'white', padding: 20}}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}
	const [cards, setCards] = useState(shuffle(removeUnfinishedCards()));
	return (
		<>
			{!finished ? displayQuestionAndAnswer() : finishedScreen()}
		</>
	);
}
const styles = StyleSheet.create({
	box: {
		position: 'absolute',
		top: '10%',
		left: '10%',
		width: '80%',
		height: '80%',
		borderWidth: 2,
		borderRadius: 10,
		borderColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
	},
	check: {
		position: 'absolute',
		bottom: '6.6%',
		left: '17%',
		fontSize: 25,
		textAlign: 'center'
	},
	incorrect: {
		position: 'absolute',
		bottom: '2.3%',
		left: '30%'
	},
	correct: {
		position: 'absolute',
		bottom: '2.3%',
		right: '30%'
	},
	retry: {
		position: 'absolute',
		bottom: 10,
		backgroundColor: 'black',
		borderRadius: 10,
		color: 'white'
	}
});