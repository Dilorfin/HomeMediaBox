import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import FullMovieModel from 'src/models/FullMovieModel';

@Component({
	selector: 'app-background-image',
	templateUrl: './background-image.component.html',
	styleUrls: ['./background-image.component.scss'],
})
export class BackgroundImageComponent implements OnInit
{
	@Input() movie: FullMovieModel;

	constructor() { }

	dynamic_style: any = {};

	ngOnInit()
	{}

	ngOnChanges(changes: SimpleChanges): void
	{
		if (this.movie && this.movie.backdrop_path)
		{
			this.dynamic_style = {
				'background-image': `url(${this.movie.backdrop_path})`
			};
		}
	}
}
