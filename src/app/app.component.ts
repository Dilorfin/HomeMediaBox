import { Component } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

import Utils from './utils';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent
{
	private noInternetToast?: HTMLIonToastElement = null;

	constructor(public toastController: ToastController)
	{
		Utils.extendDefaultPrototypes();

		Network.addListener('networkStatusChange', (status: ConnectionStatus) =>
		{
			if (!status.connected)
			{
				this.presentToastWithOptions();
			}
		});
		Network.getStatus().then((status: ConnectionStatus) =>
		{
			if (!status.connected)
			{
				this.presentToastWithOptions();
			}
		});
	}

	async presentToastWithOptions() 
	{
		if (this.noInternetToast) return;

		this.noInternetToast = await this.toastController.create({
			message: 'No internet connection',
			icon: 'wifi-outline',
			position: 'top',
			buttons: [
				{
					icon: 'refresh-outline',
					text: 'Retry',
					handler: async () =>
					{
						const status = await Network.getStatus();
						return status.connected;
					}
				}
			]
		});
		await this.noInternetToast.present();

		this.noInternetToast.onDidDismiss().then(() =>
		{
			this.noInternetToast = null;
		});
	}
}
