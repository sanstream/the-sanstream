document.addEventListener('DOMContentLoaded', function () {
  "use strict";
  var streams = [];
  var svg = d3.select("svg.the-sanstream");
  svg.selectAll("path").each( function (d,index) {
    var path = d3.select(this).remove();

    svg.append('g')
    .attr('class',path.attr('class'))
    .selectAll("path")
        .data(lines(samples(path.node(), 10)))
      .enter().append("path")
        .attr("d", lineJoin);

    // Sample the SVG path uniformly with the specified precision.
    function samples(path, precision) {
      var pathLength = path.getTotalLength();
      var samplePoints = [0];
      var i = 0;
      var dt = precision;

      while ((i += dt) < pathLength)
      {
        samplePoints.push(i);
      }

      samplePoints.push(pathLength);
      return samplePoints.map(function(pointOnPath) {
        var p = path.getPointAtLength(pointOnPath);
        return {
          x: p.x,
          y: p.y,
          t: pointOnPath / pathLength
        };
      });
    }

    function lines (linePoints) {

      var lines = linePoints.map(function (linePoint, index) {
        if (index !== 0) {
          return [
            {
              x: linePoints[index-1].x,
              y: linePoints[index-1].y
            },
            {
              x: linePoint.x,
              y: linePoint.y
            }
          ]
        }
      });

      lines.shift();
      return lines;
    }

    // Compute stroke outline for segment p12.
    function lineJoin(datum) {
      return "M" + datum[0].x + "," + datum[0].y + "L" + datum[1].x + "," + datum[1].y;
    }
  });


  new Stream('yellow-orange', svg, 0, 0);
  new Stream('orange', svg, 0, 0);
  new Stream('reddish-orange', svg, 0, 0);
}, false);
