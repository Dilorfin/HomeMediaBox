import { Injectable } from '@angular/core';
import FullMovieModel from 'src/models/FullMovieModel';
import VideoFileModel from 'src/models/VideoFileModel';
import AnilibriaProvider from 'src/providers/video/Anilibria';
//import VideoCdnProvider from 'src/providers/video/VideoCdn';
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
			//new VideoCdnProvider(),
			new AnilibriaProvider()
		];
	}

	getVideos(movieModel: FullMovieModel): { title: string, videos: Promise<VideoFileModel[]> }[]
	{
		return this.videoProviders.map(provider =>
		{
			const title = provider.getProviderTitle();
			const videos = provider.getVideos(movieModel);
			return { title, videos };
		});
	}

	getProvidersNumber(): number
	{
		return this.videoProviders.length;
	}
}
