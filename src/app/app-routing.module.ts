import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'surfing',
		pathMatch: 'full'
	},
	{
		path: 'movie/:type/:id',
		loadChildren: () => import('./movie/movie.module').then(m => m.MovieModule)
	},
	{
		path: 'surfing',
		loadChildren: () => import('./surfing/surfing.module').then(m => m.SurfingModule)
	},
	{
		path: 'search',
		loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
