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
     
    this.moveBy = 0.1;
    this.imageSrc = arguments[2];
    
    Figure.apply(this, arguments);
    
  };
  
  Sphere.prototype = Object.create(Figure.prototype);
  
  Sphere.prototype.setup = function() {
    
    this.obj = this.getObj();
    this.obj.position.y = 200;
    this.obj.scale = new THREE.Vector3(25, 25, 25);
    
    Figure.prototype.setup.call(this);
  };
  
  Sphere.prototype.getGeometry = function() {
    return new THREE.SphereGeometry( 5, 64, 32 );
  };
    
  Sphere.prototype.getMaterial = function() {
    var texture = new THREE.TextureLoader().load( this.imageSrc, function() {
      console.log('TEXTURE LOADED')
    } );
    return new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      map: texture
    });
  };
  
  Sphere.prototype.setImageSrc = function(src) {
    this.imageSrc = src;
  };
    
  Sphere.prototype.positionObject = function() {
    this.obj.geometry.dynamic = true;
    this.obj.position.z = 1;
    // this.obj.position.y += moveBy;
    
    if ((this.obj.position.y - 200) > window.innerHeight) {
      //this.delete();
    }
  };
    
  Sphere.prototype.getCoeficient = function() {
    return 0.2;
  };
  
  return Sphere;
  
});