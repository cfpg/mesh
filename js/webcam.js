define([
  'three',
  'tween',
  
  'js/lib/obj',
  'js/sphere'
], function(
  THREE,
  TWEEN,
  
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
    
    // Create color based on Audio Data
    this.audioAnalyzer.getByteFrequencyData( this.dataArray );
    this.createAudioColor();
    
  };
  
  Webcam.prototype.createAudioColor = function() {
    
    // Divide the dataArray
    var bucketSize = this.dataArray.length / 3;
    var buckets = [];
    for (var n in this.dataArray) {
      if (n > bucketSize * 2) {
        if (typeof buckets[0] == 'undefined') buckets[0] = [];
        
        buckets[0].push( this.dataArray[n] / 255 );
      } else if (n > bucketSize) {
        if (typeof buckets[1] == 'undefined') buckets[1] = [];
        
        buckets[1].push( this.dataArray[n] / 255 );
      } else {
        if (typeof buckets[2] == 'undefined') buckets[2] = [];
        
        buckets[2].push( this.dataArray[n] / 255 );
      }
    }
    
    var r=0, g=0, b=0;
    for (var i in buckets) {
      // Sum all values
      var sum = 0;
      for (var j in buckets[i]) {
        sum += buckets[i][j];
      }
      
      if (i == 0) {
        r = (sum * 100) / 255;
        if (r > 255) r = 255;
      } else if ( i == 1 ) {
        g = (sum * 100) / 255;
        if (g > 255) g = 255;
      } else {
        b = (sum * 100) / 255;
        if (b > 255) b = 255;
      }
    }
    
    var volume = (r + g + b);
    var delta = 0.1;
    this.colorColor.set( new THREE.Color( r,g,b ) );
    
  };
  
  Webcam.prototype.createAudioContext = function() {
    if (!this.audioContext && this.stream) {
      
      this.audioContext = new AudioContext();
      this.audioAnalyzer = this.audioContext.createAnalyser();
      this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
      this.audioSource.connect( this.audioAnalyzer );
      
      this.audioAnalyzer.fftSize = 2048;
      this.bufferLength = this.audioAnalyzer.fftSize;
      this.dataArray = new Uint8Array( this.audioAnalyzer.frequencyBinCount );
      this.audioAnalyzer.getByteFrequencyData( this.dataArray );
      
      // Create Geometry
      this.colorGeo = new THREE.PlaneGeometry( this.params.canvasWidth / 4, this.params.canvasHeight, 32 );
      this.colorColor = new THREE.Color(255, 255, 255);
      this.colorMaterial = new THREE.MeshBasicMaterial({
        color: this.colorColor
      });
      this.colorMesh = new THREE.Mesh( this.colorGeo, this.colorMaterial );
      this.colorMesh.position.z = -40;
      this.scene.add( this.colorMesh );
      
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
  
});