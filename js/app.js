define([
  'underscore',
  'three',
  'js/lib/ImprovedNoise',
  
  'js/cube',
  'js/sphere',
  'js/rectangle',
  'js/webcam'
], function(
  _,
  THREE,
  ImprovedNoise,
  
  Cube,
  Sphere,
  Rectangle,
  Webcam
) {
  
  function App() {    
    this.setupParams();
    
    this.perlin = new ImprovedNoise();
    this.spheres = [];
    
    window.scene = this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 5000 );
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.position.z = 600;
    
    // Start webcam
    this.webcam = new Webcam(this.scene, this.camera);
    
    // Create Webcam/Video Texture
    this.webcamTexture = new THREE.Texture( this.webcam.video );
    
    // Add world
    this.world3D = new THREE.Object3D();
    this.scene.add( this.world3D );
    
    // Add mirror
    this.mirrorGeometry = new THREE.PlaneGeometry(640, 480, this.params.canvasWidth, this.params.canvasHeight);
    this.mirrorGeometry.dynamic = true;
    this.meshMaterial = new THREE.MeshBasicMaterial({
      opacity: 1,
      map: this.webcamTexture
    });
    this.mirror = new THREE.Mesh(this.mirrorGeometry, this.meshMaterial);
    // this.world3D.add( this.mirror );
    
    // Add wireframe plane
    this.wireMaterial = new THREE.MeshBasicMaterial({
      opacity: 0.5,
      color: 0xffffff,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    this.wireMirror = new THREE.Mesh(this.mirrorGeometry, this.wireMaterial);
    this.world3D.add( this.wireMirror );
    this.wireMirror.position.z = 5;
    
    //init vidCanvas - used to analyze the video pixels
    this.vidCanvas = document.createElement('canvas');
    document.body.appendChild(this.vidCanvas);
    this.vidCanvas.style.position = 'absolute';
    this.vidCanvas.style.display = 'none';
    this.ctx = this.vidCanvas.getContext('2d');
    
    // Start rendering and animation!
    this.createSphere('./img/spiral.png');
    this.listeners();
    this.appendToBody();
    this.onResize();
    this.animate();
  };
  
  App.prototype.constructor = App;
  
  App.prototype.setupParams = function() {
    
    this.params = {
      canvasWidth: 320 / 2,
      canvasHeight: 240 / 2,
      
      zoom: 1,
      
      mouseX: 0,
      mouseY: 0,
      
      tiltSpeed: 0.1,
      tiltAmount: 0.5,
      
      noisePosn: 0,
      noiseSpeed: 0.02,
      noiseScale: 0.01,
      noiseStrength: 200,
      
      zDepth: 200
    };
    
  };
  
  App.prototype.appendToBody = function() {
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.sortObjects = false,
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    
  };
  
  App.prototype.addLighting = function() {
    this.pointLight = new THREE.PointLight(0xFFFFFF);

    // set its position
    this.pointLight.position.x = 0;
    this.pointLight.position.y = 50;
    this.pointLight.position.z = 130;

    // add to the scene
    this.scene.add(this.pointLight);
  };
  
  App.prototype.animate = function() {
    if (this.webcam.video.readyState === this.webcam.video.HAVE_ENOUGH_DATA) {
      this.webcamTexture.needsUpdate = true;
      this.getZDepths();
    }
    
    // Queue next animation
    requestAnimationFrame ( _.bind(this.animate, this) );
    this.render();
  };
  
  App.prototype.render = function() {
    
    this.world3D.scale = new THREE.Vector3(this.params.zoom, this.params.zoom, 1);
    this.world3D.rotation.x += ((this.params.mouseY * this.params.tiltAmount) - this.world3D.rotation.x) * this.params.tiltSpeed;
    this.world3D.rotation.y += ((this.params.mouseX * this.params.tiltAmount) - this.world3D.rotation.y) * this.params.tiltSpeed;
    
    this.renderer.render(this.scene, this.camera);
    
  };
  
  App.prototype.createSphere = function(imageSrc) {
    // Add a sphere to the scene randomly
    var s = new Sphere(this.world3D, this.camera, imageSrc);
    s.render();
    this.spheres.push(s);
  };
  
  App.prototype.getZDepths = function() {
    this.params.noisePosn += this.params.noiseSpeed;
    
    //draw webcam video pixels to canvas for pixel analysis
    //double up on last pixel get because there is one more vert than pixels
    this.ctx.drawImage(this.webcam.video, 0, 0, this.params.canvasWidth + 1, this.params.canvasHeight + 1);
    this.pixels = this.ctx.getImageData(0, 0, this.params.canvasWidth + 1, this.params.canvasHeight + 1).data;
    
    for (var i = 0; i < this.params.canvasWidth + 1; i++) {
      for (var j = 0; j < this.params.canvasHeight + 1; j++) {
        var color = new THREE.Color(this.getVideoColor(i, j));
        var brightness = this.getVideoBrightness(color);
        var gotoZ = this.params.zDepth * brightness - this.params.zDepth / 2;
        
        //tween to stablize
        var index = j * (this.params.canvasWidth + 1) + i;
        this.mirrorGeometry.vertices[index].z += (gotoZ - this.mirrorGeometry.vertices[index].z) / 5;
        
      }
    }
    this.mirrorGeometry.verticesNeedUpdate = true;
  };
  
  App.prototype.getVideoColor = function(x, y) {
    
    var base = (Math.floor(y) * (this.params.canvasWidth + 1) + Math.floor(x)) * 4;
    var c = {
      r: this.pixels[base + 0],
      g: this.pixels[base + 1],
      b: this.pixels[base + 2],
      a: this.pixels[base + 3]
    };
    return (c.r << 16) + (c.g << 8) + c.b;
    
  };
  
  App.prototype.getVideoBrightness = function(c) {
    return (0.34 * c.r + 0.5 * c.g + 0.16 * c.b);
  };
  
  App.prototype.listeners = function() {
    document.addEventListener('mousemove', _.bind(this.onMouseMove, this), false);
    window.addEventListener('resize', _.bind(this.onResize, this), false);
  };
  
  App.prototype.onResize = function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.params.windowHalfX = window.innerWidth / 2;
    this.params.windowHalfY = window.innerHeight / 2;
  }
  
  App.prototype.onMouseMove = function() {
    this.params.mouseX = (event.clientX - this.params.windowHalfX) / (this.params.windowHalfX);
    this.params.mouseY = (event.clientY - this.params.windowHalfY) / (this.params.windowHalfY);
  };
  
  return App;
  
});