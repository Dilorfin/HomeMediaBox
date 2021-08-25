import * as React from 'react';
import { View, Text, Button, Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import base64 from 'react-native-base64'
import SendIntentAndroid from "react-native-send-intent";
import Dict from './src/dict';

function startVideo(url :string)
{
	Platform.select({
		android() {
			SendIntentAndroid.openAppWithData(
				/* "org.videolan.vlc" */null,
				url,
				"video/*"
			).then(wasOpened => {});
		},
		default(){
			Linking.openURL(url).catch(err => {});
		}
	})();
}

function HomeScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<Button
				title="Start video"
				onPress={() => {
			const headers = {
				'Accept':'*/*',
				'Accept-Encoding': 'gzip, deflate, br',
				'Connection': 'keep-alive',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
			}
			fetch('https://datalock.ru/player/5435',{
				headers: headers
			}).then((response :Response)=>{
				return response.text();
			}).then((htmlText :string) =>{
				var matches :RegExpMatchArray = htmlText.match(/<script type="text\/javascript">.*eval.*<\/script>/);
				
				if(!matches || matches.length != 1)
				{
					throw 'error';
				}

				var input :string = matches[0].replace('<script type="text/javascript">', '')
					.replace('</script>', '');
				matches = input.match(/.*eval\(function\(\w,\w,\w,\w\).*/g);
				while(matches && matches.length != 0)
				{
					input = "(" + input.substr(0, input.length-2)
						.replace(/.*eval\(/g, "")
						.replace("}('", "})('");
					input = eval(input)
					matches = input.match(/.*eval\(function\(\w,\w,\w,\w\).*/g);
				}
				return "https://"+input.match(/datalock\.ru\/playlist\/.*\.txt\?time=\d+/g)[0];
			}).then((playlistUrl :string) => {
				return fetch(playlistUrl, {headers: headers });
			}).then((response :Response)=>{
				return response.json();
			}).then((playlist)=>{
				if (playlist[0].folder) 
				{
					return playlist[0].folder[0].file;
				}
				else 
				{
					return playlist[0].file;
				}
			}).then((fileDecodedUrl :string)=>{
				fileDecodedUrl = fileDecodedUrl.replace(/(\/\/.*?==)/g, '');

				return base64.decode(fileDecodedUrl.substr(2));
			}).then((fileUrl :string)=>{
				//console.log(fileUrl);
				startVideo(fileUrl);
			});
		}}
	/>
	</View>
	);
}
function DetailsScreen({ navigation }) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<Button title="Dict" onPress={()=>{navigation.navigate("Dict")}}/>
		<Button title="Video" onPress={()=>{navigation.navigate("Video")}}/>
		</View>
	);
}

const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Home" component={DetailsScreen} />
				<Stack.Screen name="Video" component={HomeScreen}options={{ title: 'Overview' }} />
				<Stack.Screen name="Dict" component={Dict} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
