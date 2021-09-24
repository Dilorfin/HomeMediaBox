import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DetailsModel from 'src/models/DetailsModel';
import ListModel from 'src/models/ListModel';

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit
{
	@Input() movie: DetailsModel | ListModel;

	constructor(private router: Router) { }

	ngOnInit() { }

	onClick(event: MouseEvent)
	{
		this.router.navigate(['/movie', this.movie.media_type, this.movie.id], {
			state: this.movie
		});
	}

	onKeyUp(event: KeyboardEvent)
	{
		if (event.key !== 'Enter')
			return;

		this.router.navigate(['/movie', this.movie.media_type, this.movie.id], {
			state: this.movie
		});
	}
}
