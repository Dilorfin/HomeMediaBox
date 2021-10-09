import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './movie.component';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
	{
		path: '',
		component: MovieComponent,
	},
	{
		path: 'player',
		component: PlayerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MovieRoutingModule { }
