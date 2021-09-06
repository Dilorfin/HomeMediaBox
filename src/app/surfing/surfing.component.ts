import { Component, OnInit } from '@angular/core';
import { KnowledgeService } from '../_services/knowledge.service';

@Component({
	selector: 'app-surfing',
	templateUrl: './surfing.component.html',
	styleUrls: ['./surfing.component.scss'],
})
export class SurfingComponent implements OnInit
{
	constructor(private knService: KnowledgeService) { }

	ngOnInit() { }
}
