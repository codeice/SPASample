define(['../../module', '../../directives/dirPage'], function (module) {
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/demo',
        {
            templateUrl: 'js/controllers/demo/demo.html?nc=' + Math.random(),
            controller: 'demoCtrl'
        });
    }]);

    module.controller("demoCtrl", ['$scope', 'scopeService', 'demoService', function ($scope, scopeService, demoService) {

        $scope.title = "CRUD Demo";
        //////////////////////////////Demo CRUD///////////////////////////////
        //----searchModel 初始化
        if (angular.isUndefined($scope.searchModel)) {
            $scope.searchModel = {
                PageNumber: 1, //页码
                PageSize: 2, //每页显示记录数
                //搜索条件配置
                Name: "",
                IDCardNo: ""
            };
        }

        //----搜索
        $scope.doSearch = function () {
            $scope.pageModel = demoService.pageFindUsers($scope.searchModel);
            $scope.pageModel.$promise.then(function (response) {
                $scope.users = response.data.Data;
            });
        }

        $scope.doSearch();

        //----翻页
        $scope.changePage = function (pageNumber) {
            $scope.searchModel.PageNumber = pageNumber;
            $scope.doSearch();
        };

        //----mock学历列表
        $scope.educationList = ["中专", "大专", "本科", "硕士", "博士"];

        //----添加时检查名字是否重复
        $scope.checkUserNmeIsExsit = function () {
            $scope.isUserNameExist = false;
            if (angular.isUndefined($scope.user.Name) || $scope.user.Name == null) {
                return;
            }
            if (!angular.isUndefined($scope.originalUser) && $scope.user.Name == $scope.originalUser.Name) {
                return;
            }
            demoService.checkUserNameExist($scope.user.Name).$promise.then(function (response) {
                var id = response.data.Id;
                if (id != null && id != $scope.user.Id) {
                    $scope.isUserNameExist = true;
                }
            });
        }

        //----获取属性详情
        $scope.getUserDetail = function (id) {
            demoService.getUser(id).$promise.then(function (response) {
                $scope.userInfo = response.data;
            }, function (response) {
                bootbox.alert("获取属性详情失败," + response.data.Message);
            });
        }

        //定义用户模型
        function userModel() {
            this.Gender = "男";
        }

        //----新增
        $scope.addUser = function () {
            $scope.modalTitle = "新增用户";
            $scope.user = new userModel();
            $scope.addOrEditForm.isSubmitted = false;
        }

        //----修改属性
        $scope.editUser = function (user) {
            $scope.modalTitle = "编辑用户";
            $scope.addOrEditForm.isSubmitted = false;
            $scope.originalUser = user;
            $scope.user = angular.copy(user, $scope.user);
        }

        //---保存新建或修改的属性
        $scope.saveUser = function () {
            $scope.addOrEditForm.isSubmitted = true;
            if ($scope.addOrEditForm.$invalid || $scope.isUserNameExist) {
                return;
            }
            if ($scope.user.Id == null) {
                demoService.addUser($scope.user).$promise.then(function (response) {
                    var addedUser = response.data;
                    $scope.users.push(addedUser);
                    $("#addOrEditModal").modal('hide');
                    bootbox.alert("添加成功");

                });
            }
            else {
                demoService.updateUser($scope.user.Id, $scope.user).$promise.then(function () {
                    angular.extend($scope.originalUser, $scope.user);
                    $("#addOrEditModal").modal('hide');
                    bootbox.alert("修改成功");
                });
            }
        };

        //单个应用删除应用
        $scope.deleteUser = function (user) {
            bootbox.setLocale("zh_CN");
            bootbox.confirm("部门属性删除后将无法恢复，确定要删除所选择的属性？", function (result) {
                if (result) {
                    demoService.deleteUser(user.Id);
                    $scope.users.remove(user);
                }
            });
        }

    }]);
});