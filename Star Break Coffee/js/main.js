/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:100, right: 10, top:10, bottom:150};

var width = 700 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

var flag = true;
var t = d3.transition().duration(750);

var area = d3.select('#chart-area')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var xAxisGroup = area.append('g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0, '+ height +')');

var yAxisGroup = area.append('g')
  .attr('class', 'y-axis');

// X Scale
var x = d3.scaleBand()
  .range([0, width])
  .paddingInner(0.3)
  .paddingOuter(0.3);

// Y Scale
var y = d3.scaleLinear()
  .range([height, 0]);

// X label
area.append('text')
  .attr('class', 'x-axis-label')
  .attr('x', width / 2)
  .attr('y', height + 80)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

// Y label
var yLabel = area.append('text')
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
    d.profit = +d.profit;
  });

  d3.interval(() => {
    var newData = flag ? data: data.slice(1);
    update(newData);
    flag = !flag;
  }, 1000);
  
  // Run the vis for the first time 
  update(data);

}).catch( (err) => { 
  console.log(err);
});

function update(data) {
  var yValue = flag ? 'revenue' : 'profit';

  x.domain(data.map((d) => { return d.month; }));
  y.domain([0, d3.max(data, (d) => { return d[yValue]; })]);

  // X Axis
  var xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);

  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .tickFormat((d) => { return `$${d}`; });
  yAxisGroup.transition(t).call(yAxisCall);

  // JOIN new data with old elements.
  var rects = area.selectAll('rect')
    .data(data, (d) => { return d.month; });
  
  // EXIT old elements not present in new data.
  rects.exit()
    .attr('fill', 'red')
    .transition(t)
    .attr('y', y(0))
    .attr('height', 0)
    .remove();

  // ENTER new elements present in new data.
  rects.enter()
    .append('rect')
      .attr('x', (d) => { return x(d.month); })
      .attr('y', y(0))
      .attr('width', x.bandwidth)
      .attr('height', 0)
      .attr('fill', '#005540')
      // UPDATE old elements present in new data.
      .merge(rects)
      .transition(t)
        .attr('x', (d) => { return x(d.month); })
        .attr('width', x.bandwidth)
        .attr('y', (d) => { return y(d[yValue]); })
        .attr('height', (d) => { return height - y(d[yValue]); });
      
  var label = flag ? 'Revenue' : 'Profit';
  yLabel.text(label);
};
