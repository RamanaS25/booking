import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { IonicModule } from '@ionic/angular';
import { Arc, DefaultArcObject, PieArcDatum } from 'd3-shape';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
  imports:[ IonicModule],
  standalone:true 
})
export class PieChartComponent {
  @ViewChild('chart', { static: false })
  
  private chartContainer!: ElementRef;

  @ViewChild('tooltip', { static: true })
  private tooltipContainer!: ElementRef;
  
  data: number[] = [10, 20, 30, 40]; // Example data
  
  ngAfterViewInit(): void {
    this.createChart();
  }


  constructor(){

  }



  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const tooltip = this.tooltipContainer.nativeElement;
    const width = 360;
    const height = 360;
    const radius = Math.min(width, height) / 2;
  
    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    // Create the arc generator
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
  
    // Create the pie layout function
    const pie = d3.pie<number>().sort(null);
  
    // Bind the data to the arcs
    const arcs = svg.selectAll('.arc')
      .data(pie(this.data))
      .enter()
      .append('g')
      .attr('class', 'arc');
  
    // Draw the arc paths
    arcs.append('path')
      .attr('d', arcGenerator as any)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .on('mouseover', (event, d) => {
        tooltip.style.opacity = 1;
        const [x, y] = arcGenerator.centroid(d as any); // Get the centroid of the slice
        const [xPosition, yPosition] = [element.getBoundingClientRect().left + x, element.getBoundingClientRect().top + y];
        
        tooltip.style.left = `${xPosition - 150}px`;
        tooltip.style.top = `${yPosition +80}px`;
        tooltip.innerHTML = `Value: ${d.data}`;
      })
      .on('mousemove', (event, d) => {
        const [x, y] = arcGenerator.centroid(d as any);
        const [xPosition, yPosition] = [element.getBoundingClientRect().left + x, element.getBoundingClientRect().top + y];
        tooltip.style.left = `${xPosition -150}px`;
        tooltip.style.top = `${yPosition +80}px`;
      })
      .on('mouseout', () => {
        tooltip.style.opacity = 0;
      });
  
    // Add the text labels
    arcs.append('text')
      .attr('transform', d => `translate(${arcGenerator.centroid(d as any)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data.toString());
  }
  
  
}


 


