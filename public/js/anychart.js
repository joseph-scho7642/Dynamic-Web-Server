
// create data
var data = [
    {x: "A", value: 637166},
    {x: "B", value: 721630},
    {x: "C", value: 148662},
    {x: "D", value: 78662},
    {x: "E", value: 90000}
];

// create a pie chart and set the data
chart = anychart.pie(data);

/* set the inner radius
(to turn the pie chart into a doughnut chart)*/
chart.innerRadius("30%");

// set the container id
chart.container("container");

// initiate drawing the chart
chart.draw();


/*
function draw() {
    // create data
    var data = [
        {x: "A", value: 637166},
        {x: "B", value: 721630},
        {x: "C", value: 148662},
        {x: "D", value: 78662},
        {x: "E", value: 90000}
    ];
    
    // create a pie chart and set the data
    chart = anychart.pie(data);
    
    /* set the inner radius
    (to turn the pie chart into a doughnut chart)*/ /*
    chart.innerRadius("30%");
    
    // set the container id
    chart.container("container");
    
    // initiate drawing the chart
    chart.draw();
}


module.exports = {draw};

*/