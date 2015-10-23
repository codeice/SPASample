﻿define(['../module'], function (module) {
    module.factory('oauthService', [
        "$http", "$window", "$rootScope", '$location', function ($http, $window, $rootScope, $location) {
            var _oauthService = function () {

                var oauthService = {
                    //----跳转至登录页面
                    goToAuthorize: function () {
                       sessionStorage.removeItem('id_token');
                       sessionStorage.removeItem('access_token');
                       sessionStorage.removeItem('user_info');
                        //创建简化模式（implicit）授权申请
                        var req = $rootScope.oauth.createImplicitFlowRequest(
                            $rootScope.oauthConfig.clientId,
                            $rootScope.oauthConfig.redirectUri,
                            'openid profile roles idmgr',
                            'id_token token');
                        //跳转到认证登录页面
                        $window.location = req.url;
                    },
                    //---获取当前用户
                    getCurrentUser: function () {
                        var hash = $location.path().substring(1);
                        var response = $rootScope.oauth.parseResult(hash);
                        if (response) {
                            if (response.id_token) {
                                var url = $rootScope.oauthConfig.jwksUri + "?nc=" + Math.random();
                                var getCert = $http.get(url).then(function (result) {
                                    return result.data.keys[0].x5c[0];
                                });
                                var getUserResult = getCert.then(function (cert) {
                                    var jwsId = new KJUR.jws.JWS();
                                    var result = jwsId.verifyJWSByPemX509Cert(response.id_token, cert);
                                    if (result) {
                                        var idTokenInfo = $.parseJSON(jwsId.parsedJWS.payloadS);
                                        sessionStorage.setItem('id_token', response.id_token, idTokenInfo.exp);
                                        if (response.access_token) {
                                            var jws = new KJUR.jws.JWS();
                                            jws.parseJWS(response.access_token);
                                            var accTokenInfo = $.parseJSON(jws.parsedJWS.payloadS);
                                            sessionStorage.setItem('access_token', response.access_token, accTokenInfo.exp);
                                            ///获取登录用户信息
                                            var userInfoUrl = $rootScope.oauthConfig.userInfoUri + "?nc=" + Math.random();
                                            $http.defaults.headers.common.Authorization = 'Bearer ' + response.access_token;
                                            var getUserInfo = $http.get(userInfoUrl);
                                            return getUserInfo.then(function (result) {
                                                sessionStorage.setItem("user_info", angular.toJson(result.data), accTokenInfo.exp);
                                                $rootScope.currentUser = angular.fromJson(sessionStorage.getItem('user_info'));
                                                return {
                                                    response: response,
                                                    user: $rootScope.currentUser
                                                };
                                            });
                                        } else {
                                            throw "response.access_token is undefined or null";
                                        }
                                    } else {
                                        this.goToAuthorize();
                                    }
                                });
                                return getUserResult;
                            } else {
                                throw "response.id_token is undefined or null";
                            } //end if id_token
                        } //end  if response
                        else {
                            this.goToAuthorize();
                        } //end else response
                    },
                    //----注销
                    logout: function () {
                        var logoutEndpoint = $rootScope.oauthConfig.logoutEndpoint + "?id_token_hint=" + sessionStorage.getItem('id_token') + "&post_logout_redirect_uri=" + $rootScope.appConfig.baseUrl;
                       sessionStorage.removeItem('id_token');
                       sessionStorage.removeItem('access_token');
                       sessionStorage.removeItem('user_info');
                        $window.location = logoutEndpoint;
                    }
                }; //end oauthService obj

                return oauthService;
            };
            return _oauthService;
        }//end factory
    ]);

});
