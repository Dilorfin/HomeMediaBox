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

	async getDetails(listModel: ShortMovieModel): Promise<FullMovieModel>
	{
		return this.knowledgeProvider.getDetails(listModel);
	}

	async search(text: SearchModel): Promise<PaginationModel<ShortMovieModel>>
	{
		return this.knowledgeProvider.search(text);
	}
}
