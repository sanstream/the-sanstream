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

  init: function () {
    this.svg = d3.select('body').append('svg');

    this.setUpBasePath();
  },

  setUpBasePath: function () {
    var randomSequence = this.createRandomSequence();
    var dimString = this.createDimString(randomSequence);
    this.insertPath(dimString);
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
        //sequence[index].add(this.addVector);

        var donorVector = sequence[0].clone();
        this.rotate(donorVector, (Math.random() - 0.5) * 100);
        sequence[index].add(donorVector);
        //sequence[index].x += (Math.random() - 0.5) * 30;
        //sequence[index].y += (Math.random() - 0.5) * 30;
      }
    };

    return sequence;
  },

  rotate: function (vector, degrees) {
    radians = (degrees/360) * 2 * Math.PI;
    vector.setX( vector.x * Math.cos(radians) - vector.y * Math.sin(radians));
    vector.setY( vector.x * Math.sin(radians) + vector.y * Math.cos(radians));
  },


  createDimString: function (coorSequence) {
    return coorSequence.map(function (coorSet) {
      return " " + coorSet.x + "," + coorSet.y;
    }).join(" ");
  },

  insertPath: function (dimString) {
    this.svg.append('path')
      .classed('medium-width', true)
      .classed('orange', true)
      .attr('d', function () {
        return "M" + dimString;
      }
    );
  }
}
