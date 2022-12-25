import { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, View, TouchableWithoutFeedback, Dimensions, Text, FlatList } from 'react-native';
import RenderHTML from 'react-native-render-html';

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
		<TouchableOpacity style={{marginHorizontal: 10}} >
			<Text style={{color: 'white', textAlign: 'center', fontSize: 30}}>{props.button}</Text>
			<Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>{props.text}</Text>
		</TouchableOpacity>
	);
}

const CardInfo = ({data, index}) => {
	
	const fixHtml = (source) => {
		console.log('source before ' + source)
		source = source.replace(/<div/g, "<div style='font-size: 20px; color: white; margin-left: 20px;'");
		console.log('source after ' + source)
		return source
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
			<View style={{flexDirection: 'row'}}>
				<Text style={{color: 'white', marginLeft: 5, fontSize: 20}}>{index + 1}</Text>
				<RenderHTML 
					source={{html: `<div style='text-overflow: ellipsis; overflow: hidden; white-space: nowrap; height: 26px; width: 210px;'>${fixHtml(data[index].question)}</div>`}}
					contentWidth={400}
				/>
				<View style={{position: 'absolute', right: 0, top: 2.5, width: 20, height: 20, backgroundColor: color, borderRadius: 50}} />
			</View>
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
			<Text style={{color: 'white', fontSize: 16}}>{data[0].description}</Text>
			<Seperator style={{height: 0.5, width: '100%'}} vertical={false} />
			<View style={{flexDirection: 'row', justifyContent: 'center'}}>
				<OptionButton button={"▶️"} text={"Play"} />
				<Seperator vertical={true} style={{width: 0.4, height: 70}} />
				<OptionButton button={"✏️"} text={"Edit"} />
				<Seperator vertical={true} style={{width: 0.4, height: 70}} />
				<OptionButton button={"🗑"} text={"Delete"} />
			</View>
			<Seperator vertical={false} style={{height: 0.4, width: '100%'}} />
			<Text style={{color: 'white', fontSize: 30}}>Cards</Text>
			<CardList data={data[0].card} />
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