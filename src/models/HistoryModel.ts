import DetailsModel from "./DetailsModel";
import ListModel from "./ListModel";
import VideoFileModel from "./VideoFileModel";

export default interface HistoryModel 
{
	date: Date,
	movie: ListModel | DetailsModel,
	videos: VideoFileModel[]
};