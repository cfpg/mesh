define([
  'underscore',
  'three',
  
  'js/lib/obj',
  'js/webcam'
], function(
  _,
  THREE,
  
  Figure,
  Webcam
) {
  
  var Sphere = function() {
    Figure.apply(this, arguments);
  };
  
  Sphere.prototype = Object.create(Figure.prototype);
  
  Sphere.prototype.getGeometry = function() {
    return new THREE.SphereGeometry( 5, 64, 32 );
  };
    
  Sphere.prototype.getMaterial = function() {
    var texture = new THREE.TextureLoader().load( this.getImageSrc() );
    return new THREE.MeshBasicMaterial({
      opacity: 1,
      map: texture
    });
  };
  
  Sphere.prototype.getImageSrc = function() {
    var imgs = [
      './imgs/lines.png',
      './imgs/spiral.png',
      './imgs/volume.png'
    ];
    
    var min = 0;
    var max = imgs.length - 1;
    return imgs[ Math.floor( Math.random() * (max - min + 1) ) + min ];
  }
    
  Sphere.prototype.positionObject = function() {
    this.obj.geometry.dynamic = true;
    // this.obj.position.x = 1;
    // this.obj.position.y = 1;
    // this.obj.position.z = 1;
  };
    
  Sphere.prototype.getCoeficient = function() {
    return 0.2;
  };
  
  return Sphere;
  
});