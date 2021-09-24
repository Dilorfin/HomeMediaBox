import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CardComponent } from './card/card.component';

@NgModule({
	declarations: [
		CardComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CardComponent
	]
})
export class SharedComponentsModule { }
