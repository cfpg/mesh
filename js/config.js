requirejs.config({
  baseUrl: '',
  paths: {
    app: 'js',
    three: 'node_modules/three.js/node_modules/three/three',
    tween: 'node_modules/tween.js/src/Tween',
    underscore: 'node_modules/underscore/underscore-min',
  }
});

requirejs(['three', 'js/app'],
function   (THREE, App) {
  
  var app = new App();
  
});