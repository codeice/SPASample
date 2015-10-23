/*
 * directive 1.0
 * 增加a ,dirToggle
 */
directive_v = "1.0";
define(['../module', './utility'], function (module) {

    //----rewrite a element
    module.directive("a", function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    element.on('click', function (event) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                    });
                }//end if 
            }
        }
    });

    module.directive('dirToggle', function () {
        return {
            restrict: 'A',
            scope: {
                toggle: "=dirToggle"
            },
            link: function (scope, element, attrs) {
                element.click(function () {
                    scope.$parent.$apply(function () {
                        scope.toggle = !scope.toggle;
                    });
                });
            }
        };
    });

});