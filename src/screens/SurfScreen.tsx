import React, { Component }  from 'react';
import {
	FlatList,
	ListRenderItemInfo,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import ListModel from '../models/ListModel';
import PaginationModel from '../models/PaginationModel';
import Card from '../components/card';
import defaults from '../defaults';

export default class SurfScreen extends Component
{
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
		defaults.kProvider.getPopularMovie().then(
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
			<View style={styles.container}>
				<View style={styles.leftMenu}>
					<TouchableOpacity onPress={()=>{this.openSearch()}}>
						<Text>Search</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.cardsGrid}>
					<FlatList
						data={this.state.listData}
						renderItem={(data:ListRenderItemInfo<ListModel>)=>( // TODO: check if it can be remade
						<Card imageUrl={data.item.poster_path}
							width={150}
							height={200}
							title={data.item.title}
							onPress={()=>
								this.navigation.navigate("MovieScreen", data.item)
							}/>)
						}
						keyExtractor={(item) => item.id}
						horizontal={false}
						numColumns={this.columnsNumber}
					/>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgb(30, 30, 30)',
		flexDirection: "row"
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