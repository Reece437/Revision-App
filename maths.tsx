export default class Maths {
	constructor(trigMode = 'Deg') {
		this.trigMode = trigMode;
	}
	sin(x: number) : number {
		if (this.trigMode == 'Deg') {
			return Math.sin((x * Math.PI) / 180);
		} else return Math.sin(x);
	}
	cos(x: number) : number {
		if (this.trigMode == 'Deg') {
			if (x == 90) {
				return 0;
			}
			return Math.cos((x * Math.PI) / 180);
		} else return Math.cos(x);
	}
	tan(x: number) : number {
		if (this.trigMode == 'Deg') {
			if (x == 90) return 'undefined';
			return Math.tan((x * Math.PI) / 180);
		} else return Math.tan(x);
	}
	sinInv(x: number) : number {
		if (this.trigMode == 'Deg') {
			return Math.asin(x) * 360 / (2 * Math.PI);
		} else return Math.asin(x);
	}
	cosInv(x: number) : number {
		if (this.trigMode == 'Deg') {
			return Math.acos(x) * 360 / (2 * Math.PI);
		} else return Math.acos(x);
	}
	tanInv(x: number) : number {
		if (this.trigMode == 'Deg') {
			return Math.atan(x) * 360 / (2 * Math.PI);
		} else return Math.atan(x);
	}
	sinh(x: number) : number {
		if (this.trigMode != 'Deg') {
			return Math.sinh((x * Math.PI) / 180);
		} else return Math.sinh(x);
	}
	cosh(x: number) : number {
		if (this.trigMode != 'Deg') {
			return Math.cosh((x * Math.PI) / 180);
		} else return Math.cosh(x);
	}
	tanh(x: number) : number {
		if (this.trigMode != 'Deg') {
			return Math.tanh((x * Math.PI) / 180);
		} else return Math.tanh(x);
	}
	sinhInv(x: number) : number {
		if (this.trigMode != 'Deg') {
			return Math.asinh(x) * 360 / (2 * Math.PI);
		} else return Math.asinh(x);
	}
	coshInv(x: number) : number {
		if (this.trigMode != 'Deg') {
			return Math.ach(x) * 360 / (2 * Math.PI);
		} else return Math.acosh(x);
	}
	tanhInv(x: number) : number {
		if (this.trigMode != 'Deg') {
			return Math.atanh(x) * 360 / (2 * Math.PI);
		} else return Math.atanh(x);
	}
	log(x: number) : number {
		return Math.log10(x)
	}
	ln(x: number) : number {
		return Math.log(x)
	}
	factorial(x: string) : number {
		x = x.replace(/maths/g, 'this')
		try {
			x = parseFloat(eval(x));
		} catch(err) {
			return 'Syntax Error'
		}
		if (x > 170 || !Number.isInteger(x)) return 'undefined';
		else if (x == 0 || x == 1) return 1;
		let isNegative: number = 1;
		if (x < 0) isNegative = -1;
		for (let i = x - 1; i > 1; i--) {
			x *= i;
		}
		return x * isNegative;
	}
	RandInt(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}
	Float(min, max) {
		return Math.random() * (max - min) + min;
	}
}