var d3 = require("d3");

module.exports = (function(){

    var el;
    var $el;
    var w = 0, h = 0;
    var color; // color scaling

    var tooltip = d3.select('#tooltip');

    var init = function(element, data, options){
        // инициализируем стартовые перменные
        el = element;
        $el = document.querySelector(el);
        w = $el.clientWidth;
        h = $el.clientHeight;

        // DEFAULT VALUES
        var opt = {};
        opt.colors   = options.colors || ['#1ABC9C', '#F77824', '#E69A21'];
        opt.bgColor  = options.bgColor || "#F5F8FD";
        opt.stroke   = options.stroke || 16;
        opt.rFactor  = options.rFactor || 0.4;
        opt.bgFactor = options.bgFactor || 0.3

        var innerRadius = w*opt.rFactor - opt.stroke;
        var outerRadius = w*opt.rFactor;

        color = d3.scale.ordinal()
            .range(opt.colors);

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

        var pie = d3.layout.pie()
            .sort(null)
            .startAngle(1.1*Math.PI)
            .endAngle(3.1*Math.PI)
            .value(function(d) { return d.total; });

        var arcs = groupDonut.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('stroke-width', opt.stroke/2)
            .attr('stroke', opt.bgColor)
            ;

        var item = arcs.append('path')
            .attr('class', 'arc-interactive')
            .attr('fill', d => {
                return color(d.data.total)
            })
            .transition()
            .delay(function(d, i) { return i * 300; })
            .duration(500)
            .ease('cubic')
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                    return arc(d);
                };
            });

            // events
            arcs
            .on('mouseout', tooltipHide)
            .on('mousemove', function(d){
				// console.log(d.data.name);
                var x = d3.event.offsetX;
                var y = d3.event.offsetY;
                tooltip.text(d.data.name + ": " + d.value);
                x = x - (tooltip[0][0].clientWidth/2);
                y = y - (tooltip[0][0].clientHeight + 8);
                tooltip.style('left', x + 'px')
                    .style('top', y + 'px');
                tooltipShow();
            });
    }; // endof function init

    var tooltipShow = function(){
        tooltip.style('opacity', 1);
    };
    var tooltipHide = function(){
        tooltip.style('opacity', 0);
    };

    return {
        init: init,
        tooltipHide: tooltipHide
    };
})();
