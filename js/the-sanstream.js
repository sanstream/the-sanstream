$(document).addEvent('domready', function () {

  new Sanstream();
});

var Sanstream = {};

Sanstream = function () {
  "use strict";
  this.mainSequence = null
  this.numOfIterations = 500;
  this.segmentLength  = 20;
  this.padding = 70;
  this.donorVector = new THREE.Vector2(20, 20).setLength(20);
  this.clientDims = {
    width: null,
    height: null
  };

  this.svg = d3.select('body').append('svg');
  this.clientDims.width = document.getWidth();
  this.clientDims.height = document.getHeight();
  this.setUpBasePath();
};

/**
 * Sets up the base path by which all streams use as a guide.
 */
Sanstream.prototype.setUpBasePath = function () {
  "use strict";
  var randomSequence = this.createRandomSequence();
  this.insertPaths(randomSequence);
  //this.insertGuidingCircles(randomSequence);
};

/**
 * Creates a random sequence of coordinates with certain ammount of jitter to them.
 * @return {Array} An array of @link{PathObject}s.
 */
Sanstream.prototype.createRandomSequence = function () {
  "use strict";
  var sequence = [];
  sequence.length = this.numOfIterations;
  for(var i = 0; i < sequence.length; i++) {

    sequence[i] = {
      vector: this.donorVector.clone(),
      position: (i>0)? sequence[i-1].position.clone() : new THREE.Vector2(this.padding + 3,this.padding + 3)
    };
    if(i > 0) sequence[i].position.add(sequence[i-1].vector);

    var courseDir = (Math.random() - 0.5) * 100;
    this.courseCorrect(sequence[i]);
    this.rotate(sequence[i].vector, courseDir);
  };

  return sequence;
};

/**
 * Course correct when the stream hits a border.
 * @param  {Object} coordinate Object containing the directional vector and the position vector.
 * @return {void}
 */
Sanstream.prototype.courseCorrect = function (coordinate) {
  "use strict";
  if(coordinate.position.x < this.padding ||
    coordinate.position.x > this.clientDims.width - this.padding) {
    coordinate.vector.x = -coordinate.vector.x; // set coordinate to the inverse coordinate
    this.donorVector.x = -this.donorVector.x; // update the donor vector with the new general direction.
  }

  if(coordinate.position.y < this.padding ||
    coordinate.position.y > this.clientDims.height - this.padding) {
    coordinate.vector.y = -coordinate.vector.y; // set coordinate to the inverse coordinate
    this.donorVector.y = -this.donorVector.y; // update the donor vector with the new general direction.
  }
};

/**
 * Util method for rotating a vector by a given amount of degrees.
 * @param  {Object} vector  Any object that at least has x and y properties.
 * @param  {Number} degrees Any value, because all values are normalized to 0 till 360.
 * @return {void}
 */
Sanstream.prototype.rotate = function (vector, degrees) {
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
Sanstream.prototype.insertPaths = function (coorSequence) {
  "use strict";
  var group = this.svg.append('g').classed('orange', true);
  group.selectAll('path').data(coorSequence).enter()
    .append('path')
    .attr('d', function (coor) {
      return "M 0,0 " + coor.vector.x + "," + coor.vector.y;
    })
    .attr('transform', function (coor, i) {
      return "translate(" + coor.position.x + ", " + coor.position.y + ")";
    });
};

/**
 * Builds and inserts circles into the document.
 * Used a debug tool.
 * @param  {Array} coorSequence An array of @link{PathObject}
 * @return {void}
 */
Sanstream.prototype.insertGuidingCircles = function (coorSequence) {
  "use strict";
  var cirleGroup = this.svg.append('g').classed('guiding-circles', true);
  cirleGroup.selectAll('circle').data(coorSequence).enter()
    .append('circle')
    .attr('r', this.segmentLength *2)
    .attr('cx', function (coor) {
        return coor.position.x;
    })
    .attr('cy', function (coor) {
        return coor.position.y;
    });
};
