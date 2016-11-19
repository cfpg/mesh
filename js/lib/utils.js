define([
  'underscore'
], function(
  _
) {
  
  var Utils = {
    
    getVideoColor: function(x, y, params, pixels) {
      
      var base = (Math.floor(y) * (params.canvasWidth + 1) + Math.floor(x)) * 4;
      var c = {
        r: pixels[base + 0],
        g: pixels[base + 1],
        b: pixels[base + 2],
        a: pixels[base + 3]
      };
      
      return (c.r << 16) + (c.g << 8) + c.b;
      
    },
    
    getVideoBrightness: function(c) {
      return (0.34 * c.r + 0.5 * c.g + 0.16 * c.b);
    }
    
  };
  
  return Utils;
  
});