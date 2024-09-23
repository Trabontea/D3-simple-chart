const greenline_data = [
	{value: 55, date: '2020-01-15', formatted_date: '01/15/2020'},
	{value: 50, date: '2020-01-16', formatted_date: '01/16/2020'},
	{value: 51, date: '2020-01-17', formatted_date: '01/17/2020'},
	{value: 59, date: '2020-01-18', formatted_date: '01/18/2020'},
	{value: 53, date: '2020-01-19', formatted_date: '01/19/2020'},
	{value: 57, date: '2020-01-20', formatted_date: '01/20/2020'},
	{value: 54, date: '2020-01-21', formatted_date: '01/21/2020'},
	{value: 50, date: '2020-01-22', formatted_date: '01/22/2020'},
	{value: 46, date: '2020-01-23', formatted_date: '01/23/2020'},
	{value: 48, date: '2020-01-24', formatted_date: '01/24/2020'},
	{value: 26, date: '2020-01-25', formatted_date: '01/25/2020'},
	{value: 36, date: '2020-01-26', formatted_date: '01/26/2020'},
	{value: 40, date: '2020-01-27', formatted_date: '01/27/2020'},
	{value: 48, date: '2020-01-28', formatted_date: '01/28/2020'},
	{value: 34, date: '2020-01-29', formatted_date: '01/29/2020'},
	{value: 33, date: '2020-01-30', formatted_date: '01/30/2020'},
];

const month="january 2020"

const orangeline_data = [
	{value: 16, date: '2020-01-23'},
  {value: 10, date: '2020-01-24'},
  {value: 16, date: '2020-01-26'},
  {value: 8, date: '2020-01-30'}
];

create_area_chart(greenline_data, orangeline_data, 'history-chart-main');

function create_area_chart(data, eps_data, target){
    document.getElementById(target).innerHTML = '';

    const parentw = document.getElementById(target).offsetWidth;

    const parenth = 0.6*parentw;

    let svg = d3.select('#'+target)
        .append("svg")
        .attr("width", parentw)
        .attr("height", parenth),
        margin = {top: 20, right: 20, bottom: 40, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const parseTime = d3.timeParse("%Y-%m-%d");
        const bisectDate = d3.bisector(function(d) { return d.date; }).right;

        const x = d3.scaleTime()
        .domain(data.map(d => d.date))
        .range([0, width]);

        const y = d3.scaleLinear()
        .domain([0, 1.02 * Math.max(...data.map(d => d.value))])
        .range([height, 0]);
    
      const area = d3.area()
        .x(d => x(d.date))
        .y1(d => y(d.value));
    
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.value = +d.value;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, 1.02*d3.max(data, function(d) { return d.value; })]);
    area.y0(y(0));

    g.append("path")
        .datum(data)
        .attr("fill", "#ffffff")
        .attr("d", area);

    //stock price chart
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); })
        .curve(d3.curveCatmullRom); // Add this line to make the peak of the line round !!!!!!
 
    g.append("path")
        .data([data])
        .attr('fill', 'none')
        .attr('stroke', '#559BD1')
        .attr("class", "line")
        .attr("d", valueline);

    //orange PE line
    eps_data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.value = +d.value;
    });

    var orangeline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); })
        .curve(d3.curveCatmullRom)

    g.append("path")
        .data([eps_data])
        .attr('fill', 'none')
        .attr('stroke', '#ff5628')
        .attr("class", "line")
        .attr("d", orangeline);
        
    // Add circles to each point  line orange!!
    g.selectAll().data(eps_data)
        .enter().append("circle")  
        .attr("class", "data-circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.value); })
        .attr('fill', '#ff5628');


        // AICI SUNT AXELE
        g.append("g")
        .attr("transform", `translate(0, 0)`)  // adjust the y-position to move the axis to the top normal: (0, ${height})
        .call(d3.axisTop(x).tickFormat(d3.timeFormat("%b/%d/%Y")).ticks(data.length < 1000 ? d3.timeMonth : timeYear))
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dy", ".25em")
        .attr("transform", "rotate(0)")// rotata -45 ptr x

        g.append("text") // add x-axis label
         .attr("x", width / 2)
         .attr("y", -10)
         .attr("text-anchor", "middle")
         .text(month);
    

        g.append("g")
        .attr("transform", `translate(${width}, 0)`) // adjust the x-position to move the axis to the right
        .call(d3.axisRight(y).tickFormat(d => `$${d}`))
        .append("text")
        .attr("fill", "none")
        .attr("stroke", "none")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    let focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    // AICI dimensiunea cercului si culorile lui!!!!
    focus.append("circle")
        .attr("fill", "#559BD1")
        .attr("stroke", "#F4F4F4")
        .attr("stroke-width", '6')
        .attr("r", 10);

    // text    
    focus.append("text")
        .attr("class", "text-date focus-text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("dy", ".31em")
        .style("text-anchor", "middle");

    focus.append("text")
        .attr("class", "text-val focus-text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("dy", ".31em")
        .style("text-anchor", "middle");

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", function(){
            var x0 = x.invert( d3.pointer(event, this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
            focus.select(".text-date").text(function() { return d.formatted_date ; });
            focus.select(".text-val").text(function() { return '$' + d.value; });
            focus.select(".x-hover-line").attr("y2", height - y(d.value));
            focus.select(".y-hover-line").attr("x2", width + width);
        });
}