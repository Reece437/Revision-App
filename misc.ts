import Maths from './maths.tsx';
let maths = new Maths();
export default class Misc {
	constructor() {
		this.map = {
			'--': '+',
			'++': '+',
			'sin(': '* maths.sin(',
			'cos(': '* maths.cos(',
			'tan(': '* maths.tan(',
			'sin⁻¹(': '* maths.sinInv(',
			'cos⁻¹(': '* maths.cosInv(',
			'tan⁻¹(': '* maths.tanInv(',
			'sinh(': '* maths.sinh(',
			'cosh(': '* maths.cosh(',
			'tanh(': '* maths.tanh(',
			'sinh⁻¹(': '* maths.sinhInv(',
			'cosh⁻¹(': '* maths.coshInv(',
			'tanh⁻¹(': '* maths.tanhInv(',
			'÷': '/',
			'log(': '* maths.log(',
			'ln': '* maths.ln',
			'√': '* Math.sqrt',
			'×': '* ',
			'e': '* Math.E * ',
			'π': '* Math.PI * ',
			"'": '',
			'%': '/100 *',
			'ANS': '* this.state.ANS * '	
		}
		this.opers = [
			'+','×', 
			'÷','MOD'
		]
	}
	reverseString(eq: string) {
		let New: string = '';
		let len: number = eq.length - 1;
		for (let i = len; i >= 0; i--) {
			New += eq[i];
		}
		return New;
	}
	bigReplace(eq: string) {
		let New: string = eq;
		for (let value in this.map) {
			if (!this.map.hasOwnProperty(value)) continue;
			New = New.split(value).join(this.map[value])
		}
		return New;
	}
	comNums(eq: string) : string {
		eq = eq.replace(/'/g, '');
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
				if (num.includes('.')) {
					i += num.length + Math.floor(num.split('.').length / 4);
				}
				else {
					i += num.length + Math.floor(num.length / 4);
				}
				num = '';
			}
		}
		return eq;
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
				.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'"); // Can't use localeString because of android
			let secondHalf = num.split('.')[1];
			return `${firstHalf}.${secondHalf}`;
		} else {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
		}
	}
	change(eq: string) : string {
		eq = this.bigReplace(eq);
		while (eq.includes('* *')) {
			eq = eq.replace('* *', '*') //Have to do this because the /* */g creates a comment
		}
		if ((eq.split('|').length - 1) % 2 != 0) eq += '|';
		eq = eq.replace(/MOD/g, '%');
		eq = this.fixMultiplicationErrors(eq);
		let nums: string;
		const allow = [
			'e','.','E',
		];
		while (eq.includes('!')) {
			let len = eq.length;
			for (let i = 0; i < len; i++) {
				if (eq[i] == '!') {
					nums = '';
					for (let x = 1; x <= i; x++) {
						if ((this.opers.includes(eq[i - x]) || eq[i - x] == '-') &&
						!allow.includes(eq[i - x]))
						{
							break;
						}
						nums += eq[i - x];
					}
					nums = this.reverseString(nums);
					eq = eq.replace(nums + '!', `${maths.factorial(nums)} *`)
					break;
				}
			}
		}
		for (let i = 0; i < eq.length; i++) {
			if (eq[i] == '|') {
				let New:string = '';
				for (let j = 1; j < eq.length; j++) {
					if (eq[i + j] != '|') {
						New += eq[i + j]
					} else break
				}
				eq = eq.replace(`|${New}|`, `Math.abs(${New})`);
			}
		}
		if (eq.slice(-1) == '*') eq = eq.slice(0, -1);
		//alert(eq); //For debugging 
		return eq;
	}
	fixMultiplicationErrors(eq) {
		while (eq.includes('^')) {
			eq = eq.replace('^', '**');
		}
		for (let i = 0; i < eq.length; i++) {
			if (eq[i] == '*') {
				if ((this.opers.includes(eq[i - 1]) || 
				eq[i - 1] == '-') &&
				(eq[i - 1]) != '*' || i == 0) {
					eq = eq.slice(0, i) + eq.slice(i + 1);
				} else if (((this.opers.includes(eq[i + 1]) ||
				eq[i + 1] == '-') &&
				eq[i + 1] != '(') &&
				(eq[i + 1] != '*') &&
				eq[i - 1] != '*') {
					eq = eq.slice(0, i) + eq.slice(i + 1);
				}
			} else if (eq[i] == '(') {
				if (!isNaN(eq[i - 1])) {
					eq = eq.slice(0, i) + '* (' + eq.slice(i + 1)
					i += 3;
				}
			} else if (eq[i] == ')') {
				if (!isNaN(eq[i - 1]) &&
				eq[i + 1] != '*') {
					eq = eq.slice(0, i) + ') * ' + eq.slice(i + 1)
					i += 3;
				}
			}
		}
		if (eq.slice(-1) == '*') eq = eq.slice(0, -1)
		if (eq.slice(-2) == '* ') eq = eq.slice(0, -2);
		while (eq.includes('* ***') || 
		eq.includes('(* ') ||
		eq.includes('* /*') ||
		eq.includes(') * * (') ||
		eq.includes('* **') ||
		eq.includes('* +') ||
		eq.includes('* -') ||
		eq.includes('* !') ||
		eq.includes('* /', '/') ||
		eq.includes('* )')) {
			eq = eq.replace('* ***', '**');
			eq = eq.replace('* **', '**');
			eq = eq.replace('(* ', '(');
			eq = eq.replace('* /*', '/');
			eq = eq.replace(') * * (', ') * (');
			eq = eq.replace('* +', '+');
			eq = eq.replace('* -', '-');
			eq = eq.replace('* !', '!');
			eq = eq.replace('* /', '/');
			eq = eq.replace('* )', ')')
		}
		//alert(eq);
		return eq;
	}
}