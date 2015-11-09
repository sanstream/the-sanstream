$(document).addEvent('domready', function () {

  Sanstream.init();
});

var Sanstream = {

  mainSequence: null,
  svg: null,

  init: function () {
    this.svg = d3.select('body').append('svg');
  },

  rotate: function (vector, degrees) {
    radians = (degrees/360) * 2 * Math.PI;
    result = new THREE.Vector2();
    result.setX( vector.x * Math.cos(radians) - vector.y * Math.sin(radians));
    result.setY( vector.x * Math.sin(radians) + vector.y * Math.cos(radians));
    return result;
  },


  createStream: function (color, randomCoorSequence) {
    var coordinatestring = randomCoorSequence.map(function (coorSet) {
      return " " + coorSet.x + "," + coorSet.y;
    }).join(" ");

    return this.svg.append('path')
      .classed('medium-width', true)
      .attr('d', function () {
        return "M" + coordinatestring;
      });
  }
}
