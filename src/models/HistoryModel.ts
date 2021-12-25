import FullMovieModel from "./FullMovieModel";
import ShortMovieModel from "./ShortMovieModel";
import VideoFileModel from "./VideoFileModel";

export default interface HistoryModel 
{
	date: Date,
	movie: ShortMovieModel | FullMovieModel,
	videos: VideoFileModel[]
};