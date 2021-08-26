import React, { Component } from 'react';
import { Button, Linking, Platform, Image, ImageBackground } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

import MovieDetails from '../models/MovieDetails';
import TMDB from '../providers/knowledge/TMDB';
import defaults from '../defaults';

function startVideo(title :string, url :string)
{
	const m = url.match(/http(s)?:\/\//g);
	if (m.length != 1){
		console.error(`not valid url ${url}`);
		return;
	}
	Platform.select({
		android() {
			SendIntentAndroid.openAppWithData(
				//"org.videolan.vlc",
				null,
				url,
				"video/*",
				{
					'title': title
				}
			).then(wasOpened => {});
		},
		default(){
			
			Linking.openURL(url).catch(err => {console.error(err);});
		}
	})();
}

class VideoCdnProvider {
	static async getVideoUrl(movieModel:MovieDetails) :Promise<string>
	{
		function tb(b) {
			if (b.indexOf(".") == -1) {
				b = b.substr(1);
				var s2 = "";
				for (var j = 0; j < b.length; j += 3)
					s2 += "%u0" + b.slice(j, j + 3);
				b = unescape(s2)
			}
			return b
		}
		function decodeEntities(encodedString :string) {
			var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
			var translate = {
				"nbsp":" ",
				"amp" : "&",
				"quot": "\"",
				"lt"  : "<",
				"gt"  : ">"
			};
			return encodedString.replace(translate_re, function(match, entity) {
				return translate[entity];
			}).replace(/&#(\d+);/gi, function(match, numStr) {
				var num = parseInt(numStr, 10);
				return String.fromCharCode(num);
			});
		}

		const api_token = "lyvhjadzMUnDErAS6l7zIAk0M2nMYpbb";
		const url = `https://videocdn.tv/api/movies?api_token=${api_token}&field=imdb_id&query=${movieModel.imdb_id}`;
		return await fetch(url, {
			headers: defaults.headers
		}).then((response :Response)=>{
			return response.json();
		}).then((responseJson)=>{
			return "https:"+responseJson.data[0].media[0].qualities[0].url;
		}).then((playerUrl :string)=>{
			return fetch(playerUrl, {
				headers: defaults.headers
			});
		}).then((response :Response)=>{
			return response.text();
		})
		.then((htmlText :string)=>{
			var matches :RegExpMatchArray = htmlText.match(/<input type=["']hidden["'] id=["']files["'] value=["'].*\}">/g);
			if(!matches || matches.length != 1)
			{
				throw `${movieModel.imdb_id} should be checked`;
			}
			
			return matches[0].replace(/<input type=["']hidden["'] id=["']files["'] value=["']/g, '')
				.replace(/["']>/g, '');
		})
		.then((decodedPlaylist :string)=>{
			var playlist = JSON.parse(decodeEntities(decodedPlaylist));

			for (const [key, value] of Object.entries(playlist)) {
				playlist[key] = tb(value);
			}
			return playlist;
		})
		.then((playlist)=>{
			return "https:" + playlist[Object.keys(playlist)[0]]
				.match(/\[1080p\]\/\/cloud.cdnland.in\/.*720.mp4/g)[0]
				.split(" or ")[0]
				.replace(/\[1080p\]/, '');
		});
	}
};

export default class MovieScreen extends Component
{
	state : {movieModel:MovieDetails} = {
		movieModel: null
	};

	navigation = null;

	constructor(inProp)
	{
		super(inProp);

		this.navigation = inProp.navigation;
		this.state.movieModel = inProp.route.params
		this.load(this.state.movieModel.id)
	}
	load(id:number)
	{
		TMDB.getDetails(id).then(
			(data :MovieDetails)=>{
				this.setState({movieModel: data});
			});
	}

	render(){
		return (
				<ImageBackground
						source={{uri: this.state.movieModel.backdrop_path}}
						resizeMode="cover"
						style={{width:"100%",flex: 1,justifyContent: "center"}}
					>
					<Image
						source={{ uri: this.state.movieModel.poster_path}}
						style={{
							width: 120,
							height: 150
						}}/>

					<Button
						title="Start video"
						onPress={() => {
							VideoCdnProvider.getVideoUrl(this.state.movieModel)
								.then((url:string)=>{
									console.log(url);
									startVideo(this.state.movieModel.title, url);
								});
							/*GetUrl('https://datalock.ru/player/14425')
								.then((fileUrl :string)=>{
									console.log("fileUrl", fileUrl);
									startVideo(fileUrl);
								});*/
						}}
						/>
				</ImageBackground>
			
		);
	}
}