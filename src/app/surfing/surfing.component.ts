import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
	
	constructor(public router: Router, private knService: KnowledgeService)
	{ }

	ngOnInit() {
		this.knService.getPopularMovie()
			.then((result)=>{
				this.list = result.results;
			});
	}

	onCardClick(model: ListModel)
	{
		this.router.navigate(['/movie'], { state: model});
	}
}
