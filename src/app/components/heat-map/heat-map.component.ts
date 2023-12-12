import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss'],
  standalone:true
})
export class HeatComponent  implements OnInit {
  @ViewChild('gridOfCubes', { static: true }) private gridContainer!: ElementRef;
  constructor() { }

  ngOnInit(): void {
    this.createGrid();
  }

  private createGrid(): void {
    const element = this.gridContainer.nativeElement;
    const svg = d3.select(element).append('svg');
    
    const rows = 7;
    const columns = 52;
    const cubeSize = 20; // The size of each cube
    const cubePadding = 2; // The padding between cubes

    // Set the width and height of the SVG
    svg.attr('width', columns * (cubeSize + cubePadding))
       .attr('height', rows * (cubeSize + cubePadding));

    // Create rows of cubes
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        svg.append('rect')
          .attr('x', j * (cubeSize + cubePadding))
          .attr('y', i * (cubeSize + cubePadding))
          .attr('width', cubeSize)
          .attr('height', cubeSize)
          .attr('fill', 'black');
      }
    }
  }

}
