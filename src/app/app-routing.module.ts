import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'surfing',
		pathMatch: 'full'
	},
	{
		path: 'movie/:movie-id',
		loadChildren: () => import('./movie/info/info.module').then(m => m.InfoModule)
	},
	{
		path: 'movie/:movie-id/videos',
		loadChildren: () => import('./movie/videos/videos.module').then(m => m.VideosModule)
	},
	{
		path: 'movie/:movie-id/player',
		loadChildren: () => import('./movie/player/player.module').then(m => m.PlayerModule)
	},
	{
		path: 'surfing',
		loadChildren: () => import('./surfing/surfing.module').then(m => m.SurfingModule)
	},
	{
		path: 'search',
		loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
	},
	{
		path: 'settings',
		loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
