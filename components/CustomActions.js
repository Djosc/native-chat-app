import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import firebase from 'firebase/app';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

class CustomActions extends Component {
	// Get permission to access user's camera roll, then launch camera roll and
	pickImage = async () => {
		const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
		try {
			if (permission) {
				let result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: 'Images',
				}).catch((err) => console.log(err));
				if (!result.cancelled) {
					const imageUrl = await this.uploadImageFetch(result.uri);
					this.props.onSend({ image: imageUrl });
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	takePhoto = async () => {
		const permission = ImagePicker.getCameraPermissionsAsync();
		try {
			if (permission) {
				const result = await ImagePicker.launchCameraAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
				});
				if (!result.cancelled) {
					const imageUrl = await this.uploadImageFetch(result.uri);
					this.props.onSend({ image: imageUrl });
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	getLocation = async () => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status === 'granted') {
				let location = await Location.getCurrentPositionAsync({}).catch((err) =>
					console.log(err)
				);
				const { longitude, latitude } = location.coords;
				console.log(longitude, latitude);
				location &&
					this.props.onSend({
						location: {
							longitude,
							latitude,
						},
					});
			}
		} catch (err) {
			console.log(err);
		}
	};

	uploadImageFetch = async (uri) => {
		const blob = await new Promise((res, rej) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = () => res(xhr.response);
			xhr.onerror = (e) => {
				console.log(e);
				rej(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			xhr.send(null);
		});

		const imageNameBefore = uri.split('/');
		const imageName = imageNameBefore[imageNameBefore.length - 1];

		const storage = getStorage();
		const reference = ref(storage, `images/${imageName}`);

		await uploadBytes(reference, blob);

		blob.close();

		return await getDownloadURL(reference).then((url) => url);
	};

	onActionPress = () => {
		const options = [
			'Choose Picture From Library',
			'Take Picture',
			'Send Location',
			'Cancel',
		];
		const cancelButtonIndex = options.length - 1;

		this.props.showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						this.pickImage();
						return;
					case 1:
						this.takePhoto();
						return;
					case 2:
						this.getLocation();
						return;
				}
			}
		);
	};

	render() {
		return (
			<View>
				<TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
					<View style={[styles.wrapper, this.props.wrapperStyle]}>
						<Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const ConnectedActions = connectActionSheet(CustomActions);
export default ConnectedActions;

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
	},
	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center',
	},
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func,
};
