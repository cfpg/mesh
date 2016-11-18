define([
  'three',
  
  'js/lib/obj',
  'js/sphere'
], function(
  THREE,
  
  Figure,
  Sphere
) {
  
  var Webcam = function() {    
    this.createVideo();
    
    Figure.apply(this, arguments);
  };
  
  Webcam.prototype = Object.create(Figure.prototype);
  
  Webcam.prototype.position = function() {
    console.log('positioning')
    return;
  };
  
  Webcam.prototype.render = function() {
    console.log('RENDERING WEBCAM')
  };
  
  Webcam.prototype.setup = function() {
    console.log('SETTING UP WEBCAM')
  };
  
  Webcam.prototype.createVideo = function() {
    this.video      = document.createElement('video');
    this.video.width    = 320;
    this.video.height   = 240;
    this.video.autoplay = true;
    this.video.loop = true;
    
    var THAT = this;
    
    navigator.webkitGetUserMedia({
      video: true,
      audio: false
    }, function(stream){
      THAT.video.src    = window.URL.createObjectURL(stream);
    }, function(error){
      console.log("Failed to get a stream due to", error);
    });
  };
  
  Webcam.prototype.getMaterial = function() {
    this.texture = new THREE.Texture( this.video );
    console.log(this.texture)
    return new THREE.MeshBasicMaterial({
      opacity: 1,
      map: this.texture
    });
  };
  
  return Webcam;
  
})