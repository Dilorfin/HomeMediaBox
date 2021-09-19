import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

	constructor()
	{ }

	ngOnInit()
	{
		this.genres = this.movie.genres.map(g => g.name).join(", ");
	}
}
