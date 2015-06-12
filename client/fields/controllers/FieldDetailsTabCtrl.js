 angular.module('app.example').controller('FieldDetailsTabCtrl', ['$scope', '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
     function($scope, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
         $scope.field = $meteor.object(Fields, $stateParams.fieldId);

         /**
          * Takes one or more features and calculates the centroid using the arithmetic mean of all vertices.
          * This lessens the effect of small islands and artifacts when calculating
          * the centroid of a set of polygons.
          *
          * @module turf/centroid
          * @category measurement
          * @param {(Feature|FeatureCollection)} features input features
          * @return {Feature<Point>} the centroid of the input features
          * @example
          * var poly = {
          *   "type": "Feature",
          *   "properties": {},
          *   "geometry": {
          *     "type": "Polygon",
          *     "coordinates": [[
          *       [105.818939,21.004714],
          *       [105.818939,21.061754],
          *       [105.890007,21.061754],
          *       [105.890007,21.004714],
          *       [105.818939,21.004714]
          *     ]]
          *   }
          * };
          *
          * var centroidPt = turf.centroid(poly);
          *
          * var result = {
          *   "type": "FeatureCollection",
          *   "features": [poly, centroidPt]
          * };
          *
          * //=result
          */
         var calculateCentroid = function(features) {
             var xSum = 0,
                 ySum = 0,
                 len = 0;
             /**
              * Lazily iterate over coordinates in any GeoJSON object, similar to
              * Array.forEach.
              *
              * @param {Object} layer any GeoJSON object
              * @param {Function} callback a method that takes (value)
              * @param {boolean=} excludeWrapCoord whether or not to include
              * the final coordinate of LinearRings that wraps the ring in its iteration.
              * @example
              * var point = { type: 'Point', coordinates: [0, 0] };
              * coordEach(point, function(coords) {
              *   // coords is equal to [0, 0]
              * });
              */
             var coordEach = function(layer, callback, excludeWrapCoord) {
                 var i, j, k, g, l, geometry, stopG, coords,
                     geometryMaybeCollection,
                     wrapShrink = 0,
                     isGeometryCollection,
                     isFeatureCollection = layer.type === 'FeatureCollection',
                     isFeature = layer.type === 'Feature',
                     stop = isFeatureCollection ? layer.features.length : 1;

                 // This logic may look a little weird. The reason why it is that way
                 // is because it's trying to be fast. GeoJSON supports multiple kinds
                 // of objects at its root: FeatureCollection, Features, Geometries.
                 // This function has the responsibility of handling all of them, and that
                 // means that some of the `for` loops you see below actually just don't apply
                 // to certain inputs. For instance, if you give this just a
                 // Point geometry, then both loops are short-circuited and all we do
                 // is gradually rename the input until it's called 'geometry'.
                 //
                 // This also aims to allocate as few resources as possible: just a
                 // few numbers and booleans, rather than any temporary arrays as would
                 // be required with the normalization approach.
                 for (i = 0; i < stop; i++) {

                     geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
                         (isFeature ? layer.geometry : layer));
                     isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
                     stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

                     for (g = 0; g < stopG; g++) {

                         geometry = isGeometryCollection ?
                             geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
                         coords = geometry.coordinates;

                         wrapShrink = (excludeWrapCoord &&
                                 (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
                             1 : 0;

                         if (geometry.type === 'Point') {
                             callback(coords);
                         } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
                             for (j = 0; j < coords.length; j++) callback(coords[j]);
                         } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
                             for (j = 0; j < coords.length; j++)
                                 for (k = 0; k < coords[j].length - wrapShrink; k++)
                                     callback(coords[j][k]);
                         } else if (geometry.type === 'MultiPolygon') {
                             for (j = 0; j < coords.length; j++)
                                 for (k = 0; k < coords[j].length; k++)
                                     for (l = 0; l < coords[j][k].length - wrapShrink; l++)
                                         callback(coords[j][k][l]);
                         } else {
                             throw new Error('Unknown Geometry Type');
                         }
                     }
                 }
             }
             coordEach(features, function(coord) {
                 xSum += coord[0];
                 ySum += coord[1];
                 len++;
             }, true);
             return {
                 lng: xSum / len,
                 lat: ySum / len
             };
         };
/*         
        $scope.tomorrowWeather = null;
         var weatherCallback = function(response) {
             $scope.tomorrowWeather = response.daily.data[0];
         };
         var weatherErrorback = function(err) {
             $scope.tomorrowWeather = null;
         };
         $scope.centroid = calculateCentroid($scope.field.geometry);
         $meteor.call('getWeatherForecast', $scope.centroid).then(weatherCallback, weatherErrorback);
*/

         //console.log($scope.Fields);
     }
 ]);