var Stream = {};

Stream = function (sequence, colourId, svg, xOffset, yOffset) {
  "use strict";

  this.svg = svg;
  this.clientDims = {
    width: document.getWidth(),
    height: document.getHeight()
  };
  this.offset = {
    x: xOffset || 0,
    y: yOffset || 0
  };
  this.ticker = 0;
  this.colourId = colourId;
  this.sequence = sequence.slice();
  this.jitterSequence();
  this.insertPaths();
  this.startAnimation();
};

/**
 * Jitters up the sequence.
 * @return {void}
 */
Stream.prototype.jitterSequence = function () {
  "use strict";
  for (var i = 0; i < this.sequence.length; i++) {
    if(i > 0) {
      this.sequence[i].position.x += (Math.random() - 0.5) * 10;
      this.sequence[i].position.y += (Math.random() - 0.5) * 10;

      this.sequence[i].vector.subVectors(this.sequence[i-1].position, this.sequence[i].position);
    }
  }
}

/**
 * Util method for rotating a vector by a given amount of degrees.
 * @param  {Object} vector  Any object that at least has x and y properties.
 * @param  {Number} degrees Any value, because all values are normalized to 0 till 360.
 * @return {void}
 */
Stream.prototype.rotate = function (vector, degrees) {
  "use strict";
  var radians = ((degrees % 360)/360) * 2 * Math.PI;
  vector.setX(vector.x * Math.cos(radians) - vector.y * Math.sin(radians));
  vector.setY(vector.x * Math.sin(radians) + vector.y * Math.cos(radians));
};

/**
 * Builds and insert a path into the document.
 * @param  {Array} coorSequence An array of @link{PathObject}
 * @return {void}
 */
Stream.prototype.insertPaths = function () {
  "use strict";
  var group = this.svg.append('g')
    .classed(this.colourId, true)
    .attr('transform', "translate(" + this.offset.x + "," + this.offset.y + ")");

  group.selectAll('path').data(this.sequence).enter()
    .append('path')
    .attr('d', function (coor) {
      return "M 0,0 " + coor.vector.x + "," + coor.vector.y;
    })
    .attr('transform', function (coor, i) {
      return "translate(" + coor.position.x + ", " + coor.position.y + ")";
    });
  this.paths = group.selectAll('path');
};

Stream.prototype.startAnimation = function () {

  console.debug(this.paths);
  var self = this;
  var interval = window.setInterval(function () {
    d3.select(self.paths[0][self.ticker]).classed('glow', true);
    self.ticker += 1;
    if(self.ticker > self.paths[0].length) {
      window.clearInterval(interval);
    }
  }, 700);
};
