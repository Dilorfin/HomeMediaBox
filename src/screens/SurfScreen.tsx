import * as React from 'react';
import { View, Button } from 'react-native';

export default function SurfScreen({ navigation }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button title="Dict" onPress={()=>{navigation.navigate("Dict")}}/>
			<Button title="Movie Screen" onPress={()=>{navigation.navigate("MovieScreen")}}/>
		</View>
	);
}