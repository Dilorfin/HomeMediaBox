import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit
{
	public file: string;

	constructor(route: ActivatedRoute)
	{
		this.file = route.snapshot.queryParams['file'];
	}

	ngOnInit()
	{ }
}
