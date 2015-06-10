angular.module('app.example').controller('DeleteFieldTabCtrl', ['$scope', '$state', "leafletData", '$stateParams', '$meteor', '$ionicModal', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$cordovaDatePicker',
    function($scope, $state, leafletData, $stateParams, $meteor, $ionicModal, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $cordovaDatePicker) {
        $scope.field = $meteor.object(Fields, $stateParams.fieldId, false);

        $scope.delete = function() {
            /*
            var confirmPopup = $ionicPopup.confirm({
                title: '删除地块',
                template: '您确认要删除该地块?',
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确认</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        removeLayers($scope, leafletMap);
                        $meteor.collection(Fields).remove($scope.field);
                        $state.transitionTo('tabs.fields');
                    }
                }]
            });*/
            //confirmPopup.then(function(res) {            });

        };


    }
]);