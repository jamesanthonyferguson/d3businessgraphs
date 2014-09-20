var data = [];
var startingDate = new Date(2013,5,3);

var generateData = function(n){
  for (var i = 0; i < n; i++) {
    var temp = {};
    temp.date = new Date(startingDate.getFullYear(),
        startingDate.getMonth(),
        startingDate.getDate()+i
        );
    temp.dau = Math.ceil(Math.random()*80)+80;
    data.push(temp);
  };
}

generateData(20)

var getMax = function(array,characteristic) {
  var values = [];
  for (var i = 0; i < array.length; i++) {
    values.push(Math.ceil(parseFloat(array[i][""+characteristic])));
  };
  values.sort(function(a,b){return a-b})
  return values[values.length-1];
}

var getMin = function(array,characteristic) {
  var values = [];
  for (var i = 0; i < array.length; i++) {
    values.push(Math.ceil(parseFloat(array[i][""+characteristic])));
  };
  values.sort(function(a,b){return a-b})
  return values[0];
}

var width = 800;
var height = 800;
var margin = {top: 30, right: 30, bottom: 80, left: 200}
width = width-margin.right - margin.left;
height = height - margin.top - margin.bottom;

var minDate = data[0].date;
var maxDate = data[data.length-1].date;

var maxDAU= getMax(data,'dau');
var minDAU= getMin(data,'dau');
var vis=d3.select('#metrics').append('svg')
  .data(data)
  .attr('class', 'metrics-container')
  .attr('height', height+ margin.top+margin.bottom)
  .attr('width', width+ margin.left+ margin.right)
  .append('g')
    .attr('transform','translate('+ margin.left+','+margin.top+')')

var y= d3.scale.linear()
  .domain([minDAU*0.9,maxDAU*1.1])
  .range([height,0])
var x= d3.time.scale()
  .domain([minDate,maxDate])
  .range([0,width]);
var yAxis= d3.svg.axis()
  .scale(y)
  .orient('left')
  .ticks(5)
var xAxis= d3.svg.axis()
  .scale(x)
  .orient('bottom')
  .ticks(5)

vis.append('g')
  .attr('class', 'axis')
  .call(yAxis)

vis.append('g')
  .attr('class', 'axis')
  .attr('transform','translate(0,'+ height+')')
  .call(xAxis)

//Add Axis Labels
vis.append('text')
  .attr('class','axis-label')
  .attr('text-anchor', 'end')
  .attr('x',20)
  .attr('y', height+34)
  .text('Date');

vis.append('text')
  .attr('class', 'axis-label')
  .attr('text-anchor', 'end')
  .attr('y', 6)
  .attr('dy', '-7em')
  .attr('transform', 'rotate(-90)')
  .text('Daily Active Users (millions)')

var line = d3.svg.line()
  .x(function(d) {return x(d["date"]);})
  .y(function(d) {return y(d["dau"]);})

vis.append("svg:path")
  .attr("d", line(data))
  .style("stroke", function(){
      return '#000000';
    })
  .style("fill", "none")
  .style("stroke-width", "2.5")

var dataCirclesGroup = vis.append('svg:g')
var circles = dataCirclesGroup
  .selectAll('data-point')
  .data(data);

circles.enter()
  .append('svg:circle')
  .attr('class', 'dot')
  .attr('fill', function() {return "red";})
  .attr('cx', function(d) {return x(d["date"]);})
  .attr('cy', function(d) {return y(d["dau"]);})
  .attr('r', function(){return 3;})
  .on("mouseover", function(d){
    d3.select(this)
      .attr('r', 8)
      .attr("class", "dot-selected")
      .transition()
      .duration(750);
  })
  .on("mouseout", function(d) {
    d3.select(this)
    .attr("r", 3)
    .attr("class", "dot")
    .transition()
    .duration(999)
  })
