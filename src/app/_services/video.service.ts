import { Injectable } from '@angular/core';
import VideoCdnProvider from 'src/providers/video/VideoCdn';
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
			new VideoCdnProvider()
		];
	}
}
