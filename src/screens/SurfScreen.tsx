import React, { Component }  from 'react';
import { Image, FlatList, ListRenderItemInfo, TouchableOpacity} from 'react-native';

import TMDB from '../providers/TMDB';
import MovieListResult from '../models/MovieListResult';
import Pagination from '../models/Pagination';

const Card = ({imageUrl, onPress}) => (
	<TouchableOpacity onPress={onPress} style={{padding:10}}>
		<Image
			source={{ uri: imageUrl }}
			style={{
				width: 150,
				height: 200}}
				/>
	</TouchableOpacity>
);

export default class MyLayout extends Component {

	state = { listData:null };
	navigation :any = null;

	constructor(props)
	{
		super(props);

		this.navigation = props.navigation;
		this.load();
	}

	load()
	{
		TMDB.getPopularMovie().then(
			(data :Pagination<MovieListResult[]>)=>{
				this.setState({listData: data.results});
			});
	}
	render(){
		return (
			<FlatList
				data={this.state.listData}
				renderItem={
					(data : ListRenderItemInfo<MovieListResult>)=>
						<Card imageUrl={data.item.poster_path}
							onPress={()=>{
								this.navigation.navigate("MovieScreen", data.item);
								console.log(data.item)}
							}/>
					}
				keyExtractor={(item) => item.title}
				horizontal={false}
				numColumns={5}
			/>
		);
	}

};