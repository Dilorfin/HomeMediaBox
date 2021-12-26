import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import FullMovieModel from 'src/models/FullMovieModel';
import ShortMovieModel from 'src/models/ShortMovieModel';

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit
{
	@Input() movie: FullMovieModel | ShortMovieModel;

	constructor(private router: Router) { }

	ngOnInit() { }

	onClick(event: MouseEvent)
	{
		this.router.navigate(['/movie', this.movie.id], {
			state: this.movie
		});
	}

	onKeyUp(event: KeyboardEvent)
	{
		if (event.key !== 'Enter')
			return;

		this.router.navigate(['/movie', this.movie.id], {
			state: this.movie
		});
	}
}
