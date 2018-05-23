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

let t = d3.transition().duration(200);

let g = d3.select('#bar-chart')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

let xAxisGroup = g.append('g').attr("transform", "translate(0," + height + ")");
let yAxisGroup = g.append('g');

let x = d3.scaleBand().range([0, width]).padding(0.2);
let y = d3.scaleLinear().range([height, 0]);


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





d3.json('data/revenues.json').then(function (data) {
    data.forEach(function (d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });


    d3.interval(function () {
      let newData = flag ? data : data.slice(1);

        update(newData);
        flag = !flag;
    }, 1000);

    update(data);


});

function update(data) {

    let value = flag ? "revenue" : "profit";

    x.domain(data.map(function (d) {
        return d.month;
    }));

    y.domain([0, d3.max(data, function (d) {

        return d[value];
    })]);

    let xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    let yAxisCall = d3.axisLeft(y).tickFormat(function (d) {
        return "$" + d;
    });
    yAxisGroup.transition(t).call(yAxisCall);


    let rects = g.selectAll('rect')
        .data(data, function (d) {
            return d.month;
        });

    rects.exit().attr('fill', 'red') .transition(t)
        .attr("y", y(0))
        .attr("height", 0).remove();


    rects.enter()
        .append('rect')
            .attr('fill', 'grey')
            .attr('width', x.bandwidth)
            .attr('height', 0)
            .attr('y', y(0))
            .attr('x', function (d) {
                 return x(d.month)
             })
            .merge(rects)
            .transition(t)
                .attr('x', function (d) {
                     return x(d.month);
                })
                .attr('width', x.bandwidth)
                .attr('y', function (d) {
                     return y(d[value]);
                  })
                .attr('height', function (d) {
                      return height - y(d[value]);
                 });

    let label = flag ? "Revenue" : "Profit";

    yLabel.text(label);


}
