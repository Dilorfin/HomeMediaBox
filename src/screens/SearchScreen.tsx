import React, { Component} from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import shared from '../shared';
import ListModel from '../models/ListModel';
import PaginationModel from '../models/PaginationModel';
import ListModelsView from '../components/ListModelsView';

export default class SearchScreen extends Component
{
	state = {
		listData:null
	};
	navigation :any = null;

	constructor(props)
	{
		super(props);

		this.navigation = props.navigation;
	}

	search(text :string)
	{
		if (text.length <= 2) 
			return;

		shared.kProvider.search(text).then(
			(data :PaginationModel<ListModel[]>)=>{
				this.setState({listData: data.results});
			});
	}

	render()
	{
		return (
			<View style={styles.container}>
				<TextInput
					autoFocus={true}
					onChangeText={(text:string)=>this.search(text)}
				/>
				<ListModelsView 
					style={styles.cardsGrid}
					data={this.state.listData}
					onItemPress={(data)=>
						this.navigation.navigate("MovieScreen", data.item)
					}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgb(30, 30, 30)',
		flexDirection: 'column',
		width:'100%',
		height:'100%'
	},
	cardsGrid: {
		flex: 4,
		justifyContent: 'center',
		alignContent:'center',
		alignItems: 'center'
	},
	textInput: {
		backgroundColor: 'rgb(55, 55, 55)',
		flex:1,
		
	}
});