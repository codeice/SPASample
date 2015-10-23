define(['../module'], function (module) {
    module.constant('routeProvider', {
        $routeProvider: null,
        ctrlDic: {},
        defaultCtrl: null,
        AddRoute: function (route, templateUrl, controller) {
            this.ctrlDic[controller] = {
                templateUrl: templateUrl,
                controller: controller
            };
            this.$routeProvider.when('/' + route, this.ctrlDic[controller]);
        },
        SetDefaultCtrl: function (controller) {
            if (this.defaultCtrl) {
                utility.ErrorConsoleLog("Default route has been set twice!" + "  Before:" + this.defaultCtrl.controller + "  After:" + this.ctrlDic[controller].controller);
            }
            this.$routeProvider.when('/', this.ctrlDic[controller]);
            this.defaultCtrl = this.ctrlDic[controller];
        },
        AddDefaultRoute: function (templateUrl, controller) {
            this.ctrlDic[controller] = {
                templateUrl: templateUrl,
                controller: controller
            };
            if (this.defaultCtrl) {
                utility.ErrorConsoleLog("Default route has been set twice!" + "  Before:" + this.defaultCtrl.controller + "  After:" + this.ctrlDic[controller].controller);
            }
            this.$routeProvider.when('/', this.ctrlDic[controller]);
            this.defaultCtrl = this.ctrlDic[controller];
        }
    });
});