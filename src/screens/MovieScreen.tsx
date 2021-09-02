import React, { Component } from 'react';
import { 
	Linking,
	Platform, 
	Image, 
	ImageBackground, 
	ScrollView, 
	View, 
	TouchableOpacity, 
	Text 
} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

import DetailsModel from '../models/DetailsModel';
import shared from '../shared';
import VideoCdnProvider from '../providers/video/VideoCdn';
import ListModel from '../models/ListModel';
import VideoProvider, { VideoFileModel } from '../providers/VideoProvider';
import { Dimensions } from 'react-native';

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
	state : {movieModel:DetailsModel, videos:VideoFileModel[]} = {
		movieModel: null,
		videos: null
	};

	navigation = null;
	videoProvider :VideoProvider;
	b:number = 0;

	constructor(inProp)
	{
		super(inProp);

		this.navigation = inProp.navigation;
		this.state.movieModel = inProp.route.params
		this.videoProvider = new VideoCdnProvider();
		this.load(inProp.route.params)
	}

	load(model:ListModel)
	{
		shared.kProvider.getDetails(model).then(
			(data :DetailsModel)=>{
				this.setState({movieModel: data});
			}).then(()=>{
				this.videoProvider.getVideos(this.state.movieModel)
					.then((res : VideoFileModel[])=>{
						console.log(this.state.videos)
						this.setState({ videos: res });
						console.log(this.state.videos.length)
					})
			});
	}

	buttons()
	{
		return this.state.videos.map((video:VideoFileModel)=>{
			this.b++;
			if(this.b<6)
				return <TouchableOpacity
					key={video.url}
					style={{
						backgroundColor:'#aaaaaaaa',
						padding:5,
						borderRadius:10,
						marginRight:10
					}}
					onPress={() => {
						startVideo(this.state.movieModel.title, video.url);
					}}>
						<Text style={{color:'#fff'}}>Start video</Text>
				</TouchableOpacity>
		})
	}

	render(){
		return (
			<ImageBackground
					source={{uri: this.state.movieModel.backdrop_path}}
					resizeMode="cover"
					style={{flex: 1}}>
				<ScrollView>
					<View style={{
						width:"100%",
						height:Dimensions.get("window").height/2
					}}/>
					<View style={{
						flexDirection:'row',
						justifyContent:'space-around'
					}}>
						<View style={{
							padding: 25,
							flexDirection:'row',
							backgroundColor:'rgba(20,20,20,0.85)'
						}}>
							<Image
								source={{ uri: this.state.movieModel.poster_path}}
								style={{
									marginRight:20,
									width: 150,
									height: 200,
								}}/>
							<View style={{width:'75%'}}>
								<Text style={{color:'#fff', fontSize: 26, textAlign:'center', marginBottom:20}}>
									{this.state.movieModel.title}
								</Text>
								<View style={{flexDirection:'row', marginBottom:20}}>
									{!this.state.videos? <View/>:this.buttons()}
								</View>

								
								<Text style={{color:'#fff'}}>imdb_id: {this.state.movieModel.imdb_id}</Text>
								<Text style={{color:'#fff'}}>media_type: {this.state.movieModel.media_type}</Text>
								<Text style={{color:'#fff'}}>TMDB rating: {this.state.movieModel.vote_average} (votes: {this.state.movieModel.vote_count})</Text>
								{this.state.movieModel.production_countries?<Text style={{color:'#fff'}}>{this.state.movieModel.production_countries.map((value)=>value.name).join('-')}</Text>:null}
								<Text style={{color:'#fff'}}>Original title: {this.state.movieModel.original_title}</Text>
								<Text style={{color:'#fff'}}>Runtime: {this.state.movieModel.runtime}m</Text>
								<Text style={{color:'#fff'}}>Status: {this.state.movieModel.status}</Text>
								{this.state.movieModel.number_of_seasons? <Text style={{color:'#fff'}}>Seasons number: {this.state.movieModel.number_of_seasons}</Text>:null}
								{this.state.movieModel.number_of_episodes? <Text style={{color:'#fff'}}>Episodes number: {this.state.movieModel.number_of_episodes}</Text>:null}
								
							</View>
						</View>
					</View>
				</ScrollView>
			</ImageBackground>
			
		);
	}
}