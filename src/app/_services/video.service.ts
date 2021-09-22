import { Injectable } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';
import VideoFileModel from 'src/models/VideoFileModel';
import VideoCdnProvider from 'src/providers/video/VideoCdn';
import KinobProvider from 'src/providers/video/Kinob';
import VideoProvider from 'src/providers/VideoProvider';

@Injectable({
	providedIn: 'root'
})
export class VideoService
{
	private videoProviders: VideoProvider[];

	constructor()
	{
		this.videoProviders = [
			//new VideoCdnProvider()
			new KinobProvider()
		];
	}

	getVideos(movieModel: DetailsModel): {title:string, videos:Promise<VideoFileModel[]>}[]
	{
		return this.videoProviders.map(provider=>{
			const title = provider.getProviderTitle();
			const videos = provider.getVideos(movieModel);
			return {title, videos};
		});
	}
}
