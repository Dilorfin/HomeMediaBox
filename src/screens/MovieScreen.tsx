import React, { Component } from 'react';
import { Button, Linking, Platform, Image, ImageBackground } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

import DetailsModel from '../models/DetailsModel';
import shared from '../shared';
import VideoCdnProvider from '../providers/video/VideoCdn';
import ListModel from '../models/ListModel';
import VideoProvider, { SeriesModel } from '../providers/VideoProvider';

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
	state : {movieModel:DetailsModel} = {
		movieModel: null
	};

	navigation = null;
	videoProvider :VideoProvider;

	constructor(inProp)
	{
		super(inProp);

		this.navigation = inProp.navigation;
		this.state.movieModel = inProp.route.params
		this.load(inProp.route.params)
		this.videoProvider = new VideoCdnProvider();
	}
	load(model:ListModel)
	{
		shared.kProvider.getDetails(model).then(
			(data :DetailsModel)=>{
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
							this.videoProvider.getVideoModel(this.state.movieModel)
								.then((res : SeriesModel)=>{
									const url = res.seasons[0].voices[0].episodes[0].files[5].url;
									console.log(url);
									startVideo(this.state.movieModel.title, url);
								});
						}}
						/>
				</ImageBackground>
			
		);
	}
}