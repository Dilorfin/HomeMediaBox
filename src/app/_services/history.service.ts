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
		if(savedHistory)
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
		this.watched[full_id].date = new Date();
		this.watched[full_id].videos.push(video);
		localStorage.setItem(this.storageKey, JSON.stringify(this.watched));
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
}
