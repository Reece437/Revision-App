import { useEffect, useState } from 'react';
import { SafeAreaView, View, Platform, KeyboardAvoidingView, Text, TextInput, Animated, Image, useColorScheme, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import { styles } from '../styles/LoginStyles';


export default function AccountSetup({navigation}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				navigation.replace("Home")
			}
		});
		return unsubscribe;
	}, []);
	
	const handleSignUp = () => {
		auth.createUserWithEmailAndPassword(email, password).then(userCredentials => {
			return db.collection('users').doc(userCredentials.user.uid).set({
				data : [{
					title: 'First set',
					description: 'First card set'
				}]
			});
		}).catch(err => alert(err.message))
	}
	
	const handleSignIn = () => { 
		auth 
			.signInWithEmailAndPassword(email, password) 
			.then((userCredentials) => { 
				const user = userCredentials.user; 
			}) 
		.catch((error) => alert(error.message)); 
	};
	
	return (
		<KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
			<SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
			<Text style={{fontSize: 40, fontWeight: 'bold', paddingTop: 40, textAlign: 'center'}}>Welcome, to your Revision App</Text>
			<Image source={require('../assets/download.jpg')} style={{borderRadius: 150, transform: [{scale: 0.8}]}} />
			<TextInput
				placeholder="Email"
				value={email}
				style={styles.textInput}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				placeholder="Password"
				value={password}
				secureTextEntry
				style={styles.textInput}
				onChangeText={(text) => setPassword(text)}
			/>
			<TouchableOpacity onPress={handleSignIn} style={styles.button}>
				<Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>Sign In</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={handleSignUp} style={styles.button}>
				<Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>Sign Up</Text>
			</TouchableOpacity>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}