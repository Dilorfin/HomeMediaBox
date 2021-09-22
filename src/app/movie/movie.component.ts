import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
	private movieId: string;
	private movieType: string;

	tab: 'info' | 'video' = 'info';

	movie: DetailsModel | ListModel;

	constructor(public router: Router,
		private knService: KnowledgeService,
		activateRoute: ActivatedRoute)
	{
		this.movieId = activateRoute.snapshot.params['id'];
		this.movieType = activateRoute.snapshot.params['type'];
	}

	ngOnInit()
	{
		this.movie = this.router.getCurrentNavigation().extras.state as ListModel;
		const tempMovie: ListModel = (this.movie ? this.movie : {
			id: this.movieId,
			media_type: this.movieType
		}) as ListModel;

		this.knService.getDetails(tempMovie)
			.then((value: DetailsModel) =>
			{
				this.movie = value;
			});
	}
}
