import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { VideoService } from 'src/app/_services/video.service';
import DetailsModel from 'src/models/DetailsModel';
import VideoFileModel from 'src/models/VideoFileModel';

function filterUnique<T>(array: T[], getValue?: any): T[]
{
	if (getValue)
	{
		return array.filter((value: T, index: number) => index == array.findIndex((el) => getValue(el) == getValue(value)))
			.filter((value: T) => value != null);
	}
	return array.filter((value: T, index: number) => index == array.findIndex((el) => el == value))
		.filter((value: T) => value != null);
}

@Component({
	selector: 'movie-videos',
	templateUrl: './videos.component.html',
	styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit, OnChanges
{
	@Input() movie: DetailsModel;

	filters: Record<string, {
		qualities: number[],
		translations: string[],
		seasons: string[]
	}> = {};

	currentProvider: {
		title: string,
		videos: VideoFileModel[],
		quality: number,
		translation: string,
		season: string
	};
	providers: { title: string, videos: VideoFileModel[] }[];

	constructor(private videoService: VideoService) 
	{ }

	ngOnInit()
	{
		this.providers = [];
	}

	ngOnChanges(changes: SimpleChanges): void
	{
		this.videoService.getVideos(this.movie)
			.forEach(provider =>
				provider.videos.then(videos =>
				{
					const value = { title: provider.title, videos: videos };
					if (!this.currentProvider)
					{
						this.currentProvider = JSON.parse(JSON.stringify(value));
					}
					this.providers.push(value);
					return value;
				}).then((provider) =>
				{
					this.filters[provider.title] = {
						qualities: filterUnique(provider.videos.map(video => video.quality)),
						seasons: filterUnique(provider.videos.map(video => video.season_id)),
						translations: filterUnique(provider.videos.map(video => video.voice_title))
					};

					this.setDefaultFilter();
					this.filterVideos();
				})
			);
	}

	setProvider(event: any)
	{
		const provider = this.providers.filter((provider)=>provider.title == event.detail.value)[0];
		this.currentProvider = JSON.parse(JSON.stringify(provider));
		this.setDefaultFilter();
		this.filterVideos();
	}

	setFilterProperty(property: string, event: any)
	{
		const value = event.detail.value;
		this.currentProvider[property] = value;
		this.filterVideos();
	}

	setDefaultFilter()
	{
		this.currentProvider.quality = this.filters[this.currentProvider.title].qualities[0];
		this.currentProvider.translation = this.filters[this.currentProvider.title].translations[0];
		this.currentProvider.season = this.filters[this.currentProvider.title].seasons.length > 0 ? this.filters[this.currentProvider.title].seasons[0] : null
	}

	filterVideos()
	{
		const provider = this.providers.find((pr) => pr.title == this.currentProvider.title);
		this.currentProvider.videos = provider.videos.filter(videoModel =>
		{
			return videoModel.voice_title == this.currentProvider.translation
				&& videoModel.quality == this.currentProvider.quality
				&& videoModel.season_id == this.currentProvider.season;
		}).sort((a, b) => a.episode_id - b.episode_id);
	}
}
