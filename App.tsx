import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

import Dict from './src/dict';
import MovieScreen from './src/screens/MovieScreen'
import SurfScreen from './src/screens/SurfScreen'

const Stack = createNativeStackNavigator();

function App() {
	// testing network connectivity
	NetInfo.fetch().then((state :NetInfoState) => {
		if(!state.isConnected)
		{
			// TODO: inform user
			console.error("network is not connected");
		}
	});
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="SurfScreen" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="SurfScreen" component={SurfScreen} />
				<Stack.Screen name="MovieScreen" component={MovieScreen}options={{ title: 'Overview' }} />
				<Stack.Screen name="Dict" component={Dict} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
