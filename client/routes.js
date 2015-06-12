  angular.module('app.example').config(['$urlRouterProvider', '$stateProvider',
      function($urlRouterProvider, $stateProvider) {
          var privateRoute = {
                    "currentUser": ["$meteor", function($meteor){
                      return $meteor.requireUser();
                    }]
                  };
          $urlRouterProvider.otherwise("/login");
          $stateProvider
              .state('login', {
                    url: '/login',
                    templateUrl: 'client/login/views/login.ng.html',
                    controller: 'LoginCtrl'
                })
              .state('signup', {
                    url: '/signup',
                    templateUrl: 'client/login/views/signup.ng.html',
                    controller: 'SignupCtrl'
                })
              .state('forgotpassword', {
                    url: '/forgotpassword',
                    templateUrl: 'client/login/views/forgotpassword.ng.html',
                    controller: 'ForgotPasswordCtrl'
                })
              .state('changepassword', {
                    url: '/changepassword',
                    templateUrl: 'client/login/views/changepassword.ng.html',
                    controller: 'ChangePasswordCtrl'
                })
              .state('tabs', {
                  url: "/tab",
                  abstract: true,
                  templateUrl: "client/templates/index.ng.html",
                  resolve: privateRoute
              })
              .state('tabs.fields', {
                  url: "/fields",
                  views: {
                      'fields-tab': {
                          templateUrl: "client/fields/views/fields.ng.html",
                          controller: 'FieldsTabCtrl'/*,
                          resolve: {
                            'subscribe': [
                              '$meteor', function($meteor) {
                                return $meteor.subscribe('fields');
                              }
                            ]
                          }*/
                      }
                  }
              })
              .state('fieldDetails', {
                  url: "/fields/:fieldId",
                  templateUrl: 'client/fields/views/fieldDetails.ng.html',
                  controller: 'FieldDetailsTabCtrl',
                  resolve: privateRoute
              })
              /*.state('tabs.fieldDetails', {
                  url: "/fields/:fieldId",
                  views: {
                      'fields-tab': {
                          templateUrl: "client/fields/views/fieldDetails.ng.html",
                          controller: 'FieldDetailsTabCtrl'
                      }
                  }
              })*/
              .state('addField', {
                    url: '/addField',
                    templateUrl: 'client/fields/views/addField.ng.html',
                    controller: 'AddFieldTabCtrl',
                  resolve: privateRoute
                })
              /*.state('tabs.addField', {
                  url: "/addField",
                  views: {
                      'fields-tab': {
                          templateUrl: "client/fields/views/addField.ng.html",
                          controller: 'AddFieldTabCtrl'
                      }
                  }
              })*/
              .state('editField', {
                  url: "/editField/:fieldId",
                  templateUrl: 'client/fields/views/editField.ng.html',
                  controller: 'EditFieldTabCtrl',
                  resolve: privateRoute
              })
              .state('weather', {
                  url: "/weather/:fieldId/:lat/:lng",
                  templateUrl: 'client/weather/views/weather.ng.html',
                  controller: 'WeatherCtrl',
                  resolve: privateRoute
              })
              /*.state('tabs.editField', {
                  url: "/editField/:fieldId",
                  views: {
                      'fields-tab': {
                          templateUrl: "client/fields/views/editField.ng.html",
                          controller: 'EditFieldTabCtrl'
                      }
                  }
              })*/
              /*.state('deleteField', {
                  url: "/deleteField/:fieldId",
                  templateUrl: 'client/fields/views/deleteField.ng.html',
                  controller: 'DeleteFieldTabCtrl',
                  resolve: privateRoute
              })*/
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
                          templateUrl: "client/profile/views/profile.ng.html",
                          controller: 'ProfileTabCtrl'
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
      }
  ]);

  angular.module("app.example").run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $state.go('login');
    }
  });
}]);