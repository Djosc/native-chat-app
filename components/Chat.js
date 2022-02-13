import React, { Component } from 'react';
import { View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

export default class Chat extends Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			uid: 0,
			user: {
				_id: '',
				name: '',
			},
			// user: '',
		};

		const firebaseConfig = {
			apiKey: 'AIzaSyDw3R-OpKlpBHQ8OwFRwscxCENsO_pa8a4',
			authDomain: 'test-69ec4.firebaseapp.com',
			projectId: 'test-69ec4',
			storageBucket: 'test-69ec4.appspot.com',
			messagingSenderId: '730069326073',
			appId: '1:730069326073:web:141302c184ec4e4047aa28',
		};

		// Initialize firebase
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		this.referenceChatMessages = null;
		this.referenceMessagesUser = null;
	}

	componentDidMount() {
		// Access name state from the start screen and display it
		const { name } = this.props.route.params;

		// reference firestore collection when component mounts
		this.referenceChatMessages = firebase.firestore().collection('messages');

		this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			if (!user) {
				await firebase.auth().signInAnonymously();
			}

			// update user state based on currently logged in user
			this.setState({
				uid: user.uid,
				messages: [],
				user: {
					_id: user.uid,
					name: name,
				},
			});

			// setup the collection listeners
			this.unsubscribe = this.referenceChatMessages
				.orderBy('createdAt', 'desc')
				.onSnapshot(this.onCollectionUpdate);

			this.referenceMessagesUser = firebase
				.firestore()
				.collection('messages')
				.where('uid', '==', this.state.uid);
		});
	}

	componentWillUnmount() {
		this.authUnsubscribe();
		this.unsubscribe();
	}

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// iterate through each document in the firebase collection
		querySnapshot.forEach((doc) => {
			var data = doc.data();
			// push the message objects to the local messages array
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt.toDate(),
				user: {
					_id: data.user._id,
					name: data.user.name,
				},
			});
		});
		// update the component state with the new messages array
		this.setState({
			messages,
		});
	};

	// Add new messages to the firebase collection
	addMessage() {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			_id: message._id,
			text: message.text,
			createdAt: message.createdAt,
			user: {
				_id: this.state.user._id,
				name: this.state.user.name,
			},
		});
	}

	onSend(messages = []) {
		// Append new message to messages array
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				// Add this new message to the firebase collection
				this.addMessage();
			}
		);
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
						_id: this.state.user._id,
						name: this.state.name,
					}}
				/>
				{/* If the platform is android, add component so keyboard does not block user's view */}
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}
