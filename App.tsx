import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

import MovieScreen from './src/screens/MovieScreen'
import SurfScreen from './src/screens/SurfScreen'
import SearchScreen from './src/screens/SearchScreen'
import defaults from './src/defaults';
import TMDB from './src/providers/knowledge/TMDB';

const Stack = createNativeStackNavigator();

export default function App() 
{
	defaults.kProvider = new TMDB();
	
	/*import { MMKV } from 'react-native-mmkv';
	MMKV.set('test', 42);
	console.log(MMKV.getNumber('test'));
	MMKV.clearAll();*/

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
				<Stack.Screen name="MovieScreen" component={MovieScreen} />
				<Stack.Screen name="SearchScreen" component={SearchScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
