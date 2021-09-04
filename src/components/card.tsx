import React  from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import TextTicker from 'react-native-text-ticker';

const textPadding :number = 5;

export default function Card (props)
{
	var textTicker :any;

	return (
	<TouchableOpacity 
			onPress={props.onPress}
			onFocus={()=>textTicker.startAnimation()}
			onBlur={()=>textTicker.stopAnimation()}
			style={{margin:props.margin}}>
		<Image
			source={{ uri: props.imageUrl }}
			style={{
				width: props.width,
				height: props.height
			}}
		/>
		<View style={[styles.textWrapper, {width:props.width}]}>
			<TextTicker scroll={false}
					bounce={false}
					marqueeOnMount={false}
					shouldAnimateTreshold={textPadding}
					style={styles.text}
					ref={(r :any)=>textTicker=r}>

				{props.title}
			</TextTicker>
		</View>
	</TouchableOpacity>)
};

const styles = StyleSheet.create({
	text:{
		color: 'rgb(200, 200, 200)'
	},
	textWrapper:{
		padding: textPadding,
		backgroundColor: 'rgb(40, 40, 40)',
	}
});