import { StyleSheet, Platforms } from 'react-native';
class Styles {
	constructor(orientation) {
		this.orientation = orientation;
		const styles;
	}
	styles = StyleSheet.create({
		gradient: {
			flex: 1
		},
		container: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		screen: {
			flexDirection: 'column',
			alignItems: 'flex-end',
			justifyContent: 'space-around',
			backgroundColor: 'rgba(0,0,0,0.8)',
			padding: 10,
			borderTopLeftRadius: 10,
			borderTopRightRadius: 10,
			width: 320,
			minHeight: 80
		},
		answer: {
			color: 'rgba(255,255,255,0.8)',
			fontSize: 16,
		},
		current: {
			color: 'white',
			fontSize: 32
		},
		button: {
			width: 80,
			height: 80,
			backgroundColor: 'rgba(255,255,255,0.8)',
			borderWidth: 1,
			borderColor: 'black'
		},
		span2: {
			width: 160,
			height: 80,
			backgroundColor: 'rgba(255,255,255,0.8)',
			borderWidth: 1,
			borderColor: 'black'
		},
		small: {
			width: 40,
			height: 40,
			backgroundColor: 'rgba(255,255,255,0.8)',
			borderWidth: 1,
			borderColor: 'black'
		},
		small2: {
			width: 80,
			height: 40,
			borderBottomRightRadius: 10,
			backgroundColor: 'rgba(255,255,255,0.8)',
			borderWidth: 1,
			borderColor: 'black'
		},
		text: {
			fontSize: 30,
			textAlign: 'center'
		},
		textSmall: {
			fontSize: 14,
			textAlign: 'center'
		},
		row: {
			flexDirection: 'row'
		}
	});
}
export {Styles}