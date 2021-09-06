import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurfingRoutingModule } from './surfing-routing.module';
import { SurfingComponent } from './surfing.component';


@NgModule({
  declarations: [ SurfingComponent ],
  imports: [
    CommonModule,
    SurfingRoutingModule
  ]
})
export class SurfingModule { }
