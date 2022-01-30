import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Platform,
	Dimensions,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import Misc from './misc.ts';
import { LinearGradient } from 'expo-linear-gradient';
import {stylePortrait, styleLandscape} from './styles.tsx';
import * as Haptics from 'expo-haptics';
import Maths from './maths.tsx';

const misc = new Misc();
let trigMode = 'Deg';
let maths = new Maths(trigMode)
let styles = stylePortrait;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scrollValue: 0.2,
			ANS: null,
			ansArr: [],
			inv: false,
			render: false,
			firstRound: 10,
			current: '',
			answer: '',
			orientation: Dimensions.get('screen').height >
			Dimensions.get('screen').width ? 'portrait' : 'landscape',
			opers: [
				'+','×', 
				'÷','MOD'
			],
			inner: [
				'log', 'ln',
				'sin', 'cos',
				'tan', '√',
				'%'
			],
			errorNames: [
				'undefined',
				'Syntax Error',
				'Math Error',
				'NaN'
			]
		};
		this.checkOrientation = this.checkOrientation.bind(this);
	}
	touch(stylesButton, stylesText, innerText, command) {
		return (
			<TouchableOpacity style={stylesButton} onPress={() => {
			Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null;
			this.appNum(command);
			}}>
				<Text style={stylesText}>{innerText}</Text>
			</TouchableOpacity>
		);
	}
	checkOrientation() {
		let height = Dimensions.get('screen').height;
		let width = Dimensions.get('screen').width;
		if (height > width) {
			this.setState({orientation: 'portrait'});
			styles = stylePortrait;
			this.setState({scrollValue: this.state.render ? 0.25 : 0.2})
			this.setState({firstRound: this.state.render ? 0 : 10})
			this.forceUpdate();
		} else {
			this.setState({orientation: 'landscape'});
			styles = styleLandscape;
			this.setState({scrollValue: 0.8})
			this.setState({firstRound: 10})
			this.forceUpdate();
		}
	}
	appNum(x: any) : void {
		if (this.state.current == '' && (x == '!' || x == '%')) return;
		if ((this.state.current == '' && 
		(this.state.opers.includes(x) && x != '(')) ||
		this.state.errorNames.includes(this.state.current)) return;
		if (!isNaN(parseFloat(x)) &&
		this.state.current.slice(-1) == '0' &&
		((isNaN(parseFloat(this.state.current[this.state.current.length - 2])) && 
		this.state.current[this.state.current.length - 2] != '.')))
		{
			this.setState({current: this.state.current.slice(0, -1) + x.toString()});
			this.compute(this.state.current.slice(0, -1) + x.toString());
			return;
		}
		if (x == '.') {
			if (this.state.current == '' ||
			(this.state.opers.includes(this.state.current.slice(-1)) ||
			this.state.current.slice(-1) == '-')) 
			{
				this.setState({current: this.state.current + '0.'});
				this.compute(this.state.current + '0.');
				return;
			} else {
				let len = this.state.current.length;
				for (let i = len; i >= 0; i--) {
					if (this.state.opers.includes(this.state.current[i]) || 
					this.state.current[i] == '-' || this.state.current[i] == '^') break;
					else if (this.state.current[i] == '.') return;
				}
			}
		}
		if (this.state.opers.includes(this.state.current.slice(-1)) &&
		this.state.opers.includes(x)) return;
		else if ((this.state.opers.includes(x) || x == '-') &&
		this.state.current.slice(-2) == '--') return;
		else {
			this.setState({current: this.state.current + x.toString()});
			this.compute(this.state.current + x.toString());
		}
	}
	inverse() : void {
		let array: string[] = this.state.inner;
		for (let i = 0; i < this.state.inner.length; i++) {
			switch (array[i]) {
				case 'sin':
				case 'cos':
				case 'tan':
					array[i] += '⁻¹';
					break;
				case 'sin⁻¹':
				case 'cos⁻¹':
				case 'tan⁻¹':
					array[i] = array[i].slice(0, -2);
					break;
				case 'log':
					array[i] = '10^';
					break;
				case '10^':
					array[i] = 'log';
					break;
				case 'ln':
					array[i] = 'e^';
					break;
				case 'e^':
					array[i] = 'ln';
					break;
				case '√':
					array[i] = '^2';
					break;
				case '^2':
					array[i] = '√';
					break;
				case '%':
					array[i] = 'MOD';
					break;
				default:
					array[i] = '%';
					break;
			}
		}
		this.setState({inner: array});
	}
	radOrDeg() : void {
		trigMode = trigMode == 'Deg' ? 'Rad' : 'Deg';
		maths = new Maths(trigMode)
		this.compute(this.state.current);
	}
	AC() : void {
		this.setState({current: '', answer: ''})
	}
	DEL() : void {
		if (this.state.errorNames.includes(this.state.current)) this.AC();
		else {
			this.setState({current: this.state.current.slice(0, -1)});
			this.compute(this.state.current.slice(0, -1));
		}
	}
	showAdv() : void {
		if (this.state.orientation == 'landscape') return;
		this.setState({render: !this.state.render});
		this.setState({firstRound: this.state.firstRound == 10 ? 0 : 10})
		this.setState({scrollValue: this.state.scrollValue == 0.2 ? 0.25 : 0.2})
		this.forceUpdate();
	}
	ans(eq: string) : void {
		eq = eq.replace(/,/g, '');
		eq = parseFloat(eq);
		this.setState({ANS: eq});
		let array: string[] = this.state.ansArr;
		array.push(eq);
		this.setState({ansArr: array});
	}
	compute(current: string) : void {
		let eq: string = current;
		if (this.state.opers.includes(eq.slice(-1))) {
			eq = eq.slice(0, -1);
		}
		while (eq.split('(').length > eq.split(')').length) {
			eq += ')';
		}
		eq = misc.change(eq);
		if (eq == 'undefined') {
			this.setState({answer: ''});
			return;
		}
		try {
			eq = eval(eq).toString();
			if (eq == 'undefined') {
				this.setState({answer: eq});
				this.setState({current: misc.comNums(current)});
				return;
			}
			eq = (Number(eq).toPrecision()).toString();
			if (eq.includes('.') &&
			eq.split('.')[1].length > 11)
			{
				let secondHalf = eq.split('.')[1];
				eq = parseFloat(eq).toFixed(13);
				eq = eq.toString();
				while ((eq.slice(-1) == '0' ||
				eq.slice(-1) == '.') && eq.length > 1) 
				{
					eq = eq.slice(0, -1);
				}
			}
			if (eq == 'NaN' || eq.includes('function')) {
				this.setState({answer: ''});
				this.setState({current: this.comNums(current)});
			} else {
				this.setState({answer: misc.com(eq)
				.replace('e+', 'E+')
				.replace('e-', 'E-')});
				this.setState({current: misc.comNums(current)});
			}
		} catch(err) {
			//alert(err.message) // for debugging
			this.setState({answer: ''})
		}
	}
	equals(eq: string) : void {
		while (eq.split('(').length > eq.split(')').length) {
			eq += ')';
		}
		if (eq == '') return;
		else {
			try {
				if (this.state.answer == '') {eval(this.change(eq))}
				this.setState({current: this.state.answer});
				this.setState({answer: ''});
				this.ans(this.state.answer);
			} catch(err) {
				//alert(err.message)
				this.setState({current: 'Syntax Error'});
				this.setState({answer: ''});
			}
		}
	}
	componentDidMount() {
    	this.dimensionsSubscription = Dimensions.addEventListener("change", this.checkOrientation);
	}
	componentWillUnmount() {
	  this.dimensionsSubscription?.remove();
	}
	render() {
		return (
			<LinearGradient 
			colors={['#43c6ac', '#191654']}
			style={styles.gradient}
			start={[0.0, 0.5]} end={[1.0, 0.5]}>
			<SafeAreaView style={styles.container}>
    		<ScrollView style={{ flexGrow: this.state.scrollValue}}>
    		<View style={styles.screen}>
    			<Text style={styles.answer}>{this.state.answer}</Text>
				<Text style={styles.current}>{this.state.current}</Text>
    		</View>
    		</ScrollView>
    		<View style={styles.row}>
    			{this.state.orientation == 'landscape' ? <Text>
    				{this.touch([styles.span2, {width: 112.5}], styles.text, 'ANS', 'ANS')}
    				<TouchableOpacity style={[styles.span2, {width: 112.5}]} onPress={() => {
    				Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null
    				this.radOrDeg()
    				}}>
    					<Text style={styles.text}>{trigMode}</Text>
    				</TouchableOpacity>
    			</Text> : null}
    			<TouchableOpacity style={styles.span2} onPress={() => {
    			Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null;
    			this.AC();
    			}}>
		  			<Text style={styles.text}>AC</Text>
    			</TouchableOpacity>
    			<TouchableOpacity style={styles.button} onPress={() => {
    			Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null;
    			this.DEL();
    			}}>
    				<Text style={styles.text}>DEL</Text>
    			</TouchableOpacity>
    			{this.touch(styles.button, styles.text, '×', '×')}
    		</View>
    		<View style={styles.row}>
    			{this.state.orientation == 'landscape' ? <Text style={{maxWidth: 225}}> 
    			{this.touch(styles.small, styles.textSmall, 'log', 'log(')}
    			{this.touch(styles.small, styles.textSmall, 'ln', 'ln(')}
    			{this.touch(styles.small, styles.textSmall, 'sin', 'sin(')}
    			{this.touch(styles.small, styles.textSmall, 'cos', 'cos(')}
    			{this.touch(styles.small, styles.textSmall, 'tan', 'tan(')}
    			{this.touch(styles.small, styles.textSmall, '10^', '10^')}
    			{this.touch(styles.small, styles.textSmall, 'e^', 'e^')}
    			{this.touch(styles.small, styles.textSmall, 'sin⁻¹', 'sin⁻¹(')}
    			{this.touch(styles.small, styles.textSmall, 'cos⁻¹', 'cos⁻¹(')}
    			{this.touch(styles.small, styles.textSmall, 'tan⁻¹', 'tan⁻¹(')}
    			</Text>: null}
    			{this.touch(styles.button, styles.text, '1', 1)}
    			{this.touch(styles.button, styles.text, '2', 2)}
    			{this.touch(styles.button, styles.text, '3', 3)}
    			{this.touch(styles.button, styles.text, '+', '+')}
			</View>
			<View style={styles.row}>
				{this.state.orientation == 'landscape' ? <Text style={{maxWidth: 225}}>
				{this.touch(styles.small, styles.textSmall, '√', '√(')}
    			{this.touch(styles.small, styles.textSmall, 'x√', '^(1÷')}
    			{this.touch(styles.small, styles.textSmall, 'sinh', 'sinh(')}
    			{this.touch(styles.small, styles.textSmall, 'cosh', 'cosh(')}
    			{this.touch(styles.small, styles.textSmall, 'tanh', 'tanh(')}
    			{this.touch(styles.small, styles.textSmall, '^2', '^2')}
    			{this.touch(styles.small, styles.textSmall, '^', '^')}
    			{this.touch(styles.small, styles.textSmall, 'sinh⁻¹', 'sinh⁻¹(')}
    			{this.touch(styles.small, styles.textSmall, 'cosh⁻¹', 'cosh⁻¹(')}
    			{this.touch(styles.small, styles.textSmall, 'tanh⁻¹', 'tanh⁻¹(')}
    			</Text> : null}
				{this.touch(styles.button, styles.text, '4', 4)}
				{this.touch(styles.button, styles.text, '5', 5)}
				{this.touch(styles.button, styles.text, '6', 6)}
				{this.touch(styles.button, styles.text, '-', '-')}
			</View>
			<View style={styles.row}>
				{this.state.orientation == 'landscape' ? <Text style={{maxWidth: 225}}>
				{this.touch(styles.small, styles.textSmall, '(', '(')}
				{this.touch(styles.small, styles.textSmall, ')', ')')}
				{this.touch(styles.small, styles.textSmall, 'e', 'e')}
				{this.touch(styles.small, styles.textSmall, 'π', 'π')}
				{this.touch(styles.small, styles.textSmall, '!', '!')}
				{this.touch(styles.small, styles.textSmall, '|', '|')}
				{this.touch(styles.small, styles.textSmall, '^3', '^3')}
				{this.touch(styles.small, styles.textSmall, '%', '%')}
				{this.touch(styles.small, styles.textSmall, 'MOD', 'MOD')}
				{this.touch(styles.small, styles.textSmall, '^-1', '^-1')}
				</Text> : null}
				{this.touch(styles.button, styles.text, '7', 7)}
				{this.touch(styles.button, styles.text, '8', 8)}
				{this.touch(styles.button, styles.text, '9', 9)}
				{this.touch(styles.button, styles.text, '÷', '÷')}
			</View>
			<View style={styles.row}>
				{this.state.orientation == 'landscape' ? <Text style={{maxWidth: 225}}>
				{this.touch([styles.span2, {width: 80, borderBottomLeftRadius: 10}], [styles.text, {fontSize: 15}], 'RandInt', 'RandInt(')}
				{this.touch([styles.span2, {width: 65}], [styles.text, {fontSize: 15}], ',', ',')}
				{this.touch([styles.span2, {width: 80}], [styles.text, {fontSize: 15}], 'RandFloat', 'RandFloat(')}
				</Text> : null}
				{this.touch([styles.button, { borderBottomLeftRadius: this.state.orientation == 'portrait' ? this.state.firstRound : 0}], styles.text, '.', '.')}
    			{this.touch(styles.button, styles.text, '0', 0)}
    			<TouchableOpacity
				style={[styles.span2, { borderBottomRightRadius: this.state.firstRound }]}
				onPress={() => {
				this.equals(this.state.current)
				Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null;
				}}
				onLongPress={() => this.showAdv()}>
    				<Text style={styles.text}>=</Text>
				</TouchableOpacity>
			</View>
			{this.state.render && this.state.orientation != 'landscape' ? <View style={styles.row}>
				{this.touch(styles.small, styles.textSmall, '(', '(')}
    			{this.touch(styles.small, styles.textSmall, ')', ')')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[0], 
    			this.state.inner[0] == 'log' ? 'log(' : '10^')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[1], 
    			this.state.inner[1] == 'ln' ? 'ln(' : 'e^')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[2], 
    			this.state.inner[2] + '(')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[3], 
    			this.state.inner[3] + '(')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[4], 
    			this.state.inner[4] + '(')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[5], 
    			this.state.inner[5] ==  '√' ? '√(' : '^2')}
			</View> : null}
			{this.state.render && this.state.orientation != 'landscape' ? <View style={styles.row}>
				{this.touch([styles.small, { borderBottomLeftRadius: 10}], styles.textSmall, '^', '^')}
				{this.touch(styles.small, styles.textSmall, 'π', 'π')}
				{this.touch(styles.small, styles.textSmall, 'e', 'e')}
    			{this.touch(styles.small, styles.textSmall, '!', '!')}
    			{this.touch(styles.small, styles.textSmall, this.state.inner[6], 
    			this.state.inner[6] == '%' ? '%' : 'MOD')}
    			{this.touch(styles.small, styles.textSmall, 'ANS', 'ANS')}
    			<TouchableOpacity style={styles.small}
    			onPress={() => {
    			this.radOrDeg()
    			Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null;
    			}}>
    				<Text style={styles.textSmall}>{trigMode}</Text>
    			</TouchableOpacity>
    			<TouchableOpacity style={[styles.small, {borderBottomRightRadius: 10}]}
				onPress={() => {
				this.inverse()
				Platform.OS != 'web' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : null;	
				}}>
    				<Text style={styles.textSmall}>Inv</Text>
    			</TouchableOpacity>
			</View>: null}
			</SafeAreaView>
			</LinearGradient>
		);
	}
}