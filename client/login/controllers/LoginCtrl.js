 angular.module('app.example').controller('LoginCtrl', ['$scope', '$state', '$meteor', '$ionicPopup',
     function($scope, $state, $meteor, $ionicPopup) {
         $scope.data = {};

         $scope.login = function() {
             var loginCallback = function() {
                 $state.go('tabs.fields');
             };
             var loginErrorback = function() {
                 var alertPopup = $ionicPopup.alert({
                     title: 'Wrong user name or password',
                     template: 'Your user name or password is wrong.'
                 });
                 alertPopup.then(function(res) {
                     //console.log('Thank you for not eating my delicious ice cream cone');
                 });
             };
             var username = $scope.data.username;
             var password = $scope.data.password;
             if (username && password && (username.length > 0) && (password.length > 0)) {
                 $meteor.loginWithPassword($scope.data.username, $scope.data.password).then(loginCallback, loginErrorback);
             } else {
                 loginErrorback();
             }
         }
     }
 ]);