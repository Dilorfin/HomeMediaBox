import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SharedComponentsModule } from '../_shared-components/shared-components.module';

@NgModule({
	declarations: [SearchComponent],
	imports: [
		CommonModule,
		SearchRoutingModule,
		IonicModule,
		SharedComponentsModule
	]
})
export class SearchModule { }
