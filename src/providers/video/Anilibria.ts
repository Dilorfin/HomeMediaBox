import VideoFileModel from "src/models/VideoFileModel";
import DetailsModel from "../../models/DetailsModel";
import VideoProvider from "../VideoProvider";

export default class AnilibriaProvider implements VideoProvider
{
	private headers: HeadersInit = {
		'Accept': '*/*',
		'Connection': 'keep-alive',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
	};

	constructor()
	{
		
	}

	public getProviderTitle(): string
	{
		return "Anilibria";
	}

	public async getVideos(movieModel: DetailsModel): Promise<VideoFileModel[]>
	{
		return null;
	}
};