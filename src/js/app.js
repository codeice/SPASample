define(['ace', 'js/loadScripts'], function () {
    var app = angular.module('app', ['ngRoute', 'jcs.angular-http-batch', 'app.controllers']);

    var apiServer = location.protocol + "//" + location.host + '/PS.Api/';
    var apiBatchServer = location.protocol + "//" + location.host + '/PS.Api/batch/';
    var baseUrl = location.protocol + "//" + location.host + '/SPASample/';
    var oauthBaseUri = location.protocol + "//" + location.host + "/WSIdentityServer/core";
    /*   var oauthBaseUri = "https://172.16.193.135/core";*/

    //oauthConfig
    app.constant('oauthConfig', {
        authorizeEndpoint: oauthBaseUri + "/connect/authorize",
        logoutEndpoint: oauthBaseUri + "/connect/endsession",
        jwksUri: oauthBaseUri + "/.well-known/jwks",
        userInfoUri: oauthBaseUri + "/connect/userinfo",
        //oauth Client
        clientId: 'FA0DBB67-5315-41CF-BD7D-3AD3BF22E37F',
        redirectUri: baseUrl
    });

    //app config
    app.constant('appConfig', {
        apiServer: apiServer,
        baseUrl: baseUrl
    });

    app.config([
        'httpBatchConfigProvider', function (httpBatchConfigProvider) {
            //register an endpoint that can accept a HTTP 1.1 batch request.
            httpBatchConfigProvider.setAllowedBatchEndpoint(
                apiServer,
                apiBatchServer,
                {
                    maxBatchedRequestPerCall: 20,
                    minimumBatchSize: 2 //The smallest number of individual calls allowed in a batch request
                });
            console.log("app.config");
        }
    ]);

    app.run([
        'httpBatcher', '$rootScope', 'oauthConfig', 'appConfig', function (httpBatcher, $rootScope, oauthConfig, appConfig) {
            //want to immediately send all pending request regardless of if the request quota or timeout limit has been reached.
            httpBatcher.flush();
            $rootScope.oauthConfig = oauthConfig;
            $rootScope.oauth = new OAuthClient(oauthConfig.authorizeEndpoint);
            $rootScope.appConfig = appConfig;
        }
    ]);
    return app;
});
