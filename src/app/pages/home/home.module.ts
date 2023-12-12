import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { HeatmapComponent } from 'src/app/components/heatmap/heatmap.component';
import { PieChartComponent } from 'src/app/components/piechart/piechart.component';
import { HeatComponent } from 'src/app/components/heat-map/heat-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HeatmapComponent,
    PieChartComponent,
    HeatComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
