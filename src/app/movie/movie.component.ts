import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DetailsModel from 'src/models/DetailsModel';
import ListModel from 'src/models/ListModel';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit
{
	movie: DetailsModel;

	constructor(public router: Router, private knService: KnowledgeService)
	{ }

	ngOnInit()
	{
		this.movie = this.router.getCurrentNavigation().extras.state as DetailsModel;

		this.knService.getDetails(this.movie as unknown as ListModel)// ???
			.then((value: DetailsModel) =>
			{
				this.movie = value;
			});
	}
}
