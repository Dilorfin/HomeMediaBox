import React, { useState }  from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import TextTicker from 'react-native-text-ticker';

const textPadding:number = 5;

export default function Card (props)
{
	//const [focused, setFocused] = useState(false);

	return (
	<TouchableOpacity 
			onPress={props.onPress}
			onFocus={(event)=>{
				console.log(`focused: ${event}`);
				//setFocused(true);
			}}
			onBlur={(event)=>{
				console.log(`unfocused: ${event}`);
				//setFocused(false);
			}}
			style={[
			  styles.container,
			  //focused && styles.styleFocused
			]}
		>
		<Image
			source={{ uri: props.imageUrl }}
			style={{
				width: props.width,
				height: props.height
			}}
		/>
		<View style={[styles.textWrapper, {width:props.width}]}>
			<TextTicker bounce={false}
				shouldAnimateTreshold={textPadding}
				style={styles.text}>
				{props.title}
			</TextTicker>
      	</View>

	</TouchableOpacity>)
};

const styles = StyleSheet.create({
	container:{
		margin: 10,
	},
	text:{
		color: 'rgb(200, 200, 200)'
	},
	textWrapper:{
		padding: textPadding,
		backgroundColor: 'rgb(40, 40, 40)',
	},
	styleFocused: {
		borderWidth:2,
		borderColor:"#0f0"
	}
});