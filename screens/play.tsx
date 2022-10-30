import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
	StatusBar,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	TouchableWithoutFeedback,
	Animated,
	FlatList,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';

export default function Play({route, navigation}) {
	const [all, setAll] = useState();
	const [, updateState] = useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const [cards, setCards] = useState([]);
	
	const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
	
	const removeUnfinishedCards = (data: object[]): object[] => {
		let corrected: object[] = [];
		try {
			for (let i = 0; i < data.length; i++) {
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
	const shuffle = (array): any => {
		return array.sort(() => Math.random() - 0.5);
	}
	const Retry = (): void => {
		setN(0);
		setFinished(false);
		displayContent();
	}
	const bigReplace = (html: string) => {
		if (!html.includes('div')) {
			html = '<div>' + html + '</div>';
		}
		html = html.replace(/<img style='width: 110px; height: 110px;'/g, "<img style='width: 150px; height: 150px;'")
		.replace(/<div/g, `<div style='font-size: 40px; color: white; padding: 5px'`)
		return html
	}
	
	const DisplayContent = props => {
		const questionValue = useRef(new Animated.Value(1)).current;
		const answerScale = useRef(new Animated.Value(0)).current;
		
		const [showAnswer, setShowAnswer] = useState(false);
		const [correct, setCorrect] = useState(0);
		const [incorrect, setIncorrect] = useState(0);
		const [n, setN] = useState(0)
		const [dontShow, setDontShow] = useState(true)
		const [finished, setFinished] = useState(false);
		const data = props.data;
		
		const Retry = (): void => {
			setN(0);
			setFinished(false);
			setIncorrect(0)
			setCorrect(0)
			setShowAnswer(false);
			setDontShow(true)
			displayContent();
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
	
		useEffect(() => {
			if (showAnswer) {
				Animated.timing(questionValue, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true
				}).start(({finished}) => {
					setDontShow(false)
					Animated.timing(answerScale, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true
					}).start()
				})
			} else {
				Animated.timing(answerScale, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true
				}).start(({finished}) => {
					setDontShow(true)
					Animated.timing(questionValue, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true
					}).start()
				})
			}
		}, [showAnswer])
		
		if (cards.length == 0) {
			return (
				<View style={{flex: 1, backgroundColor: 'black'}}>
				<View style={[styles.box, {justifyContent: 'center', alignItems: 'center'}]}>
					<Text style={{fontSize: 40, color: 'white'}}>You have no cards in this set that have both a question, and an answer.
					Please create some cards that meet this criteria.</Text>
				</View>
				</View>
			);
		}
		let sourceQuestion = `<div style="flex: 1">${bigReplace(data[n].question)}</div>`
		let sourceAnswer = showAnswer ? `<div style="flex: 1">${bigReplace(data[n].answer)}</div>` : ''
		if (!finished) {
		return (
			<View style={{flex: 1, backgroundColor: 'black'}}>
			<AnimatedTouchableOpacity style={[styles.box, {transform: [{scaleX: questionValue}]}]}
			onPress={() => {
				setShowAnswer(true)
			}}>
				<ScrollView style={{flexGrow: 1}}>
				<RenderHTML
					source={{html: sourceQuestion}}
					contentWidth={400}
					enableExperimentalMarginCollapsing={true}
				/>
				</ScrollView>
			</AnimatedTouchableOpacity> 
			<View style={{flex :1}}>
				{showAnswer || !dontShow ? <Animated.View style={[styles.box, {transform: [{scaleX: answerScale}]}]}>
					<ScrollView style={{flexGrow: 1}}>
					<RenderHTML
						source={{html: sourceAnswer}}
						contentWidth={400}
						enableExperimentalMarginCollapsing={true}
					/>
					</ScrollView>
				</Animated.View> : null}
				{showAnswer && !dontShow ? <View style={{flex : 1}}>
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
				</View> : null}
				</View>
			</View>
		);
		} else {
			return <FinishedScreen />
		}
	}
	
	
	const displayContent = (): void => {
		db.collection('users').doc(auth.currentUser?.uid).get().then(doc => {
			data = doc.data().data;
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
			<DisplayContent data={cards} />
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