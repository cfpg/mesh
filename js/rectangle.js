define([
  'three',
  
  'js/lib/obj'
], function(
  THREE,
  
  Figure
) {
  
  var Rectangle = function() {
    Figure.apply(this, arguments);
  }
  
  Rectangle.prototype = Object.create(Figure.prototype);
  
  Rectangle.prototype.getGeometry = function() {
    console.log('RECTANGLING')
    return new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  };
  
  Rectangle.prototype.getMaterial = function() {
    return new THREE.MeshLambertMaterial({
      color: 0xFF00FF
    });
  };
  
  Rectangle.prototype.positionObject = function() {
    this.obj.position.z = 550;
  };
  
  return Rectangle;
  
});