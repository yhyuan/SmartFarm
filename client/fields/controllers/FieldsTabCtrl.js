 angular.module('app.example').controller('FieldsTabCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {

          $scope.Fields = $meteorCollection(Fields);
          //console.log($scope.Fields);
      }
  ]);