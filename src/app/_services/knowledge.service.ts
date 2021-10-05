import { Injectable } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';
import KPFilterModel from 'src/models/KPFilterModel';
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

	getFilters(): KPFilterModel[]
	{
		return this.knowledgeProvider.getFilters();
	}

	async getFiltered(filter: KPFilterModel): Promise<PaginationModel<ListModel>>
	{
		return this.knowledgeProvider.getFiltered(filter);
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
