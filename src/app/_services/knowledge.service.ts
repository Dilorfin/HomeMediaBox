import { Injectable } from '@angular/core';
import FullMovieModel from 'src/models/FullMovieModel';
import ShortMovieModel from 'src/models/ShortMovieModel';
import PaginationModel from 'src/models/PaginationModel';
import SearchModel from 'src/models/SearchModel';
import TMDB from 'src/providers/knowledge/TMDB';
import KnowledgeProvider from 'src/providers/KnowledgeProvider';
import { MovieCategory } from 'src/providers/MovieCategory';

@Injectable({
	providedIn: 'root'
})
export class KnowledgeService
{
	private knowledgeProvider: KnowledgeProvider;
	private lastFullModel: FullMovieModel;

	constructor()
	{
		this.knowledgeProvider = new TMDB();
	}

	getCategories(): MovieCategory[]
	{
		return this.knowledgeProvider.getCategories();
	}

	async getCategory(category: MovieCategory): Promise<PaginationModel<ShortMovieModel>>
	{
		return this.knowledgeProvider.getCategory(category);
	}

	async getDetailsById(movieId:string): Promise<FullMovieModel>
	{
		const tempMovie: ShortMovieModel = {
			id: movieId
		} as ShortMovieModel;

		return this.getDetails(tempMovie);
	}
	async getDetails(listModel: ShortMovieModel): Promise<FullMovieModel>
	{
		if(this.lastFullModel && listModel.id == this.lastFullModel.id)
		{
			return this.lastFullModel;
		}

		return this.knowledgeProvider.getDetails(listModel)
			.then((value: FullMovieModel)=>{
				this.lastFullModel = value;
				return value;
			});
	}

	async search(text: SearchModel): Promise<PaginationModel<ShortMovieModel>>
	{
		return this.knowledgeProvider.search(text);
	}
}
