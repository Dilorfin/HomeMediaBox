import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import FullMovieModel from 'src/models/FullMovieModel';
import ShortMovieModel from 'src/models/ShortMovieModel';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit
{
	private movieId: string;

	tab: 'info' | 'video' = 'info';

	movie: FullMovieModel;

	constructor(public router: Router,
		private knService: KnowledgeService,
		activateRoute: ActivatedRoute)
	{
		this.movieId = activateRoute.snapshot.params['movie-id'];
	}

	get dynamic_style()
	{
		if (!this.movie.backdrop_path)
			return {};
		return {
			'background-image': `url(${this.movie.backdrop_path})`
		};
	}

	ngOnInit()
	{
		this.movie = this.router.getCurrentNavigation().extras.state as FullMovieModel;
		const tempMovie: FullMovieModel = (this.movie ? this.movie : {
			id: this.movieId
		}) as FullMovieModel;

		this.knService.getDetails(tempMovie as unknown as ShortMovieModel)
			.then((value: FullMovieModel) =>
			{
				this.movie = value;
			});
	}
}
