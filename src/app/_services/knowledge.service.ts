import { Injectable } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';
import ListModel from 'src/models/ListModel';
import PaginationModel from 'src/models/PaginationModel';
import TMDB from 'src/providers/knowledge/TMDB';
import KnowledgeProvider from 'src/providers/KnowledgeProvider';

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

	async getPopularMovie(): Promise<PaginationModel<ListModel[]>>
	{
		return this.knowledgeProvider.getPopularMovie();
	}

	async getDetails(listModel: ListModel): Promise<DetailsModel>
	{
		return this.knowledgeProvider.getDetails(listModel);
	}
}
