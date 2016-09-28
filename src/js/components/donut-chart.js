var d3 = require("d3");

module.exports = (function(){

    var el;
    var $el;
    var w = 0, h = 0;
    var color; // color scaling

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

        // создаем svg элемент с задаными параметрами
        var svg = d3.select(el).append('svg')
            .attr('width', w)
            .attr('height', h);

        // // Рисуем фоновый круг
        // var groupDonutBg = svg.append('g')
        //     .attr('transform', 'translate(' + w/2 + ','+ h/2 +')');
        //
        // var arcBg = d3.svg.arc()
        //     .innerRadius(w*opt.rFactor - (opt.stroke + opt.stroke*opt.bgFactor))
        //     .outerRadius(w*opt.rFactor + opt.stroke*opt.bgFactor)
        //     .startAngle(0)
        //     .endAngle(Math.PI * 2);
        //
        // var arcsBg = groupDonutBg
        //     .append('g')
        //     .attr('class', 'arc-bg')
        //     .append('path')
        //     .attr('d', arcBg)
        //     .attr('fill', opt.bgColor);

        // donut
        var groupDonut = svg.append('g')
            .attr('transform', 'translate(' + w/2 + ','+ h/2 +')');

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.layout.pie()
            .sort(null)
            .startAngle(1.1*Math.PI)
            .endAngle(3.1*Math.PI)
            .value(function(d) { return d.value; });

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
                return color(d.data.value)
            })
            .transition()
            .delay(function(d, i) { return i * 300; })
            .duration(500)
            .ease('elastic(0.8)')
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                    return arc(d);
                };
            });

            // item[0][0].on('mouseover', function(d) {
            //     var x = d3.event.screenX;
            //     var y = d3.event.screenY;
            //     d3.select('#tooltip')
            //         .text(d.value);
            //     d3.select('#tooltip')
            //         .style('left', function(){
            //             return (x - 98) + 'px';
            //         })
            //         .style('top', function() {
            //             return (y - 155) + 'px';
            //         })
            //         .style('opacity', 1);
            // })
            // .on('mouseout', function(){
            //     d3.select('#tooltip')
            //         .style('opacity', 0);
            // })
            // ;
    };

    return {
        init: init
    };
})();
