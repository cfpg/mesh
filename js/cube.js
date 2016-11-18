define([
  'underscore',
  'three',
  
  'js/lib/obj'
], function(
  _,
  THREE,
  
  Figure
) {
  
  var Cube = function() {
    Figure.apply(this, arguments);
  };
  
  Cube.prototype = Object.create(Figure.prototype);
  
  Cube.prototype.getGeometry = function() {
    return new THREE.BoxGeometry( 1, 1, 2 );
  };
    
  Cube.prototype.getMaterial = function() {
    return new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  };
  
  return Cube;
  
});