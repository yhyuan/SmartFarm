 angular.module('app.example').controller('FieldDetailsTabCtrl', ['$scope', '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
     function($scope, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
         $scope.field = $meteor.object(Fields, $stateParams.fieldId);
         var coor = $scope.field.geometry.features[0].geometry.coordinates[0][0];
         
        $scope.tomorrowWeather = null;
         var weatherCallback = function(response) {
            
             $scope.tomorrowWeather = response.daily.data[0];
              console.log($scope.tomorrowWeather);
         };
         var weatherErrorback = function(err) {
             $scope.tomorrowWeather = null;
         };
         //$scope.centroid = calculateCentroid($scope.field.geometry);
         $meteor.call('getWeatherForecast', {lat: coor[1], lng: coor[0]}).then(weatherCallback, weatherErrorback);


         //console.log($scope.Fields);
     }
 ]);