requirejs.config({
  baseUrl: '',
  paths: {
    app: 'js',
    three: 'node_modules/three.js/node_modules/three/three',
    underscore: 'node_modules/underscore/underscore-min',
  }
});

requirejs(['three', 'js/app'],
function   (THREE, App) {
  
  var app = new App();
  
});