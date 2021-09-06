import { Component, OnInit } from '@angular/core';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit
{
	constructor(private knService: KnowledgeService) { }

	ngOnInit() { }

}
