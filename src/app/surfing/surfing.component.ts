import { Component, OnInit } from '@angular/core';
import ListModel from 'src/models/ListModel';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-surfing',
	templateUrl: './surfing.component.html',
	styleUrls: ['./surfing.component.scss'],
})
export class SurfingComponent implements OnInit
{
	list :ListModel[];
	constructor(private knService: KnowledgeService) { }

	ngOnInit() {
		this.knService.getPopularMovie()
			.then((result)=>{
				this.list = result.results;
			});
	}
	onCardClick(model: ListModel)
	{
		console.log(model);
	}
}
