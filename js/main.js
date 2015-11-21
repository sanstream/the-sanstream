$(document).addEvent('domready', function () {
  "use strict";
  var svg = d3.select('body').append('svg');
  var guidingPath = new GuidingPath(svg);
  new Stream(guidingPath.sequence, 'yellow-orange', svg, 0, 0);
  new Stream(guidingPath.sequence, 'orange', svg, 11, 12);
  new Stream(guidingPath.sequence, 'reddish-orange', svg, 15, 20);
});
