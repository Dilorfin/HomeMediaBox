import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieRoutingModule } from './movie-routing.module';
import { MovieComponent } from './movie.component';
import { InfoComponent } from './info/info.component';
import { VideosComponent } from './videos/videos.component';


@NgModule({
	declarations: [MovieComponent, InfoComponent, VideosComponent],
	imports: [
		CommonModule,
		MovieRoutingModule
	]
})
export class MovieModule { }
