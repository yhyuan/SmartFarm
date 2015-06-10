 angular.module('app.example').controller('FieldsTabCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {

          $scope.fields = $meteorCollection(Fields);
          $scope.calculateArea = function(_) {
              var geometryArea = function (_) {
                  var polygonArea = function(coords) {
                      /**
                       * Calculate the approximate area of the polygon were it projected onto
                       *     the earth.  Note that this area will be positive if ring is oriented
                       *     clockwise, otherwise it will be negative.
                       *
                       * Reference:
                       * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
                       *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
                       *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
                       *
                       * Returns:
                       * {float} The approximate signed geodesic area of the polygon in square
                       *     meters.
                       */

                      function ringArea(coords) {
                          var rad = function (_) {
                              return _ * Math.PI / 180;
                          }          
                          var wgs84 = {RADIUS: 6378137};
                          var area = 0;

                          if (coords.length > 2) {
                              var p1, p2;
                              for (var i = 0; i < coords.length - 1; i++) {
                                  p1 = coords[i];
                                  p2 = coords[i + 1];
                                  area += rad(p2[0] - p1[0]) * (2 + Math.sin(rad(p1[1])) + Math.sin(rad(p2[1])));
                              }

                              area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
                          }

                          return area;
                      }                  
                      var area = 0;
                      if (coords && coords.length > 0) {
                          area += Math.abs(ringArea(coords[0]));
                          for (var i = 1; i < coords.length; i++) {
                              area -= Math.abs(ringArea(coords[i]));
                          }
                      }
                      return area;
                  }

                  var area = 0, i;
                  switch (_.type) {
                      case 'Polygon':
                          return polygonArea(_.coordinates);
                      case 'MultiPolygon':
                          for (i = 0; i < _.coordinates.length; i++) {
                              area += polygonArea(_.coordinates[i]);
                          }
                          return area;
                      case 'Point':
                      case 'MultiPoint':
                      case 'LineString':
                      case 'MultiLineString':
                          return 0;
                      case 'GeometryCollection':
                          for (i = 0; i < _.geometries.length; i++) {
                              area += geometry(_.geometries[i]);
                          }
                          return area;
                  }
              };
              if (_.type === 'FeatureCollection') {
                  for (var i = 0, sum = 0; i < _.features.length; i++) {
                      if (_.features[i].geometry) {
                          sum += geometryArea(_.features[i].geometry);
                      }
                  }
                  return sum;
              } else if (_.type === 'Feature') {
                  return geometryArea(_.geometry);
              } else {
                  return geometryArea(_);
              }
          };          

          //var area = calculateArea($scope.field.geometry);

          //console.log($scope.Fields);
      }
  ]);