import { Component, OnInit } from '@angular/core';
import ListModel from 'src/models/ListModel';
import { KnowledgeService } from '../_services/knowledge.service';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit
{
	constructor(private knService: KnowledgeService,
		private platform: Platform,
		private location: Location)
	{}

	showTop: boolean = false;

	searchText: string;
	list: ListModel[];

	ngOnInit() 
	{
		this.showTop = !this.platform.is('android');
	}

	onSearchChange(event: any)
	{
		const searchText: string = event.detail.value;

		if(searchText.length < 3)
			return;

		this.knService.search({text: searchText})
			.then(list =>
				this.list = list.results.filter(m => m.poster_path)
			);
	}

	goBack(): void
	{
		this.location.back();
	}
}
