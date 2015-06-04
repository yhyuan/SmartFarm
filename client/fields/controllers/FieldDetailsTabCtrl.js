 angular.module('app.example').controller('FieldDetailsTabCtrl', ['$scope', '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
          $scope.field = $meteor.object(Fields, $stateParams.fieldId);
          //console.log($scope.Fields);
      }
  ]);