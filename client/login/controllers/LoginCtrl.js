 angular.module('app.example').controller('LoginCtrl', ['$scope', '$state', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
      function($scope, $state, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
		$scope.data = {};
 
	    $scope.login = function() {
	        //console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
	        $state.go('tabs.fields');
	    }
  }
  ]);