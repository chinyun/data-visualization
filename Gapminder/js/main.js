/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const margin = { left:80, right: 20, top:50, bottom:100 };

const width = 900 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

const area = d3.select('#chart-area')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

let time = 0;

//Scales
const x = d3.scaleLog()
  .domain([142, 150000])
  .range([0, width])
  .base(10);

const y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

const chart = d3.scaleLinear()
  .range([25*Math.PI, 1500*Math.PI])
  .domain([2000, 1400000000]);

const continentColor = d3.scaleOrdinal(d3.schemeSet1);

// Labels
const xLabel = area.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");

const yLabel = area.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Life Expectancy (Years)");

const timeLabel = area.append("text")
    .attr("y", height -10)
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("1800");

// X Axis
const xAxisCall = d3.axisBottom(x)
  .tickFormat(d3.format(",.0f"))
  .tickValues([400, 4000, 40000])
area.append('g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0, '+ height +')')
  .call(xAxisCall);

// Y Axis
const yAxisCall = d3.axisLeft(y)
  .tickFormat((d) => { return d; });
area.append('g')
  .attr('class', 'y-axis')
  .call(yAxisCall);

// Legend
const continents = ['europe', 'asia', 'americas', 'africa'];

const legend = area.append('g')
  .attr('transform','translate('+ (width - 10) + ',' + (height - 125) + ')');

continents.forEach((continent, i) => {
  const legendRow = legend.append('g')
    .attr('transform', 'translate(0, '+ (i * 20) +')');
  legendRow.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', continentColor(continent));
  legendRow.append('text')
    .attr('x', -10)
    .attr('y', 10)
    .attr('text-anchor', 'end')
    .style('text-transform', 'capitalize')
    .text(continent);
});

d3.json("data/data.json").then(function(data){

  const formattedData = data.map((year) => {
    return year['countries'].filter((country) => {
      let dataExists = (country.income && country.life_exp);
      return dataExists;
    }).map((country) => {
      country.income = +country.income;
      country.life_exp = +country.life_exp;
      return country;
    })
  });
  const firstYearData = formattedData[0];
  
  d3.interval(function(){
    time = (time < 214) ? time + 1 : 0;
    update(formattedData[time]);
  }, 100);

  update(formattedData[0]);

}).catch((err) => { console.log(err);});

function update(data) {
  const t = d3.transition()
    .duration(200);

  const circles = area.selectAll('circle')
    .data(data, (d) => { return d.country; });

  circles.exit()
    .attr('class', 'exit')
    .remove();

  circles.enter()
    .append('circle')
      .attr('class', 'enter')
      .attr('fill', (d) => { return continentColor(d.continent); })
      .attr('fill-opacity', 0.6)
      .merge(circles)
      .transition(t)
        .attr('cx', (d) => { return x(d.income); })
        .attr('cy', (d) => { return y(d.life_exp); })
        .attr('r', (d) => { return Math.sqrt(chart(d.population) / Math.PI); });

  timeLabel.text(+(time + 1800));
};
