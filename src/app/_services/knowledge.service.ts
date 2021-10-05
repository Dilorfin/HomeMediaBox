import { Injectable } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';
import ListModel from 'src/models/ListModel';
import PaginationModel from 'src/models/PaginationModel';
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

	async getCategory(category: MovieCategory): Promise<PaginationModel<ListModel>>
	{
		return this.knowledgeProvider.getCategory(category);
	}

	async getDetails(listModel: ListModel): Promise<DetailsModel>
	{
		return this.knowledgeProvider.getDetails(listModel);
	}

	async search(text: string): Promise<PaginationModel<ListModel>>
	{
		return this.knowledgeProvider.search(text);
	}
}
