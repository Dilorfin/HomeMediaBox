import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/_shared-components/shared-components.module';
import { PlayerRoutingModule } from './player-routing.module';

@NgModule({
	declarations: [PlayerComponent],
	imports: [
		CommonModule,
		IonicModule,
		SharedComponentsModule,
		PlayerRoutingModule
	]
})
export class PlayerModule { }
