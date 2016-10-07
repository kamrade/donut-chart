var d3 = require("d3");

module.exports = (function(){

	var el;
	var $el;
	var w = 0, h = 0;

	var tooltip = d3.select('#tooltip');

	var init = function(element, data, options, type){
		// init start variables
		el = element;
		$el = document.querySelector(el);
		w = $el.clientWidth;
		h = $el.clientHeight;

		// DEFAULT VALUES
		var opt = {};
		opt.colors   = {
			all: {
				payment: "#1abc9c",
				refund: "#f77824",
				payout: "#e69a21",
				declined: options.bgColor || "#F5F8FD"
			},
			payment: {
				captured: "#1abc9c",
				declined: "#055c8d",
				voided: "#d8e1ea",
				chargeback: "#be4727"
			},
			refund: {
				captured: "#f77824",
				declined: "#055c8d"
			},
			payout: {
				captured: "#e69a21",
				declined: "#055c8d"
			}
		};

		opt.bgColor  = options.bgColor || "#F5F8FD";
		opt.stroke   = options.stroke || 16;
		opt.rFactor  = options.rFactor || 0.4;

		var innerRadius = w*opt.rFactor - opt.stroke;
		var outerRadius = w*opt.rFactor;

		// main svg
		var svg = d3.select(el).append('svg')
			.attr('width', w)
			.attr('height', h);

		// main group
		var groupDonut = svg.append('g')
			.attr('transform', 'translate(' + w/2 + ','+ h/2 +')');

		// constructors
		var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		var dataIn = [];
		for(var key in data){
			dataIn.push({
				name: key,
				value: data[key]
			})
		}

		var pie = d3.layout.pie()
			.sort(null)
			.startAngle(1.1*Math.PI)
			.endAngle(3.1*Math.PI)
			.value(function(d) {
				return d.value;
			});

		var arcs = groupDonut.selectAll('.arc')
			.data(pie(dataIn))
			.enter()
			.append('g')
			.attr('class', 'arc')
			.attr('stroke-width', opt.stroke/4)
			.attr('stroke', opt.bgColor)
			;

		var item = arcs.append('path')
			.attr('fill', function(d) {
				return opt.colors[type][d.data.name];
			})
			.transition()
			.delay(function(d, i) { return i * 100; })
			.duration(300)
			.ease('cubic')
			.attrTween('d', function(d) {
				var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
				return function(t) {
					d.endAngle = i(t);
					return arc(d);
				};
			});

		// init app-rate value
		var total = 0;

		Object.keys(data).map(function(key){
			total += data[key];
		});

		if(type != 'all') {
			var x = data.captured/total*100;
			$el.querySelector('.app-rate-value').innerHTML = x.toFixed(2) + "%";
		} else {
			var x = (data.payment + data.refund + data.payout)/total*100;
			$el.querySelector('.app-rate-value').innerHTML = x.toFixed(2) + "%";
		}

	}; // endof function init

	return {
		init: init
	};
})();
