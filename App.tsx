import React, { Component } from 'react';
import {
	StatusBar
} from 'expo-status-bar';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {styles} from './styles.tsx';
import * as Haptics from 'expo-haptics';
import Maths from './maths.tsx';

var trigMode = 'Deg'
var maths = new Maths(trigMode)
export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ANS: null,
			ansArr: [],
			inv: false,
			render: false,
			firstRound: 10,
			current: '',
			answer: '',
			map: {
				'--': '+',
				'++': '+',
				'sin(': 'maths.sin(',
				'cos(': 'maths.cos(',
				'tan(': 'maths.tan(',
				'sin-1(': 'maths.sinInv(',
				'cos-1(': 'maths.cosInv(',
				'tan-1(': 'maths.tanInv(',
				'÷': '/',
				'log': 'maths.log',
				'ln': 'maths.ln',
				'√': 'Math.sqrt',
				'×': '* ',
				'^': '**',
				'e': '* Math.E * ',
				'π': '* Math.PI * ',
				',': '',
				'%': '/100 *',
				'ANS': 'this.state.ANS'	
			},
			opers: [
				'+',
				'×', '÷',
				'(', 'MOD'
			],
			inner: [
				'log', 'ln',
				'sin', 'cos',
				'tan', '√',
				'%'
			],
			errorNames:[
				'undefined',
				'Syntax Error',
				'Math Error',
				'NaN'
			]
		};
	}
	touch(stylesButton, stylesText, innerText, command) {
		return (
			<TouchableOpacity style={stylesButton} onPress={() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			this.appNum(command);
			}}>
				<Text style={stylesText}>{innerText}</Text>
			</TouchableOpacity>
		);
	}
	factorial(x: number ) : number {
		x = parseFloat(x);
		if (x > 170 || !Number.isInteger(x)) return 'undefined';
		else if (x == 0 || x == 1) return 1;
		let isNegative: number = 1;
		if (x < 0) isNegative = -1;
		for (let i = x - 1; i > 1; i--) {
			x *= i;
		}
		return x * isNegative;
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
					this.state.current[i] == '-') break;
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
	com(num: string) : string {
		if (isNaN(num) ||
			num == '' ||
			(num.includes('e+') ||
				num.includes('e-'))) {
			return num;
		}
		if (num.includes('.')) {
			let firstHalf = (num.split('.')[0])
				.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Can't use localeString because of android
			let secondHalf = num.split('.')[1];
			return `${firstHalf}.${secondHalf}`;
		} else {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	}
	comNums(eq: string) : string {
		eq = eq.replace(/,/g, '');
		let num = '';
		let len: number = eq.length;
		for (let i: number = 0; i < len; i++) {
			if (Number.isInteger(parseFloat(eq[i]))) {
				num += eq[i];
				for (let j: number = 1; j < len; j++) {
					if (Number.isInteger(parseInt(eq[i + j])) ||
						eq[i + j] == '.') {
						num += eq[i + j];
					} else break;
				}
				eq = eq.replace(num, this.com(num));
				i += num.length + Math.floor(num.length / 4);
				num = '';
			}
		}
		return eq;
	}
	inverse() : void {
		let array: string[] = this.state.inner;
		for (let i = 0; i < this.state.inner.length; i++) {
			switch (array[i]) {
				case 'sin':
				case 'cos':
				case 'tan':
					array[i] += '-1';
					break;
				case 'sin-1':
				case 'cos-1':
				case 'tan-1':
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
	reverseString(eq: string) : string {
		let New: string = ''
		let len: number = eq.length - 1;
		for (let i: number = len; i >= 0; i--) {
			New += eq[i];
		}
		return New;
	}
	change(eq: string) : string {
		eq = this.bigReplace(eq);
		while (eq.includes('* *')) {
			eq = eq.replace('* *', '*') //Have to do this because the /* */g creates a comment
		}
		let nums: string;
		const allow = [
			'e','+',
			'-','.','E'
		];
		while (eq.includes('!') || 
		eq.includes('%')) 
		{
			let len = eq.length;
			for (let i = 0; i < len; i++) {
				if (eq[i] == '!') {
					nums = '';
					for (let x = 1; x <= i; x++) {
						if (isNaN(parseInt(eq[i - x])) &&
						!allow.includes(eq[i - x]))
						{
							break;
						}
						nums += eq[i - x];
					}
					nums = this.reverseString(nums);
					eq = eq.replace(nums + '!', this.factorial(nums))
					break;
				}
			}
		}
		eq = eq.replace(/MOD/g, '%');
		for (let i = 0; i < eq.length; i++) {
			if (eq[i] == '*') {
				if (this.state.opers.includes(eq[i - 1]) &&
				(eq[i - 1]) != '*' || i == 0) {
					eq = eq.slice(0, i) + eq.slice(i + 1);
				} else if ((this.state.opers.includes(eq[i + 1]) &&
				eq[i + 1] != '(') &&
				eq[i + 1] != '*') {
					eq = eq.slice(0, i) + eq.slice(i + 1);
				}
			} else if (eq[i] == '(') {
				if (!isNaN(eq[i - 1])) {
					eq = eq.slice(0, i) + '* (' + eq.slice(i + 1)
					i += 3;
				}
			} else if (eq[i] == ')') {
				if (!isNaN(eq[i - 1])) {
					eq = eq.slice(0, i) + ') *' + eq.slice(i + 1)
					i += 3;
				}
			}
		}
		if (eq.slice(-1) == '*') eq = eq.slice(0, -1)
		if (eq.slice(-2) == '* ') eq = eq.slice(0, -2);
		while (eq.includes('***') || 
		eq.includes('(*') ||
		eq.includes('* /*')) {
			eq = eq.replace('***', '**')
			eq = eq.replace('(*', '(')
			eq = eq.replace('* /*', '/')
		}
		return eq;
	}
	bigReplace(eq: string) : string {
		let New: string = eq;
		for (let value in this.state.map) {
			if (!this.state.map.hasOwnProperty(value)) continue;
			New = New.split(value).join(this.state.map[value]);
		}
		return New;
	}
	AC() : void {
		this.setState({current: '', answer: ''})
	}
	DEL() : void {
		if (this.state.errorNames.includes(this.state.current)) 
			AC();
		else {
			this.setState({current: this.state.current.slice(0, -1)});
			this.compute(this.state.current.slice(0, -1));
		}
	}
	showAdv() : void {
		this.setState({render: !this.state.render});
		this.setState({firstRound: this.state.firstRound == 10 ? 0 : 10})
	}
	ans(eq: string) : void {
		this.setState({ANS: eq});
		let array: string[] = this.state.ansArr;
		array.push(this.state.current);
		this.setState({ansArr: array});
	}
	compute(current: string) : void {
		let eq: string = this.change(current);
		if (eq == 'undefined') {
			this.setState({answer: ''});
			return;
		}
		while (eq.split('(').length > eq.split(')').length) {
			eq += ')';
		}
		try {
			eq = eval(eq).toString();
			if (eq == 'undefined') {
				this.setState({answer: eq});
				this.setState({current: this.comNums(current)});
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
				this.setState({answer: this.com(eq).replace('e+', 'E+')
				.replace('e-', 'E-')});
				this.setState({current: this.comNums(current)});
			}
		} catch(err) {
			//alert(err.message) // for debugging
			if (!this.state.opers.includes(current.slice(-1))) {
				this.setState({answer: ''});
			}
		}
	}
	equals(eq: string) : void {
		while (eq.split('(').length > eq.split(')').length) {
			eq += ')';
		}
		if (eq == '') return;
		else {
			try {
				if (this.state.answer == '') eval(this.change(eq));
				this.setState({current: this.state.answer});
				this.setState({answer: ''});
				this.ans(this.state.answer);
			} catch(err) {
				this.setState({current: 'Syntax Error'});
				this.setState({answer: ''});
			}
		}
	}
	render() {
		return (
			<LinearGradient 
			colors={['#43c6ac', '#191654']}
			style={styles.gradient}
			start={[0.0, 0.5]} end={[1.0, 0.5]}>
			<View style={styles.container}>
    		<View style={styles.screen}>
    			<Text style={styles.answer}>{this.state.answer}</Text>
				<Text style={styles.current}>{this.state.current}</Text>
    		</View>
    		<View style={styles.row}>
    			<TouchableOpacity style={styles.span2} onPress={() => {
    			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    			this.AC()
    			}}>
		  			<Text style={styles.text}>AC</Text>
    			</TouchableOpacity>
    			<TouchableOpacity style={styles.button} onPress={() => {
    			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    			this.DEL()
    			}}>
    				<Text style={styles.text}>DEL</Text>
    			</TouchableOpacity>
    			{this.touch(styles.button, styles.text, '×', '×')}
    		</View>
    		<View style={styles.row}>
    			{this.touch(styles.button, styles.text, '1', 1)}
    			{this.touch(styles.button, styles.text, '2', 2)}
    			{this.touch(styles.button, styles.text, '3', 3)}
    			{this.touch(styles.button, styles.text, '+', '+')}
			</View>
			<View style={styles.row}>
				{this.touch(styles.button, styles.text, '4', 4)}
				{this.touch(styles.button, styles.text, '5', 5)}
				{this.touch(styles.button, styles.text, '6', 6)}
				{this.touch(styles.button, styles.text, '-', '-')}
			</View>
			<View style={styles.row}>
				{this.touch(styles.button, styles.text, '7', 7)}
				{this.touch(styles.button, styles.text, '8', 8)}
				{this.touch(styles.button, styles.text, '9', 9)}
				{this.touch(styles.button, styles.text, '÷', '÷')}
			</View>
			<View style={styles.row}>
				{this.touch([styles.button, { borderBottomLeftRadius: this.state.firstRound}], styles.text, '.', '.')}
    			{this.touch(styles.button, styles.text, '0', 0)}
    			<TouchableOpacity
				style={[styles.span2, { borderBottomRightRadius: this.state.firstRound }]}
				onPress={() => {
				this.equals(this.state.current)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}}
				onLongPress={() => this.showAdv()}>
    				<Text style={styles.text}>=</Text>
				</TouchableOpacity>
			</View>
			{this.state.render ? <View style={styles.row}>
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
			{this.state.render ? <View style={styles.row}>
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
    			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    			}}>
    				<Text style={styles.textSmall}>{trigMode}</Text>
    			</TouchableOpacity>
    			<TouchableOpacity style={[styles.small, {borderBottomRightRadius: 10}]}
				onPress={() => {
				this.inverse()
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);	
				}}>
    				<Text style={styles.textSmall}>Inv</Text>
    			</TouchableOpacity>
			</View>: null}
			</View>
			</LinearGradient>
		);
	}
}