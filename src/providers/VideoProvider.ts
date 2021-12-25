import FullMovieModel from "src/models/FullMovieModel";
import VideoFileModel from "src/models/VideoFileModel";

export default interface VideoProvider
{
	getProviderTitle() :string;

	getVideos(movieModel:FullMovieModel) :Promise<VideoFileModel[]>;
};
