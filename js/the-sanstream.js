$(document).addEvent('domready', function () {

  Sanstream.init();
});

var Sanstream = {

  mainSequence: null,
  svg: null,
  startAt: {
    x: 20,
    y: 20
  },
  numOfIterations: 400,
  addVector: new THREE.Vector2(10,10),
  donorVector: new THREE.Vector2(0,0),
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
    var dimStrings = this.createDimStrings(randomSequence);
    this.insertPaths(dimStrings);
  },


  createRandomSequence: function () {
    var sequence = [];
    sequence.length = this.numOfIterations;
    for(var index = 0; index < sequence.length; index++) {

      if(index === 0){
        sequence[index] = new THREE.Vector2(this.startAt.x, this.startAt.y);
      }
      else {
        sequence[index] = sequence[index-1].clone();
        var donorVector = sequence[index].clone().setLength(20);
        var courseDir = (Math.random() - 0.5) * 100;
        this.rotate(donorVector, courseDir);
        this.courseCorrect(sequence[index], donorVector, courseDir);

        sequence[index].add(donorVector);
      }
    };

    return sequence;
  },

  courseCorrect: function (coordinate , donorVector, courseDir) {


    if(coordinate.x < 0 || coordinate.x > this.clientDims.width){
      coordinate.sub(donorVector);
      this.rotate(donorVector, -courseDir);
    }

    if(coordinate.y < 0){
      this.donorVector.y =+ 20;
    }
    else if(coordinate.y > this.clientDims.height) {
      this.donorVector.y =- 20;
    }

    coordinate.add(this.donorVector);
    this.donorVector.setX(0);
    this.donorVector.setY(0);
  },

  rotate: function (vector, degrees) {
    radians = (degrees/360) * 2 * Math.PI;
    vector.setX( vector.x * Math.cos(radians) - vector.y * Math.sin(radians));
    vector.setY( vector.x * Math.sin(radians) + vector.y * Math.cos(radians));
  },


  createDimStrings: function (coorSequence) {
    var dimStrings = coorSequence.map(function (coorSet, index) {
      if(index < coorSequence.length - 1){
        return coorSet.x + "," + coorSet.y + " "
          + coorSequence[index+1].x + "," + coorSequence[index+1].y;
      }
      return "";
    });
    dimStrings.splice(coorSequence.length-1, 1);
    return dimStrings;
  },

  insertPaths: function (dimStrings) {

    var group = this.svg.append('g').classed('orange', true);
    group.selectAll('path').data(dimStrings).enter()
      .append('path')
      .attr('d', function (dimString) {
        console.debug(dimString);
          return "M" + dimString;
      });
  }
}
