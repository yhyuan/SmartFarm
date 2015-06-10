 angular.module('app.example').controller('SignupCtrl', ['$scope', '$state', '$ionicPopup',
     function($scope, $state, $ionicPopup) {
         $scope.data = {};

         $scope.signup = function() {
             var trimInput = function(value) {
                 return value.replace(/^\s*|\s*$/g, '');
             };

             var isNotEmpty = function(value) {
                 if (value && value !== '') {
                     return true;
                 }
                 return false;
             };

             var isEmail = function(value) {
                 var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                 if (filter.test(value)) {
                     return true;
                 }
                 return false;
             };

             var isValidPassword = function(password) {
                 if (password.length < 6) {
                     //console.log('Your password should be 6 characters or longer.');
                     return false;
                 }
                 return true;
             };

             var areValidPasswords = function(password, confirm) {
                 if (password !== confirm) {
                     //console.log('Your two passwords are not equivalent.');
                     return false;
                 }
                 return true;
             };
             var signupCallback = function() {
                 $state.go('login');
             };
             var signupErrorback = function(msg) {
                 var alertPopup = $ionicPopup.alert({
                     title: '注册失败',
                     template: msg
                 });
                 alertPopup.then(function(res) {
                     //console.log('Thank you for not eating my delicious ice cream cone');
                 });
             };
             var username = $scope.data.username;
             var name = $scope.data.name;
             var password = $scope.data.password;
             var confirmedpassword = $scope.data.confirmedpassword;
             if (isNotEmpty(username) && isNotEmpty(name) && isNotEmpty(password) && isNotEmpty(confirmedpassword)) {
                 username = trimInput(username);
                 name = trimInput(name);
                 password = trimInput(password);
                 confirmedpassword = trimInput(confirmedpassword);
                 if (isEmail(username)) {
                     if (isValidPassword(password) && isValidPassword(confirmedpassword)) {
                         if (areValidPasswords(password, confirmedpassword)) {
                             Accounts.createUser({
                                 email: username,
                                 password: password
                             }, function(err) {
                                 if (err) {
                                     signupErrorback(err);
                                 } else {
                                     signupCallback();
                                 }
                             });
                         } else {
                             signupErrorback('密码和确认密码不一致');
                         }
                     } else {
                         signupErrorback("密码必须至少六个字符长");
                     }
                 } else {
                     signupErrorback("电子邮件错误");
                 }
             } else {
                 signupErrorback("有字段为空");
             }
         }
     }
 ]);