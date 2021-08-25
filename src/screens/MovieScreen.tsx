import * as React from 'react';
import { View, Button, Linking, Platform } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import base64 from 'react-native-base64';

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
async function GetUrl(playerUrl :string){
	const headers = {
		'Accept':'*/*',
		'Accept-Encoding': 'gzip, deflate, br',
		'Connection': 'keep-alive',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
	}

	return fetch(playerUrl, {
		headers: headers
	}).then((response :Response)=>{
		console.log("first request", response.ok);
		return response.text();
	}).then((htmlText :string) =>{
		var matches :RegExpMatchArray = htmlText.match(/<script type="text\/javascript">.*eval.*<\/script>/);
		
		if(!matches || matches.length != 1)
		{
			throw 'cannot load datalock player';
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
		console.log("playlistUrl", playlistUrl);
		return fetch(playlistUrl, {headers: headers });
	}).then((response :Response)=>{
		console.log("second request", response.ok);
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
		console.log("fileDecodedUrl", fileDecodedUrl);
		fileDecodedUrl = fileDecodedUrl.replace(/(\/\/.*?==)/g, '');

		return base64.decode(fileDecodedUrl.substr(2));
	});
}

export default function MovieScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button
				title="Start video"
				onPress={() => {
					GetUrl('https://datalock.ru/player/14424')
						.then((fileUrl :string)=>{
							console.log("fileUrl", fileUrl);
							startVideo(fileUrl);
						});
				}}
			/>
		</View>
	);
}