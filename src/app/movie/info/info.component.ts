import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
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

	showTop: boolean = false;

	genres: string;
	countries: string;

	constructor(private platform: Platform, private location: Location)
	{ }

	ngOnInit()
	{
		this.showTop = !this.platform.is('android');
	}

	goBack(): void
	{
		this.location.back();
	}

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
