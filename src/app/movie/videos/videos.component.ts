import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HistoryService } from 'src/app/_services/history.service';
import { VideoService } from 'src/app/_services/video.service';
import DetailsModel from 'src/models/DetailsModel';
import VideoFileModel from 'src/models/VideoFileModel';

@Component({
	selector: 'movie-videos',
	templateUrl: './videos.component.html',
	styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit, OnChanges
{
	@Input() movie: DetailsModel;
	@Output() openInfo = new EventEmitter<void>();

	currentFilter: {
		provider_title: string,
		videos: VideoFileModel[],
		quality: number,
		translation: string,
		season: string
	};

	providers: { provider_title: string, videos: VideoFileModel[] }[] = [];
	filters: Record<string, {
		qualities: number[],
		translations: string[],
		seasons: string[]
	}> = {};

	constructor(private videoService: VideoService,
		private historyService: HistoryService)
	{ }

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges): void
	{
		this.videoService.getVideos(this.movie)
			.forEach(provider =>
				provider.videos.then(videos =>
				{
					if (!videos || videos.length <= 0)
						return;

					const value = { provider_title: provider.title, videos: videos };
					if (!this.currentFilter)
					{
						this.currentFilter = JSON.parse(JSON.stringify(value));
					}
					this.providers.push(value);
					return value;
				}).then((provider) => this.createFilters(provider))
				.then(provider => this.markWatched(provider))
			);
	}

	openVideo(video: VideoFileModel)
	{
		this.historyService.watchMovie(this.movie, video);
		this.historyService.getWatchedMovies();

		this.providers.forEach(p => this.markWatched(p))

		window.open(video.url);
	}

	setProvider(event: any)
	{
		const provider = this.providers.filter(provider => provider.provider_title == event.detail.value)[0];
		this.currentFilter = JSON.parse(JSON.stringify(provider));
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
		this.currentFilter.quality = this.filters[this.currentFilter.provider_title].qualities[0];
		this.currentFilter.translation = this.filters[this.currentFilter.provider_title].translations[0];
		this.currentFilter.season = this.filters[this.currentFilter.provider_title].seasons.length > 0 ? this.filters[this.currentFilter.provider_title].seasons[0] : null
	}

	filterVideos()
	{
		const provider = this.providers.find((pr) => pr.provider_title == this.currentFilter.provider_title);
		this.currentFilter.videos = provider.videos.filter(videoModel =>
		{
			return videoModel.voice_title == this.currentFilter.translation
				&& videoModel.quality == this.currentFilter.quality
				&& videoModel.season == this.currentFilter.season;
		}).sort((a, b) => a.episode_id - b.episode_id);
	}

	private createFilters(provider : { provider_title: string, videos: VideoFileModel[] })
	{
		if (!provider)
			return;

		this.filters[provider.provider_title] = {
			qualities: provider.videos.map(video => video.quality).filterUnique(),
			seasons: provider.videos.map(video => video.season).filterUnique(),
			translations: provider.videos.map(video => video.voice_title).filterUnique()
		};

		this.setDefaultFilter();
		this.filterVideos();

		return provider;
	}

	private markWatched(provider)
	{
		if (!provider)
			return;

		provider.videos = provider.videos.map((video: VideoFileModel) =>
		{
			video.watched = this.historyService.wasWatched(this.movie, video);
			return video;
		});
	}
}
