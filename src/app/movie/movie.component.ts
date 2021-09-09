import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DetailsModel from 'src/models/DetailsModel';
import ListModel from 'src/models/ListModel';
import VideoFileModel from 'src/models/VideoFileModel';
import { KnowledgeService } from '../_services/knowledge.service';
import { VideoService } from '../_services/video.service';

function filterUnique<T>(array: T[], getValue?: any): T[]
{
	if (getValue)
	{
		return array.filter((value: T, index: number) => index == array.findIndex((el) => getValue(el) == getValue(value)))
			.filter((value:T)=> value != null);
	}
	return array.filter((value: T, index: number) => index == array.findIndex((el) => el == value))
		.filter((value:T)=> value != null);
}

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit
{
	movie: DetailsModel;
	providers: { title: string, videos: VideoFileModel[] }[];

	currentProvider: { title: string, videos: VideoFileModel[] };
	currentFilter: {
		quality: number,
		translation: string,
		season: number
	};
	filters: Record<string, {
		qualities: number[],
		translations: string[],
		seasons: number[]
	}> = {};

	constructor(public router: Router, private knService: KnowledgeService,
		private videoService: VideoService)
	{ }

	ngOnInit()
	{
		this.movie = this.router.getCurrentNavigation().extras.state as DetailsModel;
		this.providers = [];

		this.knService.getDetails(this.movie as unknown as ListModel)// ???
			.then((value: DetailsModel) =>
			{
				this.movie = value;
				this.videoService.getVideos(value)
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
							if (!this.currentFilter)
							{
								console.log(this.filters[provider.title].seasons);

								this.currentFilter = {
									quality: this.filters[provider.title].qualities[0],
									translation: this.filters[provider.title].translations[0],
									season: this.filters[provider.title].seasons.length>0?this.filters[provider.title].seasons[0]:null
								}
							}
						})
						.then(()=>{
							this.filterVideos();
						})
					);
			});
	}

	setFilterProperty(property:string, event:any)
	{
		const value = event.detail.value;
		this.currentFilter[property] = value;
		this.filterVideos();
	}

	filterVideos()
	{
		const provider = this.providers.find((pr)=>pr.title == this.currentProvider.title);
		this.currentProvider.videos = provider.videos.filter(videoModel=>{
			return videoModel.voice_title == this.currentFilter.translation
				&& videoModel.quality == this.currentFilter.quality
				&& videoModel.season_id == this.currentFilter.season;
		})
		.sort((a, b)=> a.episode_id - b.episode_id);
	}
}
