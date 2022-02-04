import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'app-go-back-button',
	templateUrl: './go-back-button.component.html',
	styleUrls: ['./go-back-button.component.scss'],
})
export class GoBackButtonComponent implements OnInit
{
	showTop: boolean = false;

	constructor(private platform: Platform,
		private location: Location)
	{ }

	ngOnInit(): void
	{
		this.showTop = !this.platform.is('android');
	}

	goBack(): void
	{
		this.location.back();
	}
}
