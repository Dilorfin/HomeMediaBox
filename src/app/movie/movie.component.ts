import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DetailsModel from 'src/models/DetailsModel';
import ListModel from 'src/models/ListModel';
import VideoFileModel from 'src/models/VideoFileModel';
import { KnowledgeService } from '../_services/knowledge.service';
import { VideoService } from '../_services/video.service';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit
{
	movie: DetailsModel;
	providers: {title:string, videos:VideoFileModel[]}[]

	constructor(public router: Router, private knService: KnowledgeService,
		private videoService:VideoService)
	{ }

	ngOnInit()
	{
		this.movie = this.router.getCurrentNavigation().extras.state as DetailsModel;
		this.providers = [];
		
		this.knService.getDetails(this.movie as unknown as ListModel)// ???
			.then((value: DetailsModel)=>{
				this.movie = value;
				this.videoService.getVideos(value)
					.forEach(provider => 
						provider.videos.then(videos=>{
							this.providers.push({title:provider.title, videos:videos});
						})
					)
			});
	}
}
