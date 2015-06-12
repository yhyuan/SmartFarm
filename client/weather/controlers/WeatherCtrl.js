 angular.module('app.example').controller('WeatherCtrl', ['$scope', '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
     function($scope, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
         var lat = $stateParams.lat;
         var lng = $stateParams.lng;
         $scope.fieldId = $stateParams.fieldId;
         var weatherCallback = function(response) {
             //$scope.tomorrowWeather = response.daily.data[0];
         };
         var weatherErrorback = function(err) {
             //$scope.tomorrowWeather = null;
         };
         var centroid = {lat: lat, lng: lng};
         $meteor.call('getWeatherForecast', centroid).then(weatherCallback, weatherErrorback);
 
     }
 ]);