import { useRef, useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { Animated, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, Text, StatusBar, Dimensions } from 'react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(TouchableWithoutFeedback);


const AddButton = ({selectionBox, addLocalStorageItems, AddMultiple, mergeCardSets, setSelectionBox, storageItems}) => {
	const scaleValue = useRef(new Animated.Value(0)).current;
	const [render, setRender] = useState(false);
	
	const animation = (value, onFinish) => {
		Animated.spring(scaleValue, {
			toValue: value,
			friction: 6,
			useNativeDriver: true
		}).start();
	}
	
	useEffect(() => {
		if (render) {
			animation(1)
		} else {
			animation(0)
		}
	}, [render])
	
	return (
		<>
		{!selectionBox ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 35)}
			onPress={() => setRender(!render)}>
			<View style={styles.addButton}>
				<Text style={[styles.addButtonText]}>+</Text>
			</View>
		</TouchableNativeFeedback> : null}
		{!selectionBox ? <Animated.View style={[styles.addSecondary, {transform: [{scale : scaleValue}]}]}> 
		<TouchableOpacity 
			onPress={render ? addLocalStorageItems : null}
			onLongPress={render ? AddMultiple : null}>
			<Icon name="create-outline" size={24} />
		</TouchableOpacity>
		</Animated.View> : null}
		{!selectionBox ? <Animated.View style={[styles.addTertiary, {transform: [{scale: scaleValue}]}]}> 
		<TouchableOpacity 
				testId="Something"
				onPress={render ? () => {
				if (storageItems.length <= 1) {
					alert("You don't have enough card sets to use the merge feature");
					setRender(false);
				} else {
					setRender(false)
					setSelectionBox(true); 
				}
			} : null}>
				<Icon name="git-network-outline" size={24} />
			</TouchableOpacity> 
			</Animated.View> : null}
		{selectionBox ? <TouchableNativeFeedback
		background={TouchableNativeFeedback.Ripple('#a7a7a7', false, 35)}
		onPress={mergeCardSets}>
		<View style={styles.addButton}>
			<Icon name="git-network-outline" size={40} />
		</View>
		</TouchableNativeFeedback> : null}
		</>
	);
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight
  },
  addButton: {
  	flex: 1,
  	position: 'absolute',
  	alignItems: 'center',
  	left: (Dimensions.get('window').width / 2) - 30,
  	bottom: 15,
  	zIndex: 2,
  	backgroundColor: '#0ed186',
  	width: 70,
  	height: 70,
  	borderRadius: 50,
  	overflow: 'hidden',
  	justifyContent: 'center'
  },
  addButtonText: {
  	fontSize: 40,
  	paddingBottom: 5
  },
  Card: {
  	flex: 1,
  	borderBottomWidth: 0.5,
  	borderColor: '#a0a0a0cc',
  	margin: 0,
  	borderStyle: 'dashed'
  },
  trash: {
  	position: 'absolute',
  	left: 310,
  	top: 7,
  },
  playButton: {
  	position: 'absolute',
  	left: 230,
  	top: -5,
  },
  editButton: {
  	position: 'absolute',
  	left: 270,
  	top: 7
  },
	addSecondary: {
		zIndex: 2,
		position: 'absolute',
		bottom: 10,
		left: (Dimensions.get('window').width / 2) - 80,
		backgroundColor: '#0ed186',
		borderRadius: 50,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	addTertiary: {
		zIndex: 2,
		position: 'absolute',
		bottom: 10,
		right: (Dimensions.get('window').width / 2) - 92,
		backgroundColor: '#0ed186',
		borderRadius: 50,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	reset: {
		position: 'absolute',
		left: '10%',
		bottom: '10%'
	}
}

export { AddButton }