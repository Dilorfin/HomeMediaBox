import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../_services/history.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit
{
	constructor(private historyService: HistoryService)
	{}

	ngOnInit() { }

	clearHistory()
	{
		this.historyService.clear();
	}
}
