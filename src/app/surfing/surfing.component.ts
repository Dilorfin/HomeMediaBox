import { Component, OnInit } from '@angular/core';
import KPFilterModel from 'src/models/KPFilterModel';
import ListModel from 'src/models/ListModel';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-surfing',
	templateUrl: './surfing.component.html',
	styleUrls: ['./surfing.component.scss'],
})
export class SurfingComponent implements OnInit
{
	list: ListModel[];

	currentTab: KPFilterModel;

	private filters:KPFilterModel[];

	constructor(public knService: KnowledgeService)
	{
		this.filters = knService.getFilters();
		this.openTab(this.filters[0]);
	}

	ngOnInit()
	{}

	openTab(tab: KPFilterModel): void
	{
		if(this.currentTab && this.currentTab.id == tab.id)
			return;

		this.currentTab = tab;
		this.knService.getFiltered(this.currentTab)
			.then((result) =>
			{
				this.list = result.results;
			});
	}
}
