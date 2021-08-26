import React, { Component }  from 'react';
import { 
	FlatList,
	ListRenderItemInfo,
	View,
	Text,
} from 'react-native';

import TMDB from '../providers/knowledge/TMDB';
import MovieListResult from '../models/MovieListResult';
import Pagination from '../models/Pagination';
import Card from '../components/card';

export default class MyLayout extends Component {

	state = { listData:null };
	navigation :any = null;
	columnsNumber :number = 4;

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

	renderGridItem(data :ListRenderItemInfo<MovieListResult>)
	{
		return <Card imageUrl={data.item.poster_path}
			width={150}
			height={200}
			title={data.item.title}
			onPress={()=>{
				this.navigation.navigate("MovieScreen", data.item);
				console.log(data.item)}
			}/>;
	}

	render(){
		return (
			<View style={{backgroundColor: 'rgb(30, 30, 30)', flexDirection:"row"}}>
				<View style={{ backgroundColor: "#f0f", flex:1, justifyContent: 'center', alignContent:'center', alignItems: 'center'}}>
					<Text>Test</Text>
				</View>
				<View style={{ flex:4, justifyContent: 'center', alignContent:'center', alignItems: 'center'}}>
					<FlatList
						data={this.state.listData}
						renderItem={(data)=>{return this.renderGridItem(data)}} // TODO: check if it can be remade
						keyExtractor={(item) => item.title} // TODO: change to item.id
						horizontal={false}
						numColumns={this.columnsNumber}
					/>
				</View>
			</View>
		);
	}
};