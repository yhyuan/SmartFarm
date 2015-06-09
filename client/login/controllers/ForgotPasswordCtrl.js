 angular.module('app.example').controller('ForgotPasswordCtrl', ['$scope', '$state', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
     function($scope, $state, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
         $scope.data = {};
         var forgotPasswordCallback = function() {
             $state.go('login');
         };
         var forgotPasswordErrorback = function() {
             var alertPopup = $ionicPopup.alert({
                 title: 'Failed to send email',
                 template: 'Failed to send email'
             });
             alertPopup.then(function(res) {
                 //console.log('Thank you for not eating my delicious ice cream cone');
             });
         };

         $scope.forgotPassword = function() {
             Accounts.forgotPassword({
                 email: $scope.data.username
             }, function(err) {
                 if (err)
                    forgotPasswordErrorback();
                 else {
                    forgotPasswordCallback();
                 }
             });
         }
     }
 ]);