import React, { Component } from 'react';
import { Button, Linking, Platform, Image, ImageBackground } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

import MovieDetails from '../models/MovieDetails';
import defaults from '../defaults';
import VideoCdnProvider from '../providers/video/VideoCdn';

function startVideo(title :string, url :string)
{
	const m = url.match(/http(s)?:\/\//g);
	if (m.length != 1){
		console.error(`not valid url ${url}`);
		return;
	}
	Platform.select({
		android() 
		{
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
		default()
		{
			Linking.openURL(url).catch(err => {console.error(err);});
		}
	})();
}

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
	load(id:string)
	{
		defaults.kProvider.getMovieDetails(id).then(
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