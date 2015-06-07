 angular.module('app.example').controller('ForgotPasswordCtrl', ['$scope', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
		$scope.data = {};
 
	    $scope.forgotPassword = function() {
	        console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
	    }
      }
  ]);