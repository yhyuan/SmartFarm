  angular.module('app.example').config(['$urlRouterProvider', '$stateProvider',
      function($urlRouterProvider, $stateProvider) {

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
                          templateUrl: "client/fields/views/fields.ng.html",
                          controller: 'FieldsTabCtrl'
                      }
                  }
              })
              .state('tabs.fieldDetails', {
                  url: "/fields/:fieldId",
                  views: {
                      'fields-tab': {
                          templateUrl: "client/fields/views/fieldDetails.ng.html",
                          controller: 'FieldDetailsTabCtrl'
                      }
                  }
              })
              .state('tabs.addField', {
                  url: "/addField",
                  views: {
                      'fields-tab': {
                          templateUrl: "client/fields/views/addField.ng.html",
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
      }
  ]);