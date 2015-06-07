 angular.module('app.example').controller('ChangePasswordCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
		$scope.data = {};
 
	    $scope.changePassword = function() {
	        console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
	    }
      }
  ]);