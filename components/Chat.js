import React, { Component } from 'react';
import { View, Text, Button, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			uid: 0,
			user: {
				_id: '',
				name: '',
				avatar: '',
			},
			isConnected: false,
			image: null,
			location: null,
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

		// Load messages from async storage
		this.getMessages();

		// reference firestore collection when component mounts
		this.referenceChatMessages = firebase.firestore().collection('messages');

		// Check if user is online
		NetInfo.fetch().then((connection) => {
			// if connected, setup listeners for a change in user, which will then sign them in
			// anonymously
			if (connection.isConnected) {
				this.setState({ isConnected: true });

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
							avatar: 'https://placeimg.com/140/140/any',
						},
					});

					// setup the collection listeners
					this.unsubscribe = this.referenceChatMessages
						.orderBy('createdAt', 'desc')
						.onSnapshot(this.onCollectionUpdate);

					// reference the current user's messages
					this.referenceMessagesUser = firebase
						.firestore()
						.collection('messages')
						.where('uid', '==', this.state.uid);

					// save messages if user is online
					this.saveMessages();
				});
			} else {
				// if user is offline
				this.setState({ isConnected: false });

				// get messages from async storage
				this.getMessages();
			}
		});
	}

	componentWillUnmount() {
		if (this.state.isConnected) {
			this.authUnsubscribe();
			this.unsubscribe();
		}
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
					avatar: data.user.avatar,
				},
				image: data.image || null,
				location: data.location || null,
			});
		});
		// update the component state with the new messages array
		this.setState({
			messages,
		});
		this.saveMessages();
	};

	// Add new messages to the firebase collection
	addMessage() {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			_id: message._id,
			text: message.text || '',
			createdAt: message.createdAt,
			user: {
				_id: this.state.user._id,
				name: this.state.user.name,
				avatar: this.state.user.avatar,
			},
			image: message.image || null,
			location: message.location || null,
		});
	}

	async getMessages() {
		let messages = '';
		try {
			messages = (await AsyncStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	async saveMessages() {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteMessages() {
		try {
			await AsyncStorage.removeItem('messages');
			this.setState({
				messages: [],
			});
		} catch (error) {
			console.log(error.message);
		}
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
				this.saveMessages();
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

	renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

	renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	};

	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	}

	render() {
		// Get name and bg color from the route parameters to be used in this component
		this.props.navigation.setOptions({ title: name });

		const { name, bgColor } = this.props.route.params;

		return (
			<View style={{ flex: 1, backgroundColor: bgColor }}>
				<GiftedChat
					renderBubble={this.renderBubble.bind(this)}
					renderInputToolbar={this.renderInputToolbar.bind(this)}
					renderActions={this.renderCustomActions}
					renderCustomView={this.renderCustomView}
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: this.state.user._id,
						name: this.state.name,
						avatar: this.state.user.avatar,
					}}
				/>
				{/* If the platform is android, add component so keyboard does not block user's view */}
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}
