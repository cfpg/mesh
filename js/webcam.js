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
    
    this.params = arguments[2];
    
    Figure.apply(this, arguments);
  };
  
  Webcam.prototype = Object.create(Figure.prototype);
  
  Webcam.prototype.position = function() {
    return;
  };
  
  Webcam.prototype.render = function() {
    
    this.createAudioContext();
    
  };
  
  Webcam.prototype.setup = function() {
    this.obj = this.getObj();
  };
  
  Webcam.prototype.createVideo = function() {
    this.video      = document.createElement('video');
    this.video.width    = 320;
    this.video.height   = 240;
    this.video.autoplay = true;
    this.video.loop = true;
    this.video.volume = 0;
    
    var THAT = this;
    
    navigator.webkitGetUserMedia({
      video: true,
      audio: true
    }, function(stream){
      THAT.stream = stream;
      THAT.video.src    = window.URL.createObjectURL(stream);
    }, function(error){
      console.log("Failed to get a stream due to", error);
    });
    
  };
  
  Webcam.prototype.renderAudioContext = function() {
    
  };
  
  Webcam.prototype.createAudioContext = function() {
    if (!this.audioContext && this.stream) {
      
      this.audioContext = new AudioContext();
      this.audioAnalyzer = this.audioContext.createAnalyzer();
      this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
      
      this.audioAnalyzer.fftSize = 64;
      this.bufferLength = this.audioAnalyzer.fftSize;
      this.dataArray = new Uint8Array( this.bufferLength );
      this.audioAnalyzer.getByteTimeDomainData( this.dataArray );
      
      this.audioSource.connect( this.audioAnalyzer );
      
    } else if (this.audioContext) {
      this.renderAudioContext();
    }
  };
  
  Webcam.prototype.getMaterial = function() {
    this.texture = new THREE.Texture( this.video );
    
    return new THREE.MeshBasicMaterial({
      opacity: 1,
      map: this.texture
    });
  };
  
  return Webcam;
  
})