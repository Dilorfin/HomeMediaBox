import DetailsModel from "src/models/DetailsModel";
import VideoFileModel from "src/models/VideoFileModel";

export default interface VideoProvider
{
	getProviderTitle() :string;

	getVideos(movieModel:DetailsModel) :Promise<VideoFileModel[]>;
};
