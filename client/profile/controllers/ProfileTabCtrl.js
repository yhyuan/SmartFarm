angular.module('app.example').controller('ProfileTabCtrl', ['$scope', '$meteor', '$state', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $meteor, $state, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
        $scope.logout = function () {
          var logoutCallback = function () {
            $state.go('login');
          };
          var logoutErrorback = function () {
            console.log('These credentials are not valid.');
            //$state.go('tabs.fields');
          };
          $meteor.logout().then(logoutCallback, logoutErrorback);          
        };
      }
  ]);