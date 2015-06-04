Package.describe({
  name: 'yhyuan:leaflet-draw',
  summary: "Adds support for drawing and editing vectors and markers on Leaflet maps",
  version: "1.0.4",
  git: "https://github.com/bdunnette/meteor-leaflet-draw.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('bevanhunt:leaflet@0.3.14', 'client');
  api.addFiles([
        'lib/Leaflet.draw.js',
        'lib/Toolbar.js',
        'lib/Tooltip.js',
        'lib/ext/GeometryUtil.js',
        'lib/ext/LatLngUtil.js',
        'lib/ext/LineUtil.Intersect.js',
        'lib/ext/Polygon.Intersect.js',
        'lib/ext/Polyline.Intersect.js',
        'lib/draw/DrawToolbar.js',
        'lib/draw/handler/Draw.Feature.js',
        'lib/draw/handler/Draw.SimpleShape.js',
        'lib/draw/handler/Draw.Polyline.js',
        'lib/draw/handler/Draw.Circle.js',
        'lib/draw/handler/Draw.Marker.js',
        'lib/draw/handler/Draw.Polygon.js',
        'lib/draw/handler/Draw.Rectangle.js',
        'lib/edit/EditToolbar.js',
        'lib/edit/handler/EditToolbar.Edit.js',
        'lib/edit/handler/EditToolbar.Delete.js',
        'lib/Control.Draw.js',
        'lib/edit/handler/Edit.Poly.js',
        'lib/edit/handler/Edit.SimpleShape.js',
        'lib/edit/handler/Edit.Circle.js',
        'lib/edit/handler/Edit.Rectangle.js',
        'lib/edit/handler/Edit.Marker.js',
        'leaflet.draw.css',
        'images/spritesheet.png',
        'images/spritesheet-2x.png'
  ], 'client');
});



Package.onTest(function(api) {
  api.use('tinytest');
  api.use('yhyuan:leaflet-draw');
  api.addFiles('leaflet-draw-tests.js');
});
