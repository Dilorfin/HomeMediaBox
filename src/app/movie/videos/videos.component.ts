import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/_services/video.service';

@Component({
	selector: 'movie-videos',
	templateUrl: './videos.component.html',
	styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit
{
	constructor(private videoService:VideoService) { }
	ngOnInit() { }
}
