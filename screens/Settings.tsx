import React, { useState } from 'react';
import { Text, Switch, View } from 'react-native';
//import { DarkmodeSwitch, GradientSwitch } from "react-native-animated-switch";

export default function Settings() {
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled(!isEnabled);
	return (
		<>
			<Text style={{color: 'green', padding: 20}}>Hello there!
			<Switch
				value={isEnabled}
				onValueChange={toggleSwitch}
			/>
			</Text>
		</>
	);
}