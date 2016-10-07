var d3 = require("d3");
var donutChart = require("./components/donut-chart");

// ++++++++++++++++++

var data = {};
var elements = {
	all: ".donut-chart.all",
	payment: ".donut-chart.payment",
	refund: ".donut-chart.refund",
	payout: ".donut-chart.payout"
};

var options = {
	bgColor: "#F5F8FD",
	stroke: 8,
	rFactor: 0.41
};

var jsonHandler = function(json){
	Object.keys(json).map(function(f){
		data[f] = json[f];
		data.all = {
			payment: json.payment.captured,
			refund: json.refund.captured,
			payout: json.payout.captured,
			declined: json.payment.declined + json.refund.declined + json.payout.declined + json.payment.voided + json.payment.chargeback
		}
	});
	for (var key in data) {
		donutChart.init(elements[key], data[key], options, key);
	}
};

d3.json('/data/input.json', jsonHandler)
