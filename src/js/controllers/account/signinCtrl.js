
define(['../../module'], function (module) {
    module.controller('signinCtrl', ['$scope', "$route", "$http", "$window", "$rootScope", "$location", "oauthService", function ($scope, $route, $http, $window, $rootScope, $location, oauthService) {
        var currentUser = new oauthService().getCurrentUser();
        currentUser.then(function (result) {
            if (result.response.state)
                $window.location = result.response.state;
            else
                $window.location = '#/home';
        });
    }]);

});