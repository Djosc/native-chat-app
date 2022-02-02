import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class Chat extends Component {
	render() {
		// Get name and bg color from the route parameters to be used in this component
		this.props.navigation.setOptions({ title: name });

		const { name, bgColor } = this.props.route.params;

		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: bgColor,
				}}
			>
				{/* if the bgColor is black, make the text white, otherwise, make the text black */}
				<Text style={{ color: bgColor === '#090C08' ? '#fff' : '#000', fontSize: 16 }}>
					Hello {name}!
				</Text>
				{/* <Button
					title="Go to Start"
					onPress={() => this.props.navigation.navigate('Start')}
				/> */}
			</View>
		);
	}
}
