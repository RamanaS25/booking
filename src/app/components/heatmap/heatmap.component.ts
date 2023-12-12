import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

interface Commit {
    date: string; // Adjust based on your actual data structure
    count: number;
  }
  
  interface DatasetItem {
    date: Date;
    commitCount: number;
    isPadding?: boolean; // Optional property to indicate padding
  }
  

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  standalone: true
})
export class HeatmapComponent  implements OnInit {

  @Input() year: number = 2023
  @Input() commits: any[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.commits.length > 0) {
      this.createHeatmap();
    }
  }

  getLastDayOfYear(year: number): Date {
    return new Date(year, 11, 31); // Month is 0-indexed, 11 = December
  }

  createHeatmap() {
    // Generate the data for the heatmap
    const data: DatasetItem[] = this.generateDataset(this.year, this.commits);
    console.log(data)
  
    // Define dimensions and margins for the heatmap
    const daySize = 20; // Size of each cell representing a day
    const cellMargin = 2; // Margin between cells
    const leftMargin = 30; // Space for month labels
    const monthLabelHeight = 20; // Height for the month labels
  
    // Calculate the offset for the first day of the year
    const firstDayOfYear = new Date(this.year, 0, 1);
    const startOffset = firstDayOfYear.getDay(); // Assuming Sunday is the first day of the week
  
    // Add padding for the beginning of the year
    const paddedData = [];
    for (let i = 0; i < startOffset; i++) {
      paddedData.push({ date: new Date(this.year, 0, 1 - i), commitCount: 0, isPadding: true });
    }
    paddedData.reverse(); // Reverse to correct the order
  
    // Concat the actual data
    paddedData.push(...data);
  
    // Calculate the offset for the last day of the year
    const lastDayOfYear = new Date(this.year, 11, 31);
    const endOffset = 6 - lastDayOfYear.getDay(); // Assuming Saturday is the last day of the week
  
    // Correctly calculate the end padding needed
    // If the last day of the year is a Saturday, no padding is needed; otherwise, calculate the difference
    const endPaddingNeeded = endOffset === 6 ? 0 : 7 - endOffset;
  
    // Add padding for the end of the year
    for (let i = 1; i <= endPaddingNeeded; i++) {
      paddedData.push({ date: new Date(this.year, 11, 31 + i), commitCount: 0, isPadding: true });
    }
  
    // Calculate the total number of weeks including padding
    const totalWeeks = Math.ceil(paddedData.length / 7);
  
    // SVG dimensions
    const svgWidth = totalWeeks * (daySize + cellMargin) + leftMargin;
    const heatmapHeight = 7 * (daySize + cellMargin); // Height for 7 days of the week
    const svgHeight = monthLabelHeight + heatmapHeight + cellMargin; // Total height
  
    // Create an SVG container
    const svg = d3.select('#heatmap').append('svg')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .classed('svg-content-responsive', true)
      .append('g')
      .attr('transform', `translate(${leftMargin}, ${monthLabelHeight})`);
  
    // Define the color scale
    const colorScale = d3.scaleThreshold<number, string>()
      .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // Ten thresholds for commit counts
      .range([
        "#0d1117", // Very dark (almost black) for 0 commits
        "#0e4429", // Dark green for 1 commit
        "#165c26", // Darker green for 2 commits
        "#1c6f24", // Darker green for 3 commits
        "#237d20", // Darker green for 4 commits
        "#2b8c1b", // Medium green for 5 commits
        "#329b17", // Brighter green for 6 commits
        "#3eaa11", // Brighter green for 7 commits
        "#4ab80d", // Bright green for 8 commits
        "#5ac70b", // Brighter green for 9 commits
        "#6ad604"  // Brightest green for 10 or more commits
      ]);
  
    // Define hover styles
    const hoverEffect = {
      stroke: 'white', // Stroke color
      strokeWidth: 2, // Stroke width
      fillOpacity: 0.8 // Fill opacity
    };
  
    // Reset styles when not hovering
    const normalEffect = {
      stroke: 'none', // No stroke
      strokeWidth: 0, // Stroke width back to 0
      fillOpacity: 1 // Fill opacity back to 1
    };
  
    // Create a tooltip div with d3
    const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', '#fff')
      .style('padding', '8px')
      .style('border-radius', '6px')
      .style('border', '1px solid #ccc')
      .style('pointer-events', 'none')
      .style('z-index', '10');
  
    // Bind data to rectangles for each day
    svg.selectAll('rect')
      .data(paddedData)
      .enter().append('rect')
      .attr('width', daySize)
      .attr('height', daySize)
      .attr('x', (d, i) => Math.floor(i / 7) * (daySize + cellMargin))
      .attr('y', (d, i) => (i % 7) * (daySize + cellMargin))
      .attr('fill', d => d.isPadding ? '#e0e0e0' : colorScale(d.commitCount))
      .attr('rx', 5) // Rounded corners
      .attr('ry', 5) // Rounded corners
      .attr('data-date', d => d.isPadding ? '' : d.date.toISOString())
      .attr("class", "rec")
      .on('mouseover', function (e, d) {
        if (!d.isPadding) {
          d3.select(this)
            .attr('stroke', hoverEffect.stroke)
            .attr('stroke-width', hoverEffect.strokeWidth)
            .attr('fill-opacity', hoverEffect.fillOpacity);
  
          tooltip.style('visibility', 'visible')
            .html(`Date: ${d.date.toISOString().slice(0, 10)}<br>Count: ${d.commitCount}`);
        }
      })
      .on('mousemove', function (e) {
        tooltip.style('top', (e.pageY - 10) + 'px')
          .style('left', (e.pageX + 10) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke', normalEffect.stroke)
          .attr('stroke-width', normalEffect.strokeWidth)
          .attr('fill-opacity', normalEffect.fillOpacity);
  
        tooltip.style('visibility', 'hidden');
      });
  
    // Month labels
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    svg.selectAll(".month-label")
      .data(monthNames)
      .enter().append("text")
      .text(d => d)
      .attr("x", (d, i) => (i * (daySize + cellMargin)) * 4.34812141) // approximate spacing, needs adjustment
      .attr("y", 0) // Aligned at the top
      .attr("class", "month-label")
      .style("text-anchor", "start");
  }
  
  
  


  
  
  generateDataset(year: number, commits: Commit[]): DatasetItem[] {
    const startDate = new Date(Date.UTC(year, 0, 1));  // Start of the year in UTC
    const endDate = new Date(Date.UTC(year, 11, 31));  // End of the year in UTC
    const dateFormat = d3.timeFormat("%Y-%m-%d");

    // Create a map for quick lookup of commit counts by date
    const commitMap = new Map<string, number>(
      commits.map(commit => {
        // Ensure the date is handled in UTC
        const commitDate = new Date(commit.date + 'T00:00:00Z');
        return [dateFormat(commitDate), commit.count];
      })
    );

    // Generate an array for each day of the year
    return d3.timeDays(startDate, endDate).map(day => {
      const formattedDate = dateFormat(day);
      return {
        date: day,
        commitCount: commitMap.get(formattedDate) || 0
      };
    });
}


  
}