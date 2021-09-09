import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieRoutingModule } from './movie-routing.module';
import { MovieComponent } from './movie.component';
import { InfoComponent } from './info/info.component';
import { VideosComponent } from './videos/videos.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
	declarations: [MovieComponent, InfoComponent, VideosComponent],
	imports: [
		CommonModule,
		MovieRoutingModule,
		IonicModule
	]
})
export class MovieModule { }
