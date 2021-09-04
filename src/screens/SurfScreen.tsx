import React, { Component }  from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

import ListModelsView from '../components/ListModelsView';
import ListModel from '../models/ListModel';
import PaginationModel from '../models/PaginationModel';
import shared from '../shared';

export default class SurfScreen extends Component
{
	state = { 
		listData: null,
	};
	navigation :any = null;
	
	styles = landscapeStyles;

	constructor(props)
	{
		super(props);
		this.navigation = props.navigation;
		this.load();
	}


	load()
	{
		shared.kProvider.getPopularMovie().then(
			(data :PaginationModel<ListModel[]>)=>{
				this.setState({listData: data.results});
			});
	}

	openSearch() :void
	{
		this.navigation.navigate("SearchScreen");
	}

	render(): JSX.Element
	{
		return (
			<View style={this.styles.container}>
				<View style={this.styles.leftMenu}>
					<TouchableOpacity onPress={()=>{this.openSearch()}}>
						<Text>Search</Text>
					</TouchableOpacity>
				</View>
				<ListModelsView 
					style={this.styles.cardsGrid}
					data={this.state.listData}
					onItemPress={(data)=>
						this.navigation.navigate("MovieScreen", data.item)
					}
				/>
			</View>
		);
	}
};

const landscapeStyles = StyleSheet.create({
	container: {
		backgroundColor: 'rgb(30, 30, 30)',
		flexDirection: 'row'
	},
	cardsGrid: {
		flex:4,
		justifyContent: 'center',
		alignContent:'center',
		alignItems: 'center'
	},
	leftMenu: {
		backgroundColor: 'rgb(55, 55, 55)',
		flex:1,
		justifyContent: 'center',
		alignContent:'center',
		alignItems: 'center'
	}
});