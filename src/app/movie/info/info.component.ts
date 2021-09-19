import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';

@Component({
	selector: 'movie-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit
{
	@Input() movie: DetailsModel;
	@Output() openVideos = new EventEmitter<void>();

	genres: string;
	countries: string;

	constructor()
	{ }

	ngOnInit()
	{ }

	ngOnChanges(changes: SimpleChanges): void
	{
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
	}
}
