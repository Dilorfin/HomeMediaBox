import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/_shared-components/shared-components.module';
import { InfoRoutingModule } from './info-routing.module';

@NgModule({
	declarations: [InfoComponent],
	imports: [
		CommonModule,
		IonicModule,
		SharedComponentsModule,
		InfoRoutingModule
	]
})
export class InfoModule { }
