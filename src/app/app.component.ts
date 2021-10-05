import { Component } from '@angular/core';
import Utils from './utils';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent
{
	constructor() 
	{
		Utils.extendDefaultPrototypes();
	}
}
