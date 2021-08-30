import DetailsModel from "../models/DetailsModel";

/*import { MMKV } from 'react-native-mmkv';
	MMKV.set('test', 42);
	console.log(MMKV.getNumber('test'));
	MMKV.clearAll();*/

export interface VideoFileModel
{
	voice_title :string,

	season_id ?:number,
	episode_id ?:number,

	quality :number,
	url :string
}

export default interface VideoProvider
{
	getProviderTitle() :string;

	getVideos(movieModel:DetailsModel) :Promise<VideoFileModel[]>;
};