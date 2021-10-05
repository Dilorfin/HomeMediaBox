import { Injectable } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';
import HistoryModel from 'src/models/HistoryModel';
import ListModel from 'src/models/ListModel';
import VideoFileModel from 'src/models/VideoFileModel';

@Injectable({
	providedIn: 'root'
})
export class HistoryService
{
	private watched: Record<string, HistoryModel> = {};

	private storageKey: string = 'history';

	constructor()
	{
		const savedHistory = localStorage.getItem(this.storageKey);
		if (savedHistory)
		{
			this.watched = JSON.parse(savedHistory);
		}
	}

	watchMovie(movie: ListModel | DetailsModel, video: VideoFileModel): void
	{
		const full_id: string = `${movie.media_type}/${movie.id}`;

		if (!this.watched[full_id])
		{
			this.watched[full_id] = {
				movie: movie,
				videos: []
			} as HistoryModel;
		}		
		
		if (!this.wasWatched(movie, video))
		{
			this.watched[full_id].videos.push(video);
			localStorage.setItem(this.storageKey, JSON.stringify(this.watched));
		}

		this.watched[full_id].date = new Date();
	}

	wasWatched(movie: ListModel | DetailsModel, video: VideoFileModel): boolean
	{
		const watchedVideos = this.getWatchedVideos(movie);
		const wasWatched: VideoFileModel = watchedVideos.find(w =>
		{
			return HistoryService.compareWatchedVideos(video, w);
		});
		return !!wasWatched;
	}

	getWatchedVideos(movie: ListModel | DetailsModel): VideoFileModel[]
	{
		const full_id: string = `${movie.media_type}/${movie.id}`;
		if (!this.watched[full_id])
			return [];
		return this.watched[full_id].videos;
	}

	getWatchedMovies(): (ListModel | DetailsModel)[]
	{
		return Object.values(this.watched).map(w => w.movie);
	}

	clear()
	{
		this.watched = {};
		localStorage.setItem(this.storageKey, JSON.stringify(this.watched));
	}

	private static compareWatchedVideos(a: VideoFileModel, b: VideoFileModel)
	{
		return a.episode_id === b.episode_id
			&& a.season === b.season;
	}
}
