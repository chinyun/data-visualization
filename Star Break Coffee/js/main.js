/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:100, right: 10, top:10, bottom:150};

var width = 700 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

var group = d3.select('#chart-area')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// X label
group.append('text')
  .attr('class', 'x-axis-label')
  .attr('x', width / 2)
  .attr('y', height + 80)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

// Y label
group.append('text')
  .attr('class', 'y-axis-label')
  .attr('x', - (height / 2))
  .attr('y', - 80 )
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Revenue');

d3.json('data/revenues.json').then((data) => {
  console.log(data);

  data.forEach((d) => {
    d.revenue = +d.revenue;
  });

  var x = d3.scaleBand()
    .domain(data.map((d) => { return d.month; }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3)

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => { return d.revenue; })])
    .range([height, 0]);

  var xAxisCall = d3.axisBottom(x);
  group.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, '+ height +')')
    .call(xAxisCall)
    .selectAll('text')
      .attr('y', '10')
      .attr('x', '-5')
      .attr('text-anchor', 'end')
      .attr('trandform', 'rotate(-40)');

  var yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat((d) => { return `$${d}`; });
  group.append('g')
    .attr('class', 'y-axis')
    .call(yAxisCall);

  var rects = group.selectAll('rects')
    .data(data);
  
  rects.enter()
    .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', (d) => { return height - y(d.revenue); })
      .attr('x', (d) => { return x(d.month)})
      .attr('y', (d) => { return y(d.revenue)})
      .attr('fill', '#005540');
}).catch( (err) => { console.log(err);});
