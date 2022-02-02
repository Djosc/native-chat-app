import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	Text,
	Button,
	Alert,
	ScrollView,
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = { text: '' };
	}

	// alertMyText(input = []) {
	// 	Alert.alert(input.text);
	// }

	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Start">
					<Stack.Screen name="Start" component={Start} />
					<Stack.Screen name="Chat" component={Chat} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({});
