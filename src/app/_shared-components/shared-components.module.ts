import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CardComponent } from './card/card.component';
import { BackgroundImageComponent } from './background-image/background-image.component';
import { GoBackButtonComponent } from './go-back-button/go-back-button.component';

@NgModule({
	declarations: [
		CardComponent,
		BackgroundImageComponent,
		GoBackButtonComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CardComponent,
		BackgroundImageComponent,
		GoBackButtonComponent
	]
})
export class SharedComponentsModule { }
