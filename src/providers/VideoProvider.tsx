import DetailsModel from "../models/DetailsModel";

/*import { MMKV } from 'react-native-mmkv';
	MMKV.set('test', 42);
	console.log(MMKV.getNumber('test'));
	MMKV.clearAll();*/

export interface MovieModel
{
	voices :{
		voice_id :number, // TODO: check if it's needed
		title :string,
		files :{
			quality :number,
			url :string
		}[]
	}[]
}

export interface SeriesModel
{
	episodes :{
		voice_id:number,
		voice_title:string,
		season_id:number,
		episode_id:number,
		files :{
			quality :number,
			url :string
		}[]
	}[];
}

export default interface VideoProvider
{
	getProviderTitle() :string;

	getVideoModel(movieModel:DetailsModel) :Promise<MovieModel|SeriesModel>;
};