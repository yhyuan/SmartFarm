var createLeafletMapSettings = function($scope) {
    var drawnItems = new L.FeatureGroup();
    if ($scope.hasOwnProperty('field') && $scope.field.hasOwnProperty('geometry')) {
        var geometry = $scope.field.geometry;
        L.geoJson(geometry, {
            style: function(feature) {
                return {
                    color: '#bada55'
                };
            },
            onEachFeature: function(feature, layer) {
                drawnItems.addLayer(layer);
                $scope.savedItems.push({
                    "id": layer._leaflet_id,
                    "geoJSON": feature
                });
            }
        });
    }
    return {
        defaults: {
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
        },
        paths: {},
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

var setupLeafletMap = function($scope, map) {
    /*map.on('layeradd', function(e) {
        console.log('layeradd');
        console.log(e);
    });
    map.on('moveend', function(e) {
        console.log('moveend');
    });*/
/*
    var imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
            maxZoom: 18,
            minZoom: 5
        }),
        imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
            maxZoom: 18,
            minZoom: 5
        });
    //var normal = L.layerGroup([normalm,normala]),
    var image = L.layerGroup([imgm, imga]);
    image.addTo(map);
    */
    var drawItems = $scope.map.controls.edit.featureGroup;
    drawItems.addTo(map);
    if (drawItems.getLayers().length > 0) {
        map.fitBounds(drawItems);
    }
    
    console.log('eachLayer:');
    map.eachLayer(function (layer) {
       console.log(layer);
    });
    console.log(map.getPanes().overlayPane);
    //console.log($scope.savedItems);
    //console.log(drawItems.getLayers().length);
    map.on('draw:created', function(e) {
        var layer = e.layer;
        drawItems.addLayer(layer);
        $scope.savedItems.push({
            id: layer._leaflet_id,
            geoJSON: layer.toGeoJSON()
        });
    });

    map.on('draw:edited', function(e) {
        var layers = e.layers;
        layers.eachLayer(function(layer) {
            for (var i = 0; i < $scope.savedItems.length; i++) {
                if ($scope.savedItems[i].id == layer._leaflet_id) {
                    $scope.savedItems[i].geoJSON = layer.toGeoJSON();
                }
            }
        });
    });

    map.on('draw:deleted', function(e) {
        var layers = e.layers;
        layers.eachLayer(function(layer) {
            for (var i = 0; i < $scope.savedItems.length; i++) {
                if ($scope.savedItems[i].id == layer._leaflet_id) {
                    $scope.savedItems.splice(i, 1);
                }
            }
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
    return map;
};

var removeLayers = function(scope, map) {
    var drawItems = scope.map.controls.edit.featureGroup;
    map.removeLayer(drawItems);
    drawItems.clearLayers();
    //map.remove();
};

var isFieldSavable = function(scope, $ionicPopup) {
    var drawnItems = scope.map.controls.edit.featureGroup;
    if (drawnItems.getLayers().length === 0) {
        $ionicPopup.alert({
            title: '地块边界为空',
            template: '地块边界为空。请使用画图工具来添加地块边界。'
        });
        return false;
    }

    if (scope.isEditing) {
        $ionicPopup.alert({
            title: '地块边界编辑',
            template: '您正在编辑地块边界，请保存地块边界编辑结果后，再保存地块信息。'
        });
        return false;
    }

    if (scope.isDeleting) {
        $ionicPopup.alert({
            title: '地块边界删除',
            template: '您正在删除地块边界，请保存地块边界删除结果后，再保存地块信息。'
        });
        return false;
    }
    return true;
};
angular.module('app.example').controller('AddFieldTabCtrl', ['$scope', '$state', "leafletData", '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function($scope, $state, leafletData, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
        $scope.savedItems = [];
        $scope.map = createLeafletMapSettings($scope);
        var leafletMap;
        $scope.isEditing = false;
        $scope.isDeleting = false;
        leafletData.getMap().then(function(map) {
            leafletMap = setupLeafletMap($scope, map);
        });
        $scope.save = function() {
            if (isFieldSavable($scope, $ionicPopup)) {
                var newField = {
                    name: $scope.data.newFieldName,
                    geometry: $scope.map.controls.edit.featureGroup.toGeoJSON()
                };
                var callback = function(response) {
                    $state.transitionTo('fieldDetails', {
                        fieldId: response //res[0]._id
                    });
                };
                var errorback = function(err) {};
                $meteor.call('createField', newField).then(callback, errorback);
                removeLayers($scope, leafletMap);
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
                    title: '地块名',
                    subTitle: '请输入地块名',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>下一步</b>',
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
                    template: '<ion-radio ng-model="data.method" ng-value="\'GPS\'">GPS</ion-radio><ion-radio ng-model="data.method" ng-value="\'address\'">城镇或地址</ion-radio>',
                    title: '位置寻找',
                    subTitle: '请选择位置寻找方法',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>下一步</b>',
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
                    subTitle: '使用GPS来寻找位置',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>确认</b>',
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
                    title: 'GPS寻找位置失败',
                    subTitle: 'GPS寻找位置失败。请使用城镇或者地址来寻找位置。',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>确认</b>',
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
                    title: '城镇或地址',
                    subTitle: '使用城镇或地址来寻找位置',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>确认</b>',
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
                    title: '城镇或地址寻找位置失败',
                    subTitle: '无法根据您输入的城镇或地址寻找位置。请使用其他地址或者城镇来寻找您的位置。',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>确认</b>',
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
        $scope.savedItems = [];
        $scope.map = createLeafletMapSettings($scope);
        var leafletMap;
        $scope.isEditing = false;
        $scope.isDeleting = false;
        leafletData.getMap().then(function(map) {
            leafletMap = setupLeafletMap($scope, map);
        });
        $scope.save = function() {
            if (isFieldSavable($scope, $ionicPopup)) {
                //$scope.field.geometry = $scope.map.controls.edit.featureGroup.toGeoJSON();
                //$scope.field.save();
                var field = {
                    _id: $scope.field._id,
                    owner: $scope.field.owner,
                    name: $scope.field.name,
                    geometry: $scope.map.controls.edit.featureGroup.toGeoJSON()
                };
                var callback = function(response) {};
                var errorback = function(err) {};
                $meteor.call('updateField', field).then(callback, errorback);

                removeLayers($scope, leafletMap);
                $state.transitionTo('fieldDetails', {
                    fieldId: $stateParams.fieldId
                });
            }
        };

        $scope.cancel = function() {
            removeLayers($scope, leafletMap);
            $state.transitionTo('fieldDetails', {
                fieldId: $stateParams.fieldId
            });
        };

        $scope.delete = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: '删除地块',
                template: '您确认要删除该地块?',
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确认</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        removeLayers($scope, leafletMap);
                        $meteor.collection(Fields).remove($scope.field);
                        $state.transitionTo('tabs.fields');
                    }
                }]
            });
        };


        $scope.data = {
            //method: 'GPS'
        };
        var states = {
            inputFieldName: {
                popup: {
                    template: '<input ng-model="field.name">',
                    title: '地块名编辑',
                    subTitle: '请编辑地块名',
                    scope: $scope,
                    buttons: [
                        //{ text: 'Cancel' },
                        {
                            text: '<b>确认</b>',
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