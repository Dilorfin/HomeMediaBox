import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ListModel from 'src/models/ListModel';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit
{
	constructor(public router: Router, private knService: KnowledgeService) { }

	searchText: string;
	list: ListModel[];

	ngOnInit() { }

	onSearchChange(event: any)
	{
		const searchText: string = event.detail.value;

		if(searchText.length < 3)
			return;

		this.knService.search(searchText)
			.then(list =>
				this.list = list.results
			);
	}

	onCardClick(model: ListModel)
	{
		this.router.navigate(['/movie', model.media_type, model.id], { state: model });
	}
}