import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurfingComponent } from './surfing.component';

const routes: Routes = [
	{
		path: '',
		component: SurfingComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SurfingRoutingModule { }
