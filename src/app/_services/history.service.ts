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
			this.watched = JSON.parse(savedHistory);
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

		if (!this.wasWatched(movie, video))
		{
			this.watched[movie.id].videos.push(video);
			localStorage.setItem(this.storageKey, JSON.stringify(this.watched));
		}

		this.watched[movie.id].date = new Date();
	}

	wasWatched(movie: ShortMovieModel | FullMovieModel, video: VideoFileModel): boolean
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
