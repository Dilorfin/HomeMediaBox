import { Component, OnInit } from '@angular/core';
import FullMovieModel from 'src/models/FullMovieModel';
import { ActivatedRoute, Router } from '@angular/router';
import { KnowledgeService } from 'src/app/_services/knowledge.service';

@Component({
	selector: 'movie-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit
{
	private movieId: string;
	movie: FullMovieModel;

	genres: string;
	countries: string;

	constructor(public router: Router,
		private knService: KnowledgeService,
		activateRoute: ActivatedRoute)
	{
		this.movieId = activateRoute.snapshot.params['movie-id'];
	}

	ngOnInit()
	{
		this.movie = this.router.getCurrentNavigation().extras.state as FullMovieModel;
		this.knService.getDetailsById(this.movieId)
			.then((value: FullMovieModel) =>
			{
				this.movie = value;
				if (this.movie.genres)
				{
					this.genres = this.movie.genres
						.map(g => g.name)
						.join(", ");
				}

				if (this.movie.production_countries)
				{
					this.countries = this.movie.production_countries
						.map(c => c.name)
						.join(", ");
				}
			});
	}
}
