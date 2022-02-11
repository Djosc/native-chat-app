import React, { Component } from 'react';
import { View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';

import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
	constructor() {
		super();
		this.state = {
			messages: [],
		};
	}

	componentDidMount() {
		// Access name state from the start screen and display it in the messages
		const { name } = this.props.route.params;
		this.setState({
			messages: [
				{
					_id: 1,
					text: `Hello ${name}`,
					createdAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://placeimg.com/140/140/any',
					},
				},
				{
					_id: 2,
					text: `${name} has entered the Chat!`,
					createdAt: new Date(),
					system: true,
				},
			],
		});
	}

	onSend(messages = []) {
		// Append new message to messages array
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}));
	}

	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000',
					},
				}}
			/>
		);
	}

	render() {
		// Get name and bg color from the route parameters to be used in this component
		this.props.navigation.setOptions({ title: name });

		const { name, bgColor } = this.props.route.params;

		return (
			<View style={{ flex: 1, backgroundColor: bgColor }}>
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: 1,
					}}
				/>
				{/* If the platform is android, add component so keyboard does not block user's view */}
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}
