import React, { Component} from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Card from '../components/card';
import defaults from '../defaults';
import ListModel from '../models/ListModel';
import PaginationModel from '../models/PaginationModel';

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

		defaults.kProvider.search(text).then(
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
				<View style={styles.cardsGrid}>
				{!this.state.listData?<Text>Nothing</Text>:
					<FlatList
						data={this.state.listData}
						renderItem={(data)=>( // TODO: check if it can be remade
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
						numColumns={5}
					/>}
				</View>
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