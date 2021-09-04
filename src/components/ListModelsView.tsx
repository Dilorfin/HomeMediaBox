import React, { useState } from "react";
import { ListRenderItemInfo,
	StyleProp,
	ViewStyle, 
	LayoutChangeEvent,
	FlatList,
	View,
	Text
} from "react-native";

import ListModel from "../models/ListModel";
import Card from "./Card";

/*
make manual focusing, check "nextFocus*" callbacks
 */

export default function ListModelsView(props : { 
	data :readonly ListModel[], 
	onItemPress :(data:ListRenderItemInfo<ListModel>)=> void, 
	style : StyleProp<ViewStyle>
})
{
	const cardSizes: {w:number, h:number, m:number} = {
		w: 150,
		h: 200,
		m: 10
	};
	const [columnsNumber, setColumnsNumber] = useState(1);

	function onLayout(event :LayoutChangeEvent) {
		const frame :{width :number, height :number} = event.nativeEvent.layout;
		setColumnsNumber(Math.floor(frame.width/(cardSizes.w+cardSizes.m*2)))
	}

	return (<View style={[props.style]}
				onLayout={(event:LayoutChangeEvent)=>{onLayout(event)}}>
				<FlatList
					/* TODO: onEndReached && onEndReachedThreshold */
					ListEmptyComponent={<Text>Nothing</Text>}
					data={props.data}
					renderItem={(data :ListRenderItemInfo<ListModel>)=>( // TODO: check if it can be remade
					<Card imageUrl={data.item.poster_path}
						width={cardSizes.w}
						height={cardSizes.h}
						margin={cardSizes.m}
						title={data.item.title}
						style={{width:cardSizes.w, height:cardSizes.h}}
						onPress={()=>
							props.onItemPress(data)
						}/>)
					}
					keyExtractor={(item) => item.id}
					key={columnsNumber}
					horizontal={false}
					numColumns={columnsNumber}
				/>
			</View>)
}