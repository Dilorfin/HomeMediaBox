import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as Plyr from 'plyr';
import Hls from 'hls.js';

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit
{
	public file: string;
	private player: Plyr;
	
	constructor(route: ActivatedRoute, private location: Location)
	{
		this.file = route.snapshot.queryParams['file'];
	}

	ngOnInit()
	{ 
		var video:any = document.querySelector('#player');
		this.player = new Plyr(video);
		
		if (this.file.indexOf('.m3u8') <= 0 || !Hls.isSupported())
		{
			video.src = this.file;
		}
		else
		{
			const hls = new Hls();
			hls.loadSource(this.file);
			hls.attachMedia(video);
		}
	}

	goBack(): void
	{
		this.location.back();
	}
}
