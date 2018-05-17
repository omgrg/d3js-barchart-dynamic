import * as d3 from 'd3';

let margin = {
    top: 50,
    right: 20,
    bottom: 100,
    left: 80
};

let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let flag = true;

let svg = d3.select('#bar-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

let g = svg
    .append('g')
    .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
let yLabel = g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");


let xScale = d3.scaleBand().range([0, width]).padding(0.2);
let yScale = d3.scaleLinear().range([height, 0]);

let xAxisGroup =  g.append('g').attr("transform", "translate(0," + height + ")");
let yAxisGroup =  g.append('g');




d3.json('data/revenues.json').then(function (data) {
    data.forEach(function (d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });


    d3.interval(function () {
        flag = !flag;
        update(data);
    }, 1000);

    update(data);


});

function update(data) {

   let value = flag ? "revenue" : "profit";

    xScale.domain(data.map(function (d) {
        return d.month;
    }));

    yScale.domain([0, d3.max(data, function (d) {

            return d[value];
    })]);

    let xAxisCall = d3.axisBottom(xScale);
    xAxisGroup.call(xAxisCall);

    let yAxisCall = d3.axisLeft(yScale).tickFormat(function (d) {
        return "$" + d;
    });
    yAxisGroup.call(yAxisCall);



    let rects = g.selectAll('rect')
        .data(data);

        rects.exit().remove();

       rects.attr('y',function(d){
            return yScale(d[value]);
        }).attr('x', function(d){
            return xScale(d.month);
        }).attr('width', xScale.bandwidth)
            .attr('height', function (d) {
                return height - yScale(d[value])
            });

        rects.enter()
        .append('rect')
        .attr('fill', 'grey')
        .attr('width', xScale.bandwidth)
        .attr('height', function (d) {
            return height - yScale(d[value])
        })
        .attr('x', function (d) {
            return xScale(d.month)
        })
        .attr('y', function (d) {
            return yScale(d[value])
        });

    let label = flag ? "Revenue" : "Profit";

    yLabel.text(label);


}