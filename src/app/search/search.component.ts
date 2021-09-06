import { Component, OnInit } from '@angular/core';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit
{
	constructor(private knService: KnowledgeService) { }
	ngOnInit() { }
}
