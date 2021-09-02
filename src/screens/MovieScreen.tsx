import React, { Component } from 'react';
import {
	Linking,
	Platform,
	Image,
	ImageBackground,
	ScrollView,
	View,
	TouchableOpacity,
	Text,
	ListRenderItemInfo,
	FlatList,
	SafeAreaView
} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';

import DetailsModel from '../models/DetailsModel';
import shared from '../shared';
import VideoCdnProvider from '../providers/video/VideoCdn';
import ListModel from '../models/ListModel';
import VideoProvider, { VideoFileModel } from '../providers/VideoProvider';
import { Dimensions } from 'react-native';

function startVideo(title: string, url: string) {
	const m = url.match(/http(s)?:\/\//g);
	if (m.length != 1) {
		console.error(`not valid url ${url}`);
		return;
	}
	Platform.select({
		android() {
			SendIntentAndroid.openAppWithData(
				null,
				url,
				"video/*",
				{
					'title': title
				}
			).then(wasOpened => { });
		},
		default() {
			Linking.openURL(url).catch(err => { console.error(err); });
		}
	})();
}

function filterUnique(array: any[], getValue?: any) {
	if (getValue) {
		return array.filter((value: any, index: number) => index == array.findIndex((el) => getValue(el) == getValue(value)));
	}
	return array.filter((value: any, index: number) => index == array.findIndex((el) => el == value));
}

export default class MovieScreen extends Component {
	state: {
		movieModel: DetailsModel,
		videos: VideoFileModel[],
		videoQuery: VideoFileModel[],
		tab: 'list' | 'info'
	} = {
			movieModel: null,
			videos: null,
			videoQuery: null,
			tab: 'info'
		};

	navigation = null;
	videoProvider: VideoProvider;
	
	voiceTitles :string[];
	seasons :number[];
	qualities :number[];

	constructor(inProp) {
		super(inProp);

		this.navigation = inProp.navigation;
		this.state.movieModel = inProp.route.params
		this.videoProvider = new VideoCdnProvider();
		this.load(inProp.route.params)
	}

	load(model: ListModel) {
		shared.kProvider.getDetails(model).then(
			(data: DetailsModel) => {
				this.setState({ movieModel: data });
			}).then(() => {
				this.videoProvider.getVideos(this.state.movieModel)
					.then((res: VideoFileModel[]) => {
						this.setState({ videos: res });
					})
					.then(() => {
						this.voiceTitles = this.state.videos.map((value: VideoFileModel) => value.voice_title);
						this.voiceTitles = filterUnique(this.voiceTitles);
						this.seasons = this.state.videos.map((value: VideoFileModel) => value.season_id);
						this.seasons = filterUnique(this.seasons);
						this.qualities = this.state.videos.map((value: VideoFileModel) => value.quality);
						this.qualities = filterUnique(this.qualities);

						console.log(this.voiceTitles);
						console.log(this.seasons);
						console.log(this.qualities);
					});
			});
	}

	render() {
		return (
			<ImageBackground
				source={{ uri: this.state.movieModel.backdrop_path }}
				resizeMode="cover"
				style={{ flex: 1 }}>
				<SafeAreaView >
					<View style={{
						width: "100%",
						height: Dimensions.get("window").height / 2
					}} />
					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-around'
					}}>
						<View style={{
							padding: 25,
							backgroundColor: 'rgba(20,20,20,0.85)',
							width: '75%'
						}}>
							{this.state.tab == 'info' ? this.renderInfo() : this.renderVideosList()}
						</View>
					</View>
				</SafeAreaView >
			</ImageBackground>

		);
	}
	renderVideosList() {/*{!this.state.videos ? <View /> : this.buttons()} */
		return (<View style={{ minHeight: Dimensions.get("window").height / 2 }}>
			<View style={{ flexDirection: 'row' }}>
				<View>
					<TouchableOpacity
						style={{
							minWidth: 150,
							backgroundColor: '#aaaaaaaa',
							padding: 5,
							borderRadius: 10,
							marginRight: 10
						}}
						onPress={() => {
							this.setState({ tab: 'info' });
						}}>
						<Text style={{ color: '#fff' }}>Back to info</Text>
					</TouchableOpacity>
					<Text style={{
						minWidth: 150,
						padding: 5,
						borderRadius: 10,
						marginRight: 10,
						color: '#fff'
					}}>
						{this.videoProvider.getProviderTitle()}
					</Text>
					<Text style={{
						minWidth: 150,
						padding: 5,
						borderRadius: 10,
						marginRight: 10,
						color: '#fff'
					}}>
						{this.voiceTitles[0]}
					</Text>
					<Text style={{
						minWidth: 150,
						padding: 5,
						borderRadius: 10,
						marginRight: 10,
						color: '#fff'
					}}>
						{this.seasons.length}
					</Text>
					<Text style={{
						minWidth: 150,
						padding: 5,
						borderRadius: 10,
						marginRight: 10,
						color: '#fff'
					}}>
						{this.qualities[0]}
					</Text>
				</View>
				<FlatList
					horizontal={false}
					data={this.state.videos}
					renderItem={(data: ListRenderItemInfo<VideoFileModel>) => {
						return (
							<TouchableOpacity onPress={() => {
								startVideo(this.state.movieModel.title, data.item.url);
							}}>
								<Text style={{ color: '#fff' }}>{data.item.season_id} - {data.item.episode_id} - {data.item.voice_title} - {data.item.quality}</Text>
							</TouchableOpacity>
						)
					}}
				/>
			</View>
		</View>);
	}
	renderInfo() {
		return (<View style={{ flexDirection: 'row' }}>
			<Image
				source={{ uri: this.state.movieModel.poster_path }}
				style={{
					marginRight: 20,
					width: 150,
					height: 200,
				}} />
			<View>
				<Text style={{ color: '#fff', fontSize: 26, textAlign: 'center', marginBottom: 20 }}>
					{this.state.movieModel.title}
				</Text>
				<View style={{ flexDirection: 'row', marginBottom: 20 }}>
					<TouchableOpacity
						style={{
							backgroundColor: '#aaaaaaaa',
							padding: 5,
							borderRadius: 10,
							marginRight: 10
						}}
						onPress={() => {
							this.setState({ tab: 'list' });
						}}>
						<Text style={{ color: '#fff' }}>Videos</Text>
					</TouchableOpacity>
				</View>


				<Text style={{ color: '#fff' }}>imdb_id: {this.state.movieModel.imdb_id}</Text>
				<Text style={{ color: '#fff' }}>media_type: {this.state.movieModel.media_type}</Text>
				<Text style={{ color: '#fff' }}>TMDB rating: {this.state.movieModel.vote_average} (votes: {this.state.movieModel.vote_count})</Text>
				{this.state.movieModel.production_countries ? <Text style={{ color: '#fff' }}>{this.state.movieModel.production_countries.map((value) => value.name).join('-')}</Text> : null}
				<Text style={{ color: '#fff' }}>Original title: {this.state.movieModel.original_title}</Text>
				<Text style={{ color: '#fff' }}>Runtime: {this.state.movieModel.runtime}m</Text>
				<Text style={{ color: '#fff' }}>Status: {this.state.movieModel.status}</Text>
				{this.state.movieModel.number_of_seasons ? <Text style={{ color: '#fff' }}>Seasons number: {this.state.movieModel.number_of_seasons}</Text> : null}
				{this.state.movieModel.number_of_episodes ? <Text style={{ color: '#fff' }}>Episodes number: {this.state.movieModel.number_of_episodes}</Text> : null}

			</View>
		</View>);
	}
}