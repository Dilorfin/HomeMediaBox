import { Component, OnInit } from '@angular/core';
import ListModel from 'src/models/ListModel';
import { MovieCategory } from 'src/providers/MovieCategory';
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

	history: boolean = false;

	currentCategory: MovieCategory;
	availableCategories :MovieCategory[];
	categories: Map<MovieCategory,
	{
		icon:string,
		title:string
	}>;

	constructor(public knService: KnowledgeService, private historyService: HistoryService)
	{
		this.categories = new Map();
		this.categories.set(MovieCategory.Film, {
			title: 'Films',
			icon: 'film'
		});
		this.categories.set(MovieCategory.Series, {
			title: 'Serials',
			icon: 'albums'
		});
		this.categories.set(MovieCategory.Cartoon, {
			title: 'Cartoons',
			icon: ''
		});
		this.categories.set(MovieCategory.AnimatedSeries, {
			title: 'Animated Series',
			icon: ''
		});

		this.availableCategories = knService.getCategories();
		this.openTab(this.availableCategories[0]);
	}

	ngOnInit()
	{ }

	openHistory()
	{
		this.list = this.historyService.getWatchedMovies() as ListModel[];
		this.history = true;
		this.currentCategory = null;
	}

	openTab(tab: MovieCategory): void
	{
		if (this.currentCategory && this.currentCategory == tab)
			return;

		this.history = false;
		this.currentCategory = tab;
		
		this.knService.getCategory(this.currentCategory)
			.then((result) =>
			{
				this.list = result.results;
			});
	}
}
