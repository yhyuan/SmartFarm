 angular.module('app.example').controller('EditFieldTabCtrl', ['$scope', '$state', "leafletData", '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
     function($scope, $state, leafletData, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
         $scope.field = $meteor.object(Fields, $stateParams.fieldId, false);
         $scope.isEditing = false;
         $scope.isDeleting = false;
         var coors = $scope.field.geometry.geometry.coordinates[0];
         var centroid = _.map([0, 1], function(i) {
             return _.reduce(coors, function(total, coor) {
                 return total + coor[i];
             }, 0) / coors.length;
         });
         //console.log($scope.field);
         var editableLayers = new L.FeatureGroup();
         var fieldGeometry = L.geoJson($scope.field.geometry, {
             style: function(feature) {
                 return {
                     color: '#bada55'
                 };
             },
             onEachFeature: function(feature, layer) {
                 editableLayers.addLayer(layer);
             }
         });

         L.drawLocal.draw.toolbar.buttons.polygon = 'Draw field boundary';
         L.drawLocal.edit.toolbar.buttons.edit = 'Edit field boundary';
         L.drawLocal.edit.toolbar.buttons.editDisabled = 'No fields to edit';
         L.drawLocal.edit.toolbar.buttons.remove = 'Delete fields';
         L.drawLocal.edit.toolbar.buttons.removeDisabled = 'No fields to delete';
         $scope.map = {
             defaults: {
                 maxZoom: 18,
                 zoomControlPosition: 'bottomleft'
             },
             controls: {
                 draw: {
                     position: 'topright',
                     polygon: {
                         allowIntersection: false,
                         showArea: true,
                         drawError: {
                             color: '#b00b00',
                             timeout: 1000
                         },
                         shapeOptions: {
                             color: '#bada55'
                         }
                     },
                     polyline: false,
                     rectangle: false,
                     circle: false,
                     marker: false
                 },
                 edit: {
                     featureGroup: editableLayers
                 }
             },
             layers: {
                 baselayers: {
                     TianDiTuSatelliteMap: {
                         name: 'TianDiTu.Satellite.Map',
                         url: 'http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
                         type: 'xyz',
                         layerOptions: {
                             subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                             maxZoom: 18,
                             minZoom: 5
                         }
                     }
                 },
                 overlays: {
                     TianDiTuSatelliteAnnotion: {
                         name: 'TianDiTu.Satellite.Annotion',
                         url: 'http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}',
                         type: 'xyz',
                         visible: true,
                         layerOptions: {
                             subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                             maxZoom: 18,
                             minZoom: 5
                         }
                     }
                 }
             },
             markers: {},
             events: {
                 map: {
                     enable: ['context'],
                     logic: 'emit'
                 }
             }
         };
         $scope.map.center = {
             lat: centroid[1],
             lng: centroid[0],
             zoom: 12
         };
         //console.log(leafletData);

         leafletData.getMap().then(function(map) {
             /*
               var allcoors = _.reduce($scope.field.geometry.geometry.coordinates, function(total, coors){ return total.concat(coors);}, []);
               console.log(allcoors);
               map.fitBounds(coors);
               */
             //var drawnItems = $scope.map.controls.edit.featureGroup;
             /*
             L.geoJson(geojson, {
               onEachFeature: function (feature, layer) {
                 featureGroup.addLayer(layer);
               }
             });
             */
             //map.addLayer(polygon);
             //fieldGeometry.addTo(map);
             //drawnItems.addTo(map);
             //console.log('editableLayers.addTo(map);');
             editableLayers.addTo(map);
             leafletMap = map;
             /*
             map.eachLayer(function (layer) {
                    console.log(layer);
             });             */
             map.on('draw:created', function(e) {
                 var layer = e.layer;
                 drawnItems.addLayer(layer);
                 $scope.field.geometry = layer.toGeoJSON();
             });
             map.on('draw:edited', function(e) {
                 var layers = e.layers;
                 layers.eachLayer(function(layer) {
                     $scope.field.geometry = layer.toGeoJSON();
                 });
             });
             map.on('draw:deleted', function(e) {
                 var layers = e.layers;
                 layers.eachLayer(function(layer) {
                     $scope.field.geometry = null;
                 });
             });
             map.on('draw:editstart', function(e) {
                 $scope.isEditing = true;
             });
             map.on('draw:editstop', function(e) {
                 $scope.isEditing = false;
             });
             map.on('draw:deletestart', function(e) {
                 $scope.isDeleting = true;
             });
             map.on('draw:deletestop', function(e) {
                 $scope.isDeleting = false;
             });

         });
         //console.log('outside editableLayers.addTo(map);');
         var leafletMap;
         var removeLayers = function() {
            editableLayers.eachLayer(function (layer) {
                leafletMap.removeLayer(layer)
            });
         };
         $scope.save = function() {
             if (!$scope.field.geometry) {
                 $ionicPopup.alert({
                     title: 'Field Boundary is Empty',
                     template: 'Field Boundary is Empty. Please use the draw tool to create field boundary.'
                 });
                 return;
             }

             if ($scope.isEditing) {
                 $ionicPopup.alert({
                     title: 'Editing field boundary',
                     template: 'You are editing field boundary now. Please save your editing firstly.'
                 });
                 return;
             }

             if ($scope.isDeleting) {
                 $ionicPopup.alert({
                     title: 'Deleting field boundary',
                     template: 'You are deleting field now. Please save your field boundary firstly.'
                 });
                 return;
             }

             $scope.field.save();
             removeLayers();
             $state.transitionTo('tabs.fieldDetails', {
                 fieldId: $stateParams.fieldId
             });
         };
         $scope.cancel = function() {
             removeLayers();
             $state.transitionTo('tabs.fieldDetails', {
                 fieldId: $stateParams.fieldId
             });
         };
         $scope.delete = function() {
             var confirmPopup = $ionicPopup.confirm({
                 title: 'Delete Field',
                 template: 'Are you sure you want to delete this field?'
             });
             confirmPopup.then(function(res) {
                 if (res) {
                     $meteor.collection(Fields).remove($scope.field);
                     removeLayers();
                     $state.transitionTo('tabs.fields');
                 } else {
                     //console.log('You are not sure');
                 }
             });

         };


         $scope.data = {
             //method: 'GPS'
         };
         var states = {
             inputFieldName: {
                 popup: {
                     template: '<input ng-model="field.name">',
                     title: 'Edit Field Name',
                     subTitle: 'Please edit the field name',
                     scope: $scope,
                     buttons: [
                         //{ text: 'Cancel' },
                         {
                             text: '<b>Done</b>',
                             type: 'button-positive',
                             onTap: function(e) {
                                 if (!$scope.field.name) {
                                     //don't allow the user to close unless he enters wifi password
                                     e.preventDefault();
                                 } else {
                                     return $scope.field.name;
                                 }
                             }
                         }
                     ]
                 },
                 callback: function(res) {

                 }
             }
         };
         var transferState = function(stateName) {
             var state = states[stateName];
             $ionicPopup.show(state.popup).then(state.callback);
         };
         transferState("inputFieldName");
         /*                              $scope.map.markers.now = {
                                         lat:position.coords.latitude,
                                         lng:position.coords.longitude,
                                         message: "You Are Here",
                                         focus: true,
                                         draggable: false
                                       };
         */


         /*
         var instructionsPopup = $ionicPopup.alert({
               title: 'Add Locations',
               template: 'To add a new location, tap and hold on the map'
             });
         instructionsPopup.then(function(res) {
           //InstructionsService.instructions.newLocations.seen = true;
           console.log(res);
         });
         */
     }
 ]);