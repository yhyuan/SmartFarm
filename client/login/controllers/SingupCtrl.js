 angular.module('app.example').controller('SignupCtrl', ['$scope', '$state', '$meteorCollection', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
     function($scope, $state, $meteorCollection, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
         $scope.data = {};

         $scope.signup = function() {
             var signupCallback = function() {
                 $state.go('login');
             };
             var signupErrorback = function() {
                 var alertPopup = $ionicPopup.alert({
                     title: 'Failed to sign up',
                     template: 'Your fields are missing or the passwords do not match.'
                 });
                 alertPopup.then(function(res) {
                     //console.log('Thank you for not eating my delicious ice cream cone');
                 });
             };
             var username = $scope.data.username;
             var name = $scope.data.name;
             var password = $scope.data.password;
             var confirmedpassword = $scope.data.confirmedpassword;
             if (username && name && password && confirmedpassword && (username.length > 0) && (name.length > 0) && (password.length > 0) && (confirmedpassword.length > 0) && (password === confirmedpassword)) {
                 Accounts.createUser({
                     email: username,
                     password: password
                 }, function(err) {
                     if (err) {
                         signupErrorback();
                     } else {
                         signupCallback();
                     }
                 }); //
             } else {
                 signupErrorback();
             }
         }
     }
 ]);