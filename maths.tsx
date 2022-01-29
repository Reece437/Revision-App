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
	
	log(x: number) : number {
		return Math.log10(x)
	}
	ln(x: number) : number {
		return Math.log(x)
	}
	factorial(x: string) : number {
		x = parseFloat(x)
		if (x > 170 || !Number.isInteger(x)) return 'undefined';
		else if (x == 0 || x == 1) return 1;
		let isNegative: number = 1;
		if (x < 0) isNegative = -1;
		for (let i = x - 1; i > 1; i--) {
			x *= i;
		}
		return x * isNegative;
	}
}