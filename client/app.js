  var app = angular.module('app.example', [
    'angular-meteor',
    'ui.router',
    'ionic',
    'leaflet-directive',
    'ngCordova.plugins.datePicker']);

  function onReady() {
    angular.bootstrap(document, ['app.example']);
  }

  if (Meteor.isCordova) {
    angular.element(document).on("deviceready", onReady);
  }
  else {
    angular.element(document).ready(onReady);
  }
  Meteor.subscribe('Fields');
/*
  app.config(['$urlRouterProvider', '$stateProvider',
    function($urlRouterProvider, $stateProvider){

    $urlRouterProvider.otherwise("/tabs");

    $stateProvider
      .state('tabs', {
        url : '/tabs',
        templateUrl: 'index.ng.html',
        controller: 'TodoCtrl'
      });
  }]);


  // subscribe to the two collections we use
  Meteor.subscribe('Projects');
  Meteor.subscribe('Tasks');

  app.controller('TodoCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function ($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {

      $scope.Projects = $meteorCollection(Projects);
      $scope.Tasks = $meteorCollection(Tasks);

      // A utility function for creating a new project
      // with the given projectTitle
      var createProject = function (projectTitle) {
        var newProject = {
          title: projectTitle,
          active: false
        };
        $scope.Projects.save(newProject).then(function(res) {
          if (res) {
            $scope.selectProject(newProject, $scope.Projects.length - 1);
          }
        });
      };

      // Called to create a new project
      $scope.newProject = function () {
        $ionicPopup.prompt({
          title: 'New Project',
          subTitle: 'Name:'
        }).then(function(res) {
          if (res) {
            createProject(res);
          }
        });
      };

      // Grab the last active, or the first project
      $scope.activeProject = function () {
        var activeProject = $scope.Projects[0];
        angular.forEach($scope.Projects, function (v, k) {
          if (v.active) {
            activeProject = v;
          }
        });
        return activeProject;
      };

      // Called to select the given project
      $scope.selectProject = function (project, index) {
        var selectedProject = $scope.Projects[index];
        angular.forEach($scope.Projects, function (v, k) {
          v.active = false;
        });
        selectedProject.active = true;
        $ionicSideMenuDelegate.toggleLeft();
      };

      // Create our modal
      $ionicModal.fromTemplateUrl('new-task.ng.html', function (modal) {
        $scope.taskModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      //Cleanup the modal when we are done with it!
      $scope.$on('$destroy', function() {
        $scope.taskModal.remove();
      });

      $scope.createTask = function (task) {
        var activeProject = $scope.activeProject();
        if (!activeProject || !task.title) {
          return;
        }

        $scope.Tasks.save({
          project: activeProject._id,
          title: task.title
        });

        $scope.taskModal.hide();

        task.title = "";
      };

      $scope.deleteTask = function (task) {
        $scope.Tasks.delete(task);
      };

      $scope.newTask = function () {
        $scope.task = {};
        $scope.taskModal.show();
      };

      $scope.closeNewTask = function () {
        $scope.taskModal.hide();
      };

      $scope.toggleProjects = function () {
        $ionicSideMenuDelegate.toggleLeft();
      };

      $scope.pickDate = function(task) {
        var options = {date: new Date(), mode: 'date'};
        //var options = {date: new Date(), mode: 'time'}; for time
        $cordovaDatePicker.show(options).then(function(date){
          task.date = date;
        });
      }
    }
  ]);
*/

  app.config(['$urlRouterProvider', '$stateProvider',
    function($urlRouterProvider, $stateProvider){

    $urlRouterProvider.otherwise("/tab/fields");
    $stateProvider
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "client/templates/index.ng.html"
      })
      .state('tabs.fields', {
        url: "/fields",
        views: {
          'fields-tab': {
            templateUrl: "client/templates/fields.ng.html",
            controller: 'FieldsTabCtrl'
          }
        }
      })
      .state('tabs.fieldDetails', {
        url: "/fields/:fieldId",
        views: {
          'fields-tab': {
            templateUrl: "client/templates/fieldDetails.ng.html",
            controller: 'FieldDetailsTabCtrl'
          }
        }
      })
      .state('tabs.addField', {
        url: "/addField",
        views: {
          'fields-tab': {
            templateUrl: "client/templates/addField.ng.html",
            controller: 'AddFieldTabCtrl'
          }
        }
      })
      .state('tabs.insurance', {
        url: "/insurance",
        views: {
          'insurance-tab': {
            templateUrl: "client/templates/insurance.ng.html"
          }
        }
      })
      .state('tabs.profile', {
        url: "/profile",
        views: {
          'profile-tab': {
            templateUrl: "client/templates/profile.ng.html"
          }
        }
      });


/*
    $stateProvider
      .state('tabs', {
        url : '/tabs',
        templateUrl: 'index.ng.html',
        controller: 'TodoCtrl'
      });*/
  }]);

/*
app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
        }
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

})
*/
/*
app.controller('FieldTabCtrl', function($scope) {
  console.log('FieldTabCtrl');
});*/

  app.controller('FieldsTabCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function ($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {

      $scope.Fields = $meteorCollection(Fields);
      //console.log($scope.Fields);
   }
  ]);

  app.controller('FieldDetailsTabCtrl', ['$scope', '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function ($scope, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
      $scope.field = $meteor.object(Fields, $stateParams.fieldId);
      //console.log($scope.Fields);
   }
  ]);

 app.controller('AddFieldTabCtrl', ['$scope', '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function ($scope, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
      $scope.map = {
          defaults: {
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          layers: {
                    baselayers: {
                        TianDiTuSatelliteMap: {
                            name: 'TianDiTu.Satellite.Map',
                            url: 'http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
                            type: 'xyz',
                            layerOptions: {
                                subdomains:['0','1','2','3','4','5','6','7'],
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
                              subdomains:['0','1','2','3','4','5','6','7'],
                              maxZoom: 18,
                              minZoom: 5
                          }
                      }
                    }
                },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };
      $scope.map.center  = {
          lat : 37,
          lng : 117,
          zoom : 12
      };
/*      
        $ionicPopup.prompt({
          title: 'Add New Field',
          subTitle: 'Please input the Field Name:'
        }).then(function(res) {
          if (res) {
            var instructionsPopup = $ionicPopup.alert({
                  title: 'Add New Field',
                  template: 'To add a new location, tap and hold on the map'
                });
          }
        });
*/
$scope.data = {method: 'GPS'};
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
      /*
      $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            //console.log("Location error!");
            //console.log(err);
            transferState("FindLocationGPSFailed");
          });*/
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
      
    }
  }
};
var transferState = function(stateName) {
  var state = states[stateName];
  $ionicPopup.show(state.popup).then(state.callback);
};
transferState("inputFieldName");


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

  