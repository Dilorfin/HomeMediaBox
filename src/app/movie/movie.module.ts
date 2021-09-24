import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MovieRoutingModule } from './movie-routing.module';
import { MovieComponent } from './movie.component';
import { InfoComponent } from './info/info.component';
import { VideosComponent } from './videos/videos.component';
import { SharedComponentsModule } from '../_shared-components/shared-components.module';

@NgModule({
	declarations: [
		MovieComponent,
		InfoComponent,
		VideosComponent
	],
	imports: [
		CommonModule,
		MovieRoutingModule,
		IonicModule,
		SharedComponentsModule
	]
})
export class MovieModule { }
