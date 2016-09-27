var d3 = require("d3");

module.exports = (function(){

    var el;
    var $el;
    var w = 0, h = 0;
    var color;

    var init = function(element, data, colors, stroke){
        el = element;
        $el = document.querySelector(el);
        w = $el.clientWidth;
        h = $el.clientHeight;
        color = d3.scale.ordinal()
            .range(colors);

        console.log("init");
        console.log(`Width: ${w}, height: ${h}`);

        var svg = d3.select(el).append('svg')
            .attr('width', w)
            .attr('height', h);


        // ************************** Блок фотонового кружка
        var groupDonutBg = svg.append('g')
            .attr('transform', 'translate(' + w/2 + ','+ h/2 +')');

        var arcBg = d3.svg.arc()
            .innerRadius(w/4 - stroke*1.75)
            .outerRadius(w/4 + stroke*0.75)
            .startAngle(0)
            .endAngle(Math.PI * 2);

        var arcsBg = groupDonutBg
            .append('g')
            .attr('class', 'arc-bg')
            .append('path')
            .attr('d', arcBg)
            .attr('fill', '#F5F8FD');

        // ************************** Собственно donut
        var groupDonut = svg.append('g')
            .attr('transform', 'translate(' + w/2 + ','+ h/2 +')');

        var arc = d3.svg.arc()
            .innerRadius(w/4 - stroke)
            .outerRadius(w/4);

        var pie = d3.layout.pie()
            .value(function(d){ return d; })

        var arcs = groupDonut.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc')
            .attr('stroke-width', stroke/2)
            .attr('stroke', '#F5F8FD')
            // .attr('stroke-opacity', 0.75)
            ;

        arcs.append('path')
            .attr('d', arc)
            .attr('class', 'arc-interactive')
            .attr('fill', d => {
                return color(d.data)
            })
            .on('mouseover', function(d) {
                var x = d3.event.screenX;
                var y = d3.event.screenY;
                d3.select('#tooltip')
                    .text(d.value);
                d3.select('#tooltip')
                    .style('left', function(){
                        return x - 85 + 'px';
                    })
                    .style('top', function() {
                        return y - 140 + 'px';
                    })
                    .style('opacity', 1);
            })
            .on('mouseout', function(){
                d3.select('#tooltip')
                    .style('opacity', 0);
            })
            ;
    };

    return {
        init: init
    };
})();
