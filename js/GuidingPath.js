var GuidingPath = function (svg) {
  "use strict";
  this.sequence = [];
  this.numOfIterations = 1000;
  this.segmentLength  = 10;
  this.padding = 70;
  this.donorVector = new THREE.Vector2(10, 10).setLength(this.segmentLength);
  this.clientDims = {
    width: document.getWidth(),
    height: document.getHeight()
  };
  this.svg = svg;

  this.createRandomSequence();
  this.insertGuidingCircles(this.sequence);
};

/**
 * Creates a random sequence of coordinates with certain ammount of jitter to them.
 * @return {Array} An array of @link{PathObject}s.
 */
GuidingPath.prototype.createRandomSequence = function () {
  "use strict";
  this.sequence.length = this.numOfIterations;

  for(var i = 0; i < this.sequence.length; i++) {
    var pathObject = new PathObject(
      this.donorVector.clone()
      , (i > 0)? this.sequence[i-1].position.clone() : new THREE.Vector2(this.padding + 3,this.padding + 3)
    );
    if(i > 0) pathObject.position.add(this.sequence[i-1].vector);

    var courseDir = (Math.random() - 0.5) * 100;
    this.courseCorrect(pathObject);
    this.rotate(pathObject.vector, courseDir);

    this.sequence[i] = pathObject;
  };
};

/**
 * Course correct when the stream hits a border.
 * @param  {Object} coordinate Object containing the directional vector and the position vector.
 * @return {void}
 */
GuidingPath.prototype.courseCorrect = function (coordinate) {
  "use strict";
  if(coordinate.position.x < this.padding ||
    coordinate.position.x > this.clientDims.width - this.padding) {
    coordinate.vector.x = -coordinate.vector.x; // set coordinate to the inverse coordinate
    this.donorVector.x = -(this.donorVector.x * 1.004); // update the donor vector with the new general direction.
  }

  if(coordinate.position.y < this.padding ||
    coordinate.position.y > this.clientDims.height - this.padding) {
    coordinate.vector.y = -coordinate.vector.y; // set coordinate to the inverse coordinate
    this.donorVector.y = -(this.donorVector.y * 1.004); // update the donor vector with the new general direction.
  }
};

/**
 * Util method for rotating a vector by a given amount of degrees.
 * @param  {Object} vector  Any object that at least has x and y properties.
 * @param  {Number} degrees Any value, because all values are normalized to 0 till 360.
 * @return {void}
 */
GuidingPath.prototype.rotate = function (vector, degrees) {
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
GuidingPath.prototype.insertPaths = function (coorSequence) {
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
GuidingPath.prototype.insertGuidingCircles = function (coorSequence) {
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
