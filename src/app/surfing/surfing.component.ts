import { Component, OnInit } from '@angular/core';
import KPFilterModel from 'src/models/KPFilterModel';
import ListModel from 'src/models/ListModel';
import { HistoryService } from '../_services/history.service';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-surfing',
	templateUrl: './surfing.component.html',
	styleUrls: ['./surfing.component.scss'],
})
export class SurfingComponent implements OnInit
{
	list: ListModel[];

	currentFilter: KPFilterModel;

	filters: KPFilterModel[];

	constructor(public knService: KnowledgeService, private historyService: HistoryService)
	{
		this.filters = knService.getFilters();
		this.openTab(this.filters[0]);
	}

	ngOnInit()
	{ }

	openHistory()
	{
		this.list = this.historyService.getWatchedMovies() as ListModel[];
		this.currentFilter = {
			id: 'history',
			title: 'History'
		} as KPFilterModel;
	}

	openTab(tab: KPFilterModel): void
	{
		if (this.currentFilter && this.currentFilter.id == tab.id)
			return;

		this.currentFilter = tab;
		this.knService.getFiltered(this.currentFilter)
			.then((result) =>
			{
				this.list = result.results;
			});
	}
}
