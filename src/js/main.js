// var d3 = require("d3");
// var classie = require("./classie");
// var settings = require("./settings");
//
// console.log( "d3 version is " + d3.version );

var data = [ 12397, 4882,771 ];
var colors = ['#1ABC9C', '#F77824', '#E69A21'];
var strokeWidth = 8;

var donutChart = require("./components/donut-chart");
donutChart.init("#donut-chart", data, colors, strokeWidth);
