 angular.module('app.example').controller('LoginCtrl', ['$scope', '$state', '$meteor', '$ionicPopup',
     function($scope, $state, $meteor, $ionicPopup) {
         $scope.data = {};

         $scope.login = function() {
             var loginCallback = function() {
                 $state.go('tabs.fields');
             };
             var loginErrorback = function() {
                 var alertPopup = $ionicPopup.alert({
                     title: '登陆失败',
                     template: '电子邮件或者密码错误，请重试。'
                 });
                 alertPopup.then(function(res) {
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