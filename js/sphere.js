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
     
    this.moveBy = 1;
    this.imageSrc = arguments[2];
    
    Figure.apply(this, arguments);
    
  };
  
  Sphere.prototype = Object.create(Figure.prototype);
  
  Sphere.prototype.setup = function() {
    
    this.obj = this.getObj();
    
    Figure.prototype.setup.call(this);
    
    this.obj.position.set(0, 120, 100);
    this.obj.scale.set(25, 25, 1);
  };
  
  Sphere.prototype.getGeometry = function() {
    return new THREE.SphereGeometry( 5, 64, 64 );
  };
    
  Sphere.prototype.getMaterial = function() {
    var texture = new THREE.TextureLoader().load( this.imageSrc, function() {
      console.log('TEXTURE LOADED')
    });
    
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2,2);
    
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
    this.obj.position.z = 100;
    this.obj.position.x = -300;
    
    if (this.obj.position.y < 130 && this.obj.position.y > -130) {
      this.obj.position.y -= (this.moveBy / 10);
    } else {
      this.obj.position.y += (this.moveBy / 10);
    }
    
    this.obj.rotation.x -= ( this.moveBy / 50);
    this.obj.rotation.y -= ( this.moveBy / 100);
    this.obj.scale.set(25, 25, 25);
    
    this.obj.material.opacity = 1;
    this.obj.material.alphaTest = 0.01;
    
    if ((this.obj.position.y - 200) > window.innerHeight) {
      //this.delete();
    }
  };
    
  Sphere.prototype.getCoeficient = function() {
    return 0.2;
  };
  
  return Sphere;
  
});