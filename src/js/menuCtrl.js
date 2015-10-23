define(['./module', './menuDatas'], function (module) {
    module.controller('menuCtrl', ['$scope', function ($scope) {
        $scope.menus = menuData;
        //-----激活当前菜单 并设置面包屑对象
        function activeMenu(menus, parents) {
            if (!angular.isArray(menus)) {
                return;
            }
            for (var i = 0; i < menus.length; i++) {
                var menu = menus[i];
                menu.active = false;
                menu.open = false;
                var parent;
                if ($scope.currentPath == menu.url) {
                    menu.active = true;
                    $scope.nav.currentTitle = menu.name;
                    for (var j = 0; j < parents.length; j++) {
                        parent = parents[j];
                        parent.active = true;
                        parent.open = true;
                        $scope.nav.parents.push({ title: parent.name, url: parent.url, icon: parent.icon });
                    }
                }
                else {
                    if (angular.isArray(menu.submenus)) {
                        activeMenu(menu.submenus, parents.concat(menu));
                    } else {
                        //---匹配附属菜单
                        if (!angular.isUndefined(menu.attachedMenus)) {
                            for (var j = 0; j < menu.attachedMenus.length; j++) {
                                var attachedMenu = menu.attachedMenus[j];
                                if ($scope.currentPath.indexOf(attachedMenu.url) >= 0) {
                                    //set breadcrumb
                                    $scope.nav.currentTitle = attachedMenu.name;
                                    $scope.nav.parents.push({ title: menu.name, url: menu.url, icon: menu.icon });
                                    menu.active = true;
                                    for (var k = 0; k < parents.length; k++) {
                                        parent = parents[k];
                                        parent.active = true;
                                        parent.open = true;
                                    }//end for k
                                }//end if  match url
                            }//end for j
                        }//end if 
                    }//end else inner
                }//end else 


            }//end for


        }

        //----subscrib routeChangeStart event
        $scope.$on('$routeChangeStart', function (scope, next, current) {
            if (angular.isUndefined(next.$$route)) {
                return;
            }
            $scope.currentPath = "#" + next.$$route.originalPath;
            $scope.nav = {
                parents: [],
                currentTitle: ""
            };
            activeMenu($scope.menus, []);
        });

    }]);
});