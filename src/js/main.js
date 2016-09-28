// var d3 = require("d3");
// var classie = require("./classie");
// var settings = require("./settings");
//
// console.log( "d3 version is " + d3.version );
var donutChart = require("./components/donut-chart");

var data = [ 12397, 4882, 771 ];
var options = {
    colors: ['#1ABC9C', '#F77824', '#E69A21'],
    bgColor: "#F5F8FD",
    stroke: 16,
    rFactor: 0.4,
    bgFactor: .3
};

donutChart.init("#donut-chart", data, options);
