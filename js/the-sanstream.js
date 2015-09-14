$(document).addEvent('domready', function () {

  Sanstream.init();
});

var Sanstream = {

  stream : {
      red: null,
      orange: null,
      yellow: null
  },

  mainSequence: null,

  svg: null,

  getHighDeviation: d3.random.normal(40,20),
  getNormalDeviation: d3.random.normal(20,10),
  getLowDeviation: d3.random.normal(3,1),
  stepSize: 40,
  numOfLineSegments: 2000,

  init: function () {

    d3.select('body')
      .style({
        'height': '100%',
        'width': '100%',
        'position': 'absolute'
    });

    this.svg = d3.select('body').append('svg')
      .style({
        'height': '100%',
        'width': '100%',
        'position': 'absolute',
        'z-index': 1,
        'background-color': 'black'
      });

    this.mainSequence = this.generateGuidingSequence();
    var main = this.createStream('rgba(0,0,255,0.5)',this.mainSequence);
    main.style({'stroke-width':0});

    this.createStream('#FF7600', this.generateSequence(this.getNormalDeviation));
    this.createStream('#FF9800', this.generateSequence(this.getNormalDeviation));
    this.createStream('rgba(255, 180, 0, 0.6)', this.generateSequence(this.getNormalDeviation));

    this.createStream('rgba(255,118,0,0.5)', this.generateSequence(this.getNormalDeviation));
    this.createStream('rgba(255, 152, 0, 0.6)', this.generateSequence(this.getHighDeviation));

    this.createStream('rgba(255, 180, 0, 0.6)', this.generateSequence(this.getHighDeviation));

  },

  randomize: function (amplitude) {
      return (Math.random()) * amplitude;
  },

  randomAngle: function () {
    return (Math.random() -0.5 ) * 10;
  },

  rotate: function (vector, degrees) {

    radians = (degrees/360) * 2 * Math.PI;
    result = new THREE.Vector2();
    result.setX( vector.x * Math.cos(radians) - vector.y * Math.sin(radians));
    result.setY( vector.x * Math.sin(radians) + vector.y * Math.cos(radians));
    return result;
  },

  generateSequence: function (deviation) {

    var sequence = this.mainSequence.map(function (item, index) {

        //if(index % 6 !== 0){ // align to the main sequence:

          return new THREE.Vector2(
            item.x + deviation(item.x),
            item.y + deviation(item.y));
        // }
        // else{
        //
        //   return new THREE.Vector2(
        //     item.x + this.getLowDeviation(item.x),
        //     item.y + this.getLowDeviation(item.y)
        //   );
        // }
    }, this);

    console.debug(sequence);
    return sequence;
  },

  generateGuidingSequence: function () {

    // Building up a random sequence:
    var sequence = d3.range(0, this.numOfLineSegments,this.stepSize).map(function (item, index) {

      var vector = new THREE.Vector2(this.randomize(this.stepSize), this.randomize(this.stepSize));
      vector = this.rotate(vector, this.randomAngle());
      return vector;

    }, this);

    // The sequence are absolute positions, so the position vectors needs to increase to:
    sequence.forEach(function (vector, index){

      if (index > 0){
        sequence[index] = vector.add(sequence[index-1]);
      }
    }, this)

    return sequence;
  },

  createStream: function (color, randomCoorSequence) {

    var coordinatestring = randomCoorSequence.map(function (coorSet) {
      return " " + coorSet.x + "," + coorSet.y;
    }).join(" ");

    return this.svg.append('path')
      .style({
        'stroke': color,
        'stroke-width': 2,
        'fill': 'none'
      })
      .attr('d', function () {
        return "M" + coordinatestring;
      });
  },
}
