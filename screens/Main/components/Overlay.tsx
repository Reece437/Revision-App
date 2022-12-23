import { useState, useRef, useEffect } from 'react';
import { Animated, View, TouchableWithoutFeedback, Dimensions, Text } from 'react-native';

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;



const InsideOverlay = ({data, visible, outsideTouch}) => {
	const bottomOffset = useRef(new Animated.Value(700)).current;
	
	useEffect(() => {
		if (visible) {
			Animated.spring(bottomOffset, {
				friction: 10,
				toValue: 0,
				useNativeDriver: true
			}).start();
		} else {
			Animated.spring(bottomOffset, {
				friction: 10,
				toValue: 700,
				useNativeDriver: true
			}).start(({finished}) => outsideTouch())
		}
	}, [visible])
	
	
	
	return (
		<Animated.View style={{padding: 10, zIndex: 101, position: 'absolute', alignSelf: 'center', width: '88%', height: 640, backgroundColor: 'black', top: fullHeight / 2 - 320,
			borderWidth: 0.5, borderColor: 'white', borderRadius: 30, transform: [{translateY: bottomOffset}]
		}}>
			<Text style={{color: 'white', fontSize: 36}}>{data[0].title}</Text>
			<Text style={{color: 'white', fontSize: 18}}>{data[0].description}</Text>
		</Animated.View>
	);
}

const Overlay = (props) => {
	const [visible, setVisible] = useState(true)
	
	return (
		<View>
			<TouchableWithoutFeedback onPress={() => {
				setVisible(false)
			}}>
				<View style={{backgroundColor: '#181818', opacity: 0.5, zIndex: 100, height: fullHeight + 100, width: '100%', position: 'absolute',
					top: 0
				}}/>
			</TouchableWithoutFeedback>
			<InsideOverlay data={props.data} visible={visible} outsideTouch={props.outsideTouch} />
		</View>
	);
}

export { Overlay }