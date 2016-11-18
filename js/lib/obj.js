define([
  'underscore',
  'three'
], function(
  _,
  THREE
) {
  
  var Figure = function(scene, camera) {
    this.obj = null;
    
    this.scene = scene;
    this.camera = camera;
    
    this.setup();
  }
  
  Figure.prototype.setup = function() {
    this.obj = this.getObj();
    this.scene.add( this.obj );
    
    this.camera.position.z = 5;
  };
  
  Figure.prototype.render = function(direction) {
    
    this.positionObject(direction);
    
    return this;
  };
  
  Figure.prototype.getGeometry = function() {
    return new THREE.BoxGeometry( 1, 1, 2 );
  };
  
  Figure.prototype.getMaterial = function() {
    return new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  };
  
  Figure.prototype.getObj = function() {
    return new THREE.Mesh( this.getGeometry(), this.getMaterial() );
  };
  
  Figure.prototype.setScene = function(scene) {
    this.scene = scene;
  };
  
  Figure.prototype.setCamera = function(camera) {
    this.camera = camera;
  };
  
  Figure.prototype.getCoeficient = function() {
    return 0;
  };
  
  Figure.prototype.positionObject = function(direction) {
    this.obj.rotation.x += 0.01;
    this.obj.rotation.y += 0.01;
    
    if (direction == 'up') {
      this.obj.position.y += ( 0.1 + this.getCoeficient() );
      this.obj.position.x -= 0.2;
    } else {
      this.obj.position.y -= ( 0.1 + this.getCoeficient() );
      this.obj.position.x += 0.2;
    }
    
    return true;
  };
  
  return Figure;
  
});