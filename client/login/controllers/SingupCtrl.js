 angular.module('app.example').controller('SignupCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
    $scope.data = {};
 
      $scope.signup = function() {
          console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
      }
      }
  ]);