import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurfingRoutingModule } from './surfing-routing.module';
import { SurfingComponent } from './surfing.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
	declarations: [SurfingComponent],
	imports: [
		CommonModule,
		SurfingRoutingModule,
		IonicModule //???
	],
	/*schemas: [CUSTOM_ELEMENTS_SCHEMA]*/
})
export class SurfingModule { }
