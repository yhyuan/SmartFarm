 angular.module('app.example').controller('AddFieldTabCtrl', ['$scope', '$state', "leafletData", '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $state, leafletData, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
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
              lat: 37,
              lng: 117,
              zoom: 12
          };
          //console.log(leafletData);
          
          leafletData.getMap().then(function(map) {
              var drawnItems = $scope.map.controls.edit.featureGroup;              
              map.on('draw:created', function (e) {
                var layer = e.layer;
                drawnItems.addLayer(layer);
                //console.log(JSON.stringify(layer.toGeoJSON()));
                $scope.data.newFieldGeometry = layer.toGeoJSON();
              });
              map.on('draw:edited', function (e) {
                  var layers = e.layers;
                  layers.eachLayer(function (layer) {
                    $scope.data.newFieldGeometry = layer.toGeoJSON();
                      //do whatever you want, most likely save back to db
                  });
              });
              map.on('draw:deleted', function (e) {
                  var layers = e.layers;
                  layers.eachLayer(function (layer) {
                      $scope.data.newFieldGeometry = layer.toGeoJSON();
                  });
              });
           });
          $scope.save = function () {
            var newField = {
              name: $scope.data.newFieldName,
              geometry: $scope.data.newFieldGeometry
            };
            $meteor.collection(Fields).save(newField);
            $state.transitionTo('tabs.fields');
          };
          $scope.data = {
              method: 'GPS'
          };
          var states = {
              inputFieldName: {
                  popup: {
                      template: '<input ng-model="data.newFieldName">',
                      title: 'Add New Field',
                      subTitle: 'Please input the new field name',
                      scope: $scope,
                      buttons: [
                          //{ text: 'Cancel' },
                          {
                              text: '<b>Next</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                  if (!$scope.data.newFieldName) {
                                      //don't allow the user to close unless he enters wifi password
                                      e.preventDefault();
                                  } else {
                                      return $scope.data.newFieldName;
                                  }
                              }
                          }
                      ]
                  },
                  callback: function(res) {
                      transferState("findLocationMethod");
                  }
              },
              findLocationMethod: {
                  popup: {
                      template: '<ion-radio ng-model="data.method" ng-value="\'GPS\'">GPS</ion-radio><ion-radio ng-model="data.method" ng-value="\'address\'">Address</ion-radio>',
                      title: 'Find location',
                      subTitle: 'Please select location search method',
                      scope: $scope,
                      buttons: [
                          //{ text: 'Cancel' },
                          {
                              text: '<b>Next</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                  if (!$scope.data.method) {
                                      //don't allow the user to close unless he enters wifi password
                                      e.preventDefault();
                                  } else {
                                      return $scope.data.method;
                                  }
                              }
                          }
                      ]
                  },
                  callback: function(res) {
                      if (res === 'GPS') {
                          transferState("FindLocationGPS");
                      }
                      if (res === 'address') {
                          transferState("FindLocationAddress");
                      }
                  }
              },
              FindLocationGPS: {
                  popup: {
                      template: '',
                      title: 'GPS',
                      subTitle: 'Find location with GPS',
                      scope: $scope,
                      buttons: [
                          //{ text: 'Cancel' },
                          {
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {

                              }
                          }
                      ]
                  },
                  callback: function(res) {
                      var gpsCallback = function (position) {
                        $scope.map.center.lat  = position.coords.latitude;
                        $scope.map.center.lng = position.coords.longitude;
                        $scope.map.center.zoom = 15;
                      };
                      var gpsErrorback = function (err) {
                        transferState("FindLocationGPSFailed");
                      };                      
                      if (Meteor.isCordova) {
                          $cordovaGeolocation
                            .getCurrentPosition()
                            .then(gpsCallback, gpsErrorback);
                      } else {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(gpsCallback, gpsErrorback);
                        }
                      }
                  }
              },
              FindLocationGPSFailed: {
                  popup: {
                      template: '',
                      title: 'GPS Failed',
                      subTitle: 'Failed to find the location with GPS. Please try to use the address search to find your location.',
                      scope: $scope,
                      buttons: [
                          //{ text: 'Cancel' },
                          {
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {

                              }
                          }
                      ]
                  },
                  callback: function(res) {
                      transferState("findLocationMethod");
                  }
              },
              FindLocationAddress: {
                  popup: {
                      template: '<input ng-model="data.address">',
                      title: 'Address',
                      subTitle: 'Find location with address',
                      scope: $scope,
                      buttons: [
                          //{ text: 'Cancel' },
                          {
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                  if (!$scope.data.address) {
                                      //don't allow the user to close unless he enters wifi password
                                      e.preventDefault();
                                  } else {
                                      return $scope.data.address;
                                  }
                              }
                          }
                      ]
                  },
                  callback: function(res) {
                      $meteor.call('geoJsonForAddress', res, function(err, res) {
                          console.log(res);
                          // The method call sets the Session variable to the callback value  
                          if (err) {
                              //Session.set('location', {error: err});  {"results":[],"status":1,"msg":"Internal Service Error:\u65e0\u76f8\u5173\u7ed3\u679c"}
                          } else {
                              //Session.set('location', res);  {"status":0,"result":{"location":{"lng":120.66880872172,"lat":28.336390468031},"precise":0,"confidence":14,"level":"\u533a\u53bf"}}
                              return res;
                          }
                      });
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