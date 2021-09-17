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

	currentFilter: {
		quality: number,
		translation: string,
		season: string
	};
	filters: Record<string, {
		qualities: number[],
		translations: string[],
		seasons: string[]
	}> = {};

	currentProvider: { title: string, videos: VideoFileModel[] };
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
				}).then(() =>
				{
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
		this.currentFilter[property] = value;
		this.filterVideos();
	}

	setDefaultFilter()
	{
		this.filters[this.currentProvider.title] = {
			qualities: filterUnique(this.currentProvider.videos.map(video => video.quality)),
			seasons: filterUnique(this.currentProvider.videos.map(video => video.season_id)),
			translations: filterUnique(this.currentProvider.videos.map(video => video.voice_title))
		};

		this.currentFilter = {
			quality: this.filters[this.currentProvider.title].qualities[0],
			translation: this.filters[this.currentProvider.title].translations[0],
			season: this.filters[this.currentProvider.title].seasons.length > 0 ? this.filters[this.currentProvider.title].seasons[0] : null
		}
	}

	filterVideos()
	{
		const provider = this.providers.find((pr) => pr.title == this.currentProvider.title);
		this.currentProvider.videos = provider.videos.filter(videoModel =>
		{
			return videoModel.voice_title == this.currentFilter.translation
				&& videoModel.quality == this.currentFilter.quality
				&& videoModel.season_id == this.currentFilter.season;
		}).sort((a, b) => a.episode_id - b.episode_id);
	}
}
