import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosComponent } from './videos.component';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/_shared-components/shared-components.module';
import { VideoRoutingModule } from './videos-routing.module';

@NgModule({
	declarations: [VideosComponent],
	imports: [
		CommonModule,
		IonicModule,
		SharedComponentsModule,
		VideoRoutingModule
	]
})
export class VideosModule { }
