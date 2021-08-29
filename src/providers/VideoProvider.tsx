import DetailsModel from "../models/DetailsModel";

/*import { MMKV } from 'react-native-mmkv';
	MMKV.set('test', 42);
	console.log(MMKV.getNumber('test'));
	MMKV.clearAll();*/

export interface MovieModel
{
	voices :{
		title :string,
		files :{
			quality :number,
			url :string
		}[]
	}[]
}

export interface SeriesModel
{
	seasons :{
		voices :{
			title :string,
			episodes:{
				id :number,
				files :{
					quality :number,
					url :string
				}[]
			}[]
		}[]
	}[];
}

export default interface VideoProvider
{
	getProviderTitle() :string;

	getVideoModel(movieModel:DetailsModel) :Promise<MovieModel|SeriesModel>;
};