$(document).addEvent('domready', function () {

  Sanstream.init();
});

var Sanstream = {

  mainSequence: null,
  svg: null,
  numOfIterations: 300,
  segmentLength : 20,
  donorVector: new THREE.Vector2(20, 20).setLength(20),
  didATwist: false,

  clientDims: {
    width: null,
    height: null
  },

  init: function () {
    this.svg = d3.select('body').append('svg');
    this.clientDims.width = document.getWidth();
    this.clientDims.height = document.getHeight();
    this.setUpBasePath();
  },

  setUpBasePath: function () {
    var randomSequence = this.createRandomSequence();
    this.insertPaths(randomSequence);
    this.insertGuidingCircles(randomSequence);
  },


  createRandomSequence: function () {
    var sequence = [];
    sequence.length = this.numOfIterations;
    for(var i = 0; i < sequence.length; i++) {

      sequence[i] = {
        vector: this.donorVector.clone(),
        position: (i>0)? sequence[i-1].position.clone() : new THREE.Vector2(0,0)
      };
      if(i > 0) sequence[i].position.add(sequence[i-1].vector);

      var courseDir = (Math.random() - 0.5) * 100;
      courseDir = this.courseCorrect(sequence[i].vector, courseDir);
      this.rotate(sequence[i].vector, courseDir);
    };

    return sequence;
  },

  courseCorrect: function (coordinate, courseDir) {

    if(coordinate.x < 0){
      return -courseDir;
    }
    else if (coordinate.x > this.clientDims.width) {
      return -courseDir;
    }

    if(coordinate.y < 0){
      return -courseDir;
    }
    else if(coordinate.y > this.clientDims.height) {
      return -courseDir;
    }
    return courseDir;
  },

  rotate: function (vector, degrees) {
    radians = ((degrees % 360)/360) * 2 * Math.PI;
    vector.setX(vector.x * Math.cos(radians) - vector.y * Math.sin(radians));
    vector.setY(vector.x * Math.sin(radians) + vector.y * Math.cos(radians));
  },


  insertPaths: function (coorSequence) {

    var group = this.svg.append('g').classed('orange', true);
    group.selectAll('path').data(coorSequence).enter()
      .append('path')
      .attr('d', function (coor) {
        return "M 0,0 " + coor.vector.x + "," + coor.vector.y;
      })
      .attr('transform', function (coor, i) {
        return "translate(" + coor.position.x + ", " + coor.position.y + ")";
      });
  },

  insertGuidingCircles: function (coorSequence) {
    var cirleGroup = this.svg.append('g').classed('guiding-circles', true);
    cirleGroup.selectAll('circle').data(coorSequence).enter()
      .append('circle')
      .attr('r', this.segmentLength)
      .attr('cx', function (coor) {
          return coor.position.x;
      })
      .attr('cy', function (coor) {
          return coor.position.y;
      });
  }
}
