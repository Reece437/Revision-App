import React, {useState, useEffect, useCallback} from 'react';
import {
	StatusBar,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Play({route, navigation}) {
	const [finished, setFinished] = useState(false)
	const [correct, setCorrect] = useState(0);
	const [incorrect, setIncorrect] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [n, setN] = useState(0)
	const [all, setAll] = useState();
	const [, updateState] = useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const [cards, setCards] = useState([]);

	const removeUnfinishedCards = data => {
		let corrected: object[] = [];
		try {
		for (let i = 0; i < data.length;
		i++) {
			if ((data[i].question).replace(/&nbsp;/g, '').replace('<div></div>', '') == '' ||
			(data[i].answer).replace(/&nbsp;/g, '').replace('<div></div>', '') == '') {
				continue;
			} else {
				corrected.push(data[i]);
			}
		}
		} catch(err) {
			corrected = [];
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
		setFinished(false);
		displayContent();
	}
	const DisplayQuestionAndAnswer = props => {
		const data = props.data;
		if (data.length == 0) {
			return (
				<View style={{flex: 1, backgroundColor: 'black'}}>
				<View style={[styles.box, {justifyContent: 'center', alignItems: 'center'}]}>
					<Text style={{fontSize: 40, color: 'white'}}>You have no cards in this set that have both a question, and an answer.
					Please create some cards that meet this criteria.</Text>
				</View>
				</View>
			);
		}
		let source = {
			html: !showAnswer ? `<div style='color: white; font-size: 40px; padding: 5px;'>${(data[n].question).replace(/<img style='width: 110px; height: 110px;'/g, "<img style='width: 150px; height: 150px;'")}</div>` :
			`<div style='color: white; font-size: 40px; padding: 5px;'>${(data[n].answer).replace(/<img style='width: 110px; height: 110px;'/g, "<img style='width: 150px; height: 150px;'")}</div>`
		};
		return (
			<View style={{flex: 1, backgroundColor: 'black'}}>
			{!showAnswer ? <TouchableOpacity style={styles.box}
			onPress={() => {
				setShowAnswer(true)
			}}>
				<ScrollView style={{flexGrow: 1}}>
				<RenderHTML
					contentWidth={1000}
					source={source}
				/>
				</ScrollView>
			</TouchableOpacity> : 
			<View style={{flex: 1}}>
				<View style={styles.box}>
					<ScrollView style={{flexGrow: 1}}>
					<RenderHTML
						contentWidth={1000}
						source={source}
					/>
					</ScrollView>
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
	const FinishedScreen = () => {
		return (
			<View style={{flex: 1, backgroundColor: 'black'}}>
			<View style={[styles.box, {justifyContent: 'center', alignItems: 'center'}]}>
				<Text style={{fontSize: 32, color: '#0bb002'}}>You got {correct} correct.</Text>
				<Text style={{fontSize: 32, color: '#dc0000'}}>You got {incorrect} incorrect.</Text>
				<TouchableOpacity style={styles.retry}
				onPress={() => Retry()}>
					<Text style={{fontSize: 25, color: 'black', padding: 20}}>Retry</Text>
				</TouchableOpacity>
			</View>
			</View>
		);
	}
	const displayContent = () => {
		AsyncStorage.getItem('revisionCards').then(data => {
			data = JSON.parse(data);
			setCards(shuffle(removeUnfinishedCards(data[route.params.i].card)));
		})
	};
	useEffect(() => {
		displayContent();
	}, [])
	useEffect(() => {
		forceUpdate();
	}, [cards])
	return (
		<>
			{!finished ?  <DisplayQuestionAndAnswer data={cards} /> : <FinishedScreen />}
			<StatusBar backgroundColor={'transparent'} barStyle="light-content" translucent />
		</>
	);
}
const styles = StyleSheet.create({
	box: {
		position: 'absolute',
		top: '5%',
		left: '5%',
		width: '90%',
		height: '85%',
		borderWidth: 2,
		borderRadius: 10,
		borderColor: 'white',
	},
	check: {
		position: 'absolute',
		bottom: '6.6%',
		left: '17%',
		fontSize: 25,
		color: 'white',
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
		backgroundColor: 'white',
		borderRadius: 10,
		color: 'black'
	}
});