import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurfingRoutingModule } from './surfing-routing.module';
import { SurfingComponent } from './surfing.component';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from '../_shared-components/shared-components.module';

@NgModule({
	declarations: [SurfingComponent],
	imports: [
		CommonModule,
		SurfingRoutingModule,
		IonicModule,
		SharedComponentsModule
	]
})
export class SurfingModule { }
