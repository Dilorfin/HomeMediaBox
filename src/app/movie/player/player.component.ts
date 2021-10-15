import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit
{
	public file: string;

	constructor(route: ActivatedRoute, private location: Location)
	{
		this.file = route.snapshot.queryParams['file'];
	}

	ngOnInit()
	{ }

	goBack(): void
	{
		this.location.back();
	}
}
