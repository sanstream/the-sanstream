var Stream = {};

Stream = function (colourId, svg, xOffset, yOffset) {
  "use strict";

  this.timing = 25;
  this.svg = svg;
  this.colourId = colourId;
  this.startAnimation();
};

Stream.prototype.startAnimation = function () {
  var ticker = 0;
  var paths = d3.select('g.'+ this.colourId).selectAll('path');
  var self = this;
  var interval = window.setInterval(function () {
    d3.select(paths[0][ticker]).classed('glow', true);
    ticker += 1;
    if(ticker > paths[0].length) {
      window.clearInterval(interval);
    }
  }, this.timing);
};
