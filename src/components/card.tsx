import React  from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Card ({imageUrl, title, onPress, width, height}) {
	return (
	<TouchableOpacity onPress={onPress}
		  style={styles.container}>
		<Image
			source={{ uri: imageUrl }}
			style={{
				width: width,
				height: height
			}}
		/>
		<Text

		 style={styles.text}>
			{title}
		</Text>
	</TouchableOpacity>)
};

const styles = StyleSheet.create({
	container:{
		margin: 10
	},
	text: {
		width:150,
		backgroundColor:"rgb(40, 40, 40)",
		color:"rgb(200, 200, 200)",
		padding: 5,
		
	}
});