import Maths from './maths.tsx';

export default class Misc {
	constructor() {
		
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
		for (let value in this.state.map) {
			if (!this.state.map.hasOwnProperty(value)) continue;
			New = New.split(value).join(this.state.map[value])
		}
		return New;
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
				.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Can't use localeString because of android
			let secondHalf = num.split('.')[1];
			return `${firstHalf}.${secondHalf}`;
		} else {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	}
}