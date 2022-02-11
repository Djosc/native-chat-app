import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Button,
	TextInput,
	ImageBackground,
	Image,
	TouchableOpacity,
	Pressable,
	Platform,
	KeyboardAvoidingView,
} from 'react-native';

import Bg from '../assets/BackgroundImage.png';
import Ico from '../assets/userIcon.png';

export default class Start extends Component {
	constructor(props) {
		super(props);
		this.state = { name: '', bgColor: this.colors.black };
	}

	/*
		this function will update the bg color when the user selects a color 
		from the color picker 
	*/
	changeBgColor = (newColor) => {
		this.setState({ bgColor: newColor });
	};

	// These are used to update the state of bgColor
	colors = {
		black: '#090C08',
		purple: '#474056',
		blue: '#8A95A5',
		green: '#B9C6AE',
	};

	render() {
		return (
			<View style={styles.container}>
				{/* ImageBackground is used so content can be rendered on top of it */}
				<ImageBackground source={Bg} resizeMode="cover" style={styles.BgImage}>
					<View style={styles.titleBox}>
						<Text style={styles.title}>Chat</Text>
					</View>

					<View style={styles.mainBox}>
						<View style={styles.inputBox}>
							<Image source={Ico} style={styles.icon} />
							<TextInput
								style={styles.textInput}
								onChangeText={(text) => this.setState({ name: text })}
								value={this.state.name}
								placeholder="Your Name"
							/>
						</View>

						<View style={styles.colorBox}>
							<Text style={styles.colorTitle}>Choose Background Color: </Text>
						</View>

						{/* When a color is selected, the state of bgColor will be changed */}
						<View style={styles.colorPicker}>
							<TouchableOpacity
								style={styles.color1}
								onPress={() => this.changeBgColor(this.colors.black)}
							></TouchableOpacity>
							<TouchableOpacity
								style={styles.color2}
								onPress={() => this.changeBgColor(this.colors.purple)}
							></TouchableOpacity>
							<TouchableOpacity
								style={styles.color3}
								onPress={() => this.changeBgColor(this.colors.blue)}
							></TouchableOpacity>
							<TouchableOpacity
								style={styles.color4}
								onPress={() => this.changeBgColor(this.colors.green)}
							></TouchableOpacity>
						</View>

						{/* This is the submit button that will send the user's name and selected
							bgColor to the Chat component */}
						<Pressable
							style={styles.pressable}
							onPress={() =>
								this.props.navigation.navigate('Chat', {
									name: this.state.name,
									bgColor: this.state.bgColor,
								})
							}
						>
							<Text style={styles.pressableText}>Start Chatting</Text>
						</Pressable>
					</View>
				</ImageBackground>
				{/* If the platform is android, add component so keyboard does not block user's view */}
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	BgImage: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},

	titleBox: {
		height: '50%',
		width: '88%',
		alignItems: 'center',
		paddingTop: 70,
	},

	title: {
		fontSize: 45,
		fontWeight: '600',
		color: '#fff',
	},

	mainBox: {
		// height: '44%',
		width: '88%',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingTop: 15,
	},

	inputBox: {
		width: '88%',
		height: 50,
		alignItems: 'center',
		borderWidth: 2,
		borderRadius: 3,
		borderColor: '#757083',
		flexDirection: 'row',
	},

	icon: {
		width: 30,
		height: 30,
		marginRight: 20,
		marginLeft: 20,
	},

	textInput: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 0.5,
	},

	colorBox: {
		width: '88%',
		paddingLeft: 5,
		paddingTop: 15,
	},

	colorTitle: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 1,
	},

	colorPicker: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '88%',
		paddingTop: 10,
		paddingRight: 30,
	},

	color1: {
		backgroundColor: '#090C08',
		width: 50,
		height: 50,
		borderRadius: 25,
	},

	color2: {
		backgroundColor: '#474056',
		width: 50,
		height: 50,
		borderRadius: 25,
	},

	color3: {
		backgroundColor: '#8A95A5',
		width: 50,
		height: 50,
		borderRadius: 25,
	},

	color4: {
		backgroundColor: '#B9C6AE',
		width: 50,
		height: 50,
		borderRadius: 25,
	},

	pressable: {
		width: '88%',
		height: 60,
		backgroundColor: '#757083',
		marginTop: 30,
		marginBottom: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},

	pressableText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
});
