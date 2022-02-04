import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../_services/history.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit
{
	constructor(private historyService: HistoryService, private location: Location)
	{}

	ngOnInit() { }

	clearHistory()
	{
		this.historyService.clear();
	}
}
