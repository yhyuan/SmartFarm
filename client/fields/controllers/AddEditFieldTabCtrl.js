var drawToolsInitialization = function() {
    L.drawLocal.draw.toolbar.buttons.polygon = 'Draw field boundary';
    L.drawLocal.edit.toolbar.buttons.edit = 'Edit field boundary';
    L.drawLocal.edit.toolbar.buttons.editDisabled = 'No fields to edit';
    L.drawLocal.edit.toolbar.buttons.remove = 'Delete fields';
    L.drawLocal.edit.toolbar.buttons.removeDisabled = 'No fields to delete';
};

var createLeafletMapSettings = function(geometry) {
    var drawnItems = new L.FeatureGroup();
    if (geometry) {
        L.geoJson(geometry, {
            style: function(feature) {
                return {
                    color: '#bada55'
                };
            },
            onEachFeature: function(feature, layer) {
                drawnItems.addLayer(layer);
            }
        });
    }
    return {
        defaults: {
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
        },
        center: {
            lat: 37,
            lng: 117,
            zoom: 12
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
                featureGroup: drawnItems
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
};

var setupLeafletMap = function(scope, map) {
    var drawItems = scope.map.controls.edit.featureGroup;
    drawItems.addTo(map);
    if (drawItems.getLayers().length > 0) {
        
        map.fitBounds(drawItems);
    }
    map.on('draw:created', function(e) {
        var layer = e.layer;
        scope.map.controls.edit.featureGroup.addLayer(layer);
    });
    map.on('draw:editstart', function(e) {
        scope.isEditing = true;
    });
    map.on('draw:editstop', function(e) {
        scope.isEditing = false;
    });
    map.on('draw:deletestart', function(e) {
        scope.isDeleting = true;
    });
    map.on('draw:deletestop', function(e) {
        scope.isDeleting = false;
    });
    return map;
};

var removeLayers = function(scope, map) {
    scope.map.controls.edit.featureGroup.eachLayer(function(layer) {
        map.removeLayer(layer)
    });
};

var isFieldSavable = function(scope) {
    var drawnItems = scope.map.controls.edit.featureGroup;
    if (drawnItems.getLayers().length === 0) {
        $ionicPopup.alert({
            title: 'Field Boundary is Empty',
            template: 'Field Boundary is Empty. Please use the draw tool to create field boundary.'
        });
        return false;
    }

    if (scope.isEditing) {
        $ionicPopup.alert({
            title: 'Editing field boundary',
            template: 'You are editing field boundary now. Please save your editing firstly.'
        });
        return false;
    }

    if (scope.isDeleting) {
        $ionicPopup.alert({
            title: 'Deleting field boundary',
            template: 'You are deleting field now. Please save your field boundary firstly.'
        });
        return false;
    }
    return true;
};
angular.module('app.example').controller('AddFieldTabCtrl', ['$scope', '$state', "leafletData", '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function($scope, $state, leafletData, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
        drawToolsInitialization();
        $scope.map = createLeafletMapSettings();
        var leafletMap;
        $scope.isEditing = false;
        $scope.isDeleting = false;
        leafletData.getMap().then(function(map) {
            leafletMap = setupLeafletMap($scope, map);
        });
        $scope.save = function() {
            if (isFieldSavable($scope)) {
                var newField = {
                    name: $scope.data.newFieldName,
                    geometry: $scope.map.controls.edit.featureGroup.toGeoJSON()
                };
                $meteor.collection(Fields).save(newField).then(function(res) {
                    removeLayers($scope, leafletMap);
                    $state.transitionTo('tabs.fieldDetails', {
                        fieldId: res[0]._id
                    });
                });
            }
        };
        $scope.cancel = function() {
            removeLayers($scope, leafletMap);
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
                    var gpsCallback = function(position) {
                        $scope.map.center.lat = position.coords.latitude;
                        $scope.map.center.lng = position.coords.longitude;
                        $scope.map.center.zoom = 15;
                    };
                    var gpsErrorback = function(err) {
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
                callback: function(address) {
                    var geocodingCallback = function(response) {
                        var latlng = response.result.location;
                        $scope.map.center.lat = latlng.lat;
                        $scope.map.center.lng = latlng.lng;
                        $scope.map.center.zoom = 15;
                    };
                    var geocodingErrorback = function(err) {
                        //transferState("FindLocationAddressFailed");
                    };
                    $meteor.call('geoJsonForAddress', address).then(geocodingCallback, geocodingErrorback);
                }
            },
            FindLocationAddressFailed: {
                popup: {
                    template: '',
                    title: 'Finding Location Failed',
                    subTitle: 'Failed to find the location with address. Please try with another address to find your location.',
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
        };
        var transferState = function(stateName) {
            var state = states[stateName];
            $ionicPopup.show(state.popup).then(state.callback);
        };
        transferState("inputFieldName");
    }
]);

angular.module('app.example').controller('EditFieldTabCtrl', ['$scope', '$state', "leafletData", '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function($scope, $state, leafletData, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
        $scope.field = $meteor.object(Fields, $stateParams.fieldId, false);
        drawToolsInitialization();
        $scope.map = createLeafletMapSettings($scope.field.geometry);
        var leafletMap;
        $scope.isEditing = false;
        $scope.isDeleting = false;
        leafletData.getMap().then(function(map) {
            leafletMap = setupLeafletMap($scope, map);
        });
        $scope.save = function() {
            if (isFieldSavable($scope)) {
                $scope.field.geometry = $scope.map.controls.edit.featureGroup.toGeoJSON();
                $scope.field.save();
                removeLayers($scope, leafletMap);
                $state.transitionTo('tabs.fieldDetails', {
                    fieldId: $stateParams.fieldId
                });
            }
        };

        $scope.cancel = function() {
            removeLayers($scope, leafletMap);
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
                    removeLayers($scope, leafletMap);
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
    }
]);
