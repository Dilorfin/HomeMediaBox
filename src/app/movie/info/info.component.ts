import { Component, Input, OnInit } from '@angular/core';
import DetailsModel from 'src/models/DetailsModel';

@Component({
	selector: 'movie-info',
	templateUrl: './info.component.html',
	styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit
{
	@Input() movie: DetailsModel;

	constructor()
	{ }

	ngOnInit()
	{ }
}
