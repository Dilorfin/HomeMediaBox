import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CardComponent } from './card/card.component';
import { GoBackButtonComponent } from './go-back-button/go-back-button.component';

@NgModule({
	declarations: [
		CardComponent,
		GoBackButtonComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CardComponent,
		GoBackButtonComponent
	]
})
export class SharedComponentsModule { }
