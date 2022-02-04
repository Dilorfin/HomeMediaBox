import { Injectable } from '@angular/core';
import FullMovieModel from 'src/models/FullMovieModel';
import HistoryModel from 'src/models/HistoryModel';
import ShortMovieModel from 'src/models/ShortMovieModel';
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
			this.watched = JSON.parse(savedHistory, (k, v)=> {
				return k != 'date' ? v : new Date(v);
			});
		}
	}

	watchMovie(movie: ShortMovieModel | FullMovieModel, video: VideoFileModel): void
	{
		if (!this.watched[movie.id])
		{
			this.watched[movie.id] = {
				movie: movie,
				videos: []
			} as HistoryModel;
		}

		if (!this.checkVideoWasWatched(movie, video))
		{
			this.watched[movie.id].videos.push(video);
		}

		this.watched[movie.id].date = new Date();
		localStorage.setItem(this.storageKey, JSON.stringify(this.watched));
	}

	checkVideoWasWatched(movie: ShortMovieModel | FullMovieModel, video: VideoFileModel): boolean
	{
		const watchedVideos = this.getWatchedVideos(movie);
		const wasWatched: VideoFileModel = watchedVideos.find(w =>
		{
			return HistoryService.compareWatchedVideos(video, w);
		});
		return !!wasWatched;
	}

	getWatchedVideos(movie: ShortMovieModel | FullMovieModel): VideoFileModel[]
	{
		if (!this.watched[movie.id])
			return [];
		return this.watched[movie.id].videos;
	}

	getWatchedMovies(): (ShortMovieModel | FullMovieModel)[]
	{
		return Object.values(this.watched).sort((a:HistoryModel, b:HistoryModel)=> {
			return b.date.valueOf() - a.date.valueOf();
		}).map(w => w.movie);
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
