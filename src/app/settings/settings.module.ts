import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { IonicModule } from '@ionic/angular';
import { SettingsComponent } from './settings.component';
import { SharedComponentsModule } from '../_shared-components/shared-components.module';

@NgModule({
	declarations: [ 
		SettingsComponent
	],
	imports: [
		IonicModule,
		CommonModule,
		SettingsRoutingModule,
		SharedComponentsModule
	]
})
export class SettingsModule { }
