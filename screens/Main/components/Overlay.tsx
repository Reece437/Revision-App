import { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, View, TouchableWithoutFeedback, Dimensions, Text, FlatList } from 'react-native';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const Seperator = (props) => {
	const marginStyle = !props.vertical ? {
		marginVertical: 5
	} : {
		marginHorizontal: 5
	}
	
	return <View style={[marginStyle, props.style, {backgroundColor: 'white', alignSelf: !props.vertical ? 'center' : null}]} />
}

const OptionButton = (props) => {
	return (
		<TouchableOpacity style={{marginHorizontal: 10}} onPress={props.func} >
			<Text style={{color: 'white', textAlign: 'center', fontSize: 30}}>{props.button}</Text>
			<Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>{props.text}</Text>
		</TouchableOpacity>
	);
}

const CardInfo = ({data, index}) => {
	
	const [rotation, setRotation] = useState(90);
	const rotationValue = useRef(new Animated.Value(90)).current;

	const animation = value => {
		Animated.timing(rotationValue, {
			toValue: value,
			duration: 400,
			useNativeDriver: true
		}).start()
		
	}

	useEffect(() => {
		animation(rotation)
	}, [rotation]);

	const fixHtml = (source, size, text) => {
		if (source == '') {
			return `<div style='color: white; font-size: ${size}px'>${text}</div>`
		}
		source = source.replace('<div>', `<div>${text}`, 1)
		source = source.replace(/<div/g, `<div style='font-size: ${size}px; color: white;'`);
		return source
	}
	
	const statusString = status => {
		if (status) {
			return "Last attempt was correct"
		} else if (!status) {
			return "Last attempt was incorrect"
		} return "Has not been attempted yet"
	}

	let color;
	switch (data[index].isCorrect) {
		case true:
			color = 'green';
			break;
		case false:
			color = '#af0000';
			break;
		default:
			color = '#565656';
			break;
	}
	

	return (
		<View>
			<Seperator vertical={false} style={{width: '100%', height: 0.5}} />
			<TouchableWithoutFeedback onPress={() => {
				if (rotation == 90) {
					setRotation(0);
				} else {
					setRotation(90);
				}
			}}>
				<View style={{flexDirection: 'row'}}>
					<Text style={{color: 'white', marginLeft: 5, fontSize: 20}}>{index + 1}</Text>
					{rotation == 90 ? <RenderHTML 
						source={{html: `<div style='height: 26px; width: 210px; margin-left: 20px;'>${fixHtml(data[index].question, 20, '')}</div>`}}
						contentWidth={400}
					/> : null}
					<View style={{position: 'absolute', right: 25, top: 2.5, width: 20, height: 20, backgroundColor: color, borderRadius: 50}} />
					<Animated.View style={{position: 'absolute', right: 0, top: 2.5, transform: [{rotate: rotationValue.interpolate({
						inputRange: [0, 90],
						outputRange: ['0deg', '90deg']
					})}]}}>
						<Icon name="chevron-down-sharp" size={20} color="white" />
					</Animated.View>
				</View>
			</TouchableWithoutFeedback>
			{rotation == 0 ? <View style={{marginLeft: 25}}>
				<RenderHTML
					source={{html: fixHtml(data[index].question, 14, '<i>Question: </i>')}}
					contentWidth={50}
				/>
				<Seperator vertical={false} style={{width: '100%', height: 0.5}} />
				<RenderHTML
					source={{html: fixHtml(data[index].answer, 14, '<i>Answer: </i>')}}
					contentWidth={50}
				/>
				<Seperator vertical={false} style={{width: '100%', height: 0.4}} />
				<Text style={{color: 'white', fontSize: 14}}>Status: {statusString(data[index].isCorrect)}</Text>
			</View> : null}
		</View>
	)
}

const CardList = ({data}) => {
	return (
		<FlatList
			data={data}
			renderItem={({item}) => 
				<CardInfo data={data} index={data.indexOf(item)} key={data.indexOf(item)} />
			}
			keyExtractor={(item) => data.indexOf(item)}
		/>
	)
}

const InsideOverlay = ({data, visible, outsideTouch, edit, play, del}) => {
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
	
	console.log('data ' + data)
	
	return (
		<Animated.View style={{padding: 10, zIndex: 101, position: 'absolute', alignSelf: 'center', width: '88%', height: 640, backgroundColor: 'black', top: fullHeight / 2 - 320,
			borderWidth: 0.5, borderColor: 'white', borderRadius: 30, transform: [{translateY: bottomOffset}]
		}}>
			<Text style={{color: 'white', fontSize: 36}}>{data.title}</Text>
			<Text style={{color: 'white', fontSize: 16}}>{data.description}</Text>
			<Seperator style={{height: 0.5, width: '100%'}} vertical={false} />
			<View style={{flexDirection: 'row', justifyContent: 'center'}}>
				<OptionButton button={"▶️"} text={"Play"} func={play} />
				<Seperator vertical={true} style={{width: 0.4, height: 70}} />
				<OptionButton button={"✏️"} text={"Edit"} func={edit} />
				<Seperator vertical={true} style={{width: 0.4, height: 70}} />
				<OptionButton button={"🗑"} text={"Delete"} func={del} />
			</View>
			<Seperator vertical={false} style={{height: 0.4, width: '100%'}} />
			<Text style={{color: 'white', fontSize: 30}}>Cards</Text>
			<CardList data={data.card} />
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
			<InsideOverlay data={props.data} visible={visible} outsideTouch={props.outsideTouch} edit={props.edit} play={props.play} del={props.del}/>
		</View>
	);
}

export { Overlay }