import { useState } from 'react';
import { View, TouchableWithoutFeedback, Dimensions } from 'react-native';

interface OverlayProps {
	outsideTouch: () => void;
}


const Overlay = (props) => {
	const fullWidth = Dimensions.get('window').width;
	const fullHeight = Dimensions.get('window').height;
	
	return (
		<View style={{flex: 1, width: fullWidth + 100, height: fullHeight + 100, backgroundColor: 'red', zIndex: 100, position: 'absolute', top: 0}} />
	);
}

export { Overlay }