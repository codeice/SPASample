define(['../../module'], function (module) {
    module.controller("accountCtrl", ['$scope', '$rootScope', 'oauthService', function ($scope, $rootScope, oauthService) {
        var oauth = new oauthService();
        $rootScope.currentUser = angular.fromJson(sessionStorage.getItem('user_info'));
        $scope.logout = function () {
            oauth.logout();
        }
    }]);
});