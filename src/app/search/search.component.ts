import { Component, OnInit } from '@angular/core';
import ListModel from 'src/models/ListModel';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit
{
	constructor(private knService: KnowledgeService)
	{}

	searchText: string;
	list: ListModel[];

	ngOnInit() { }

	onSearchChange(event: any)
	{
		const searchText: string = event.detail.value;

		if(searchText.length < 3)
			return;

		this.knService.search({text: searchText})
			.then(list =>
				this.list = list.results
			);
	}
}
