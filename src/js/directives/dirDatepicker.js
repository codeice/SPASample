define(['../module','datepicker'], function (module) {
    module.directive("dirDatepicker", ["$compile", "scopeService", function ($compile, scopeService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                var datepickerFormat = null;
                if (attrs['dirDatepicker']) {
                    datepickerFormat = attrs['dirDatepicker'].replace('M', 'm').replace('M', 'm');
                }
                element.datepicker({
                    autoclose: true,
                    language: 'zh-CN',
                    format: datepickerFormat
                });
                element.off('blur').on('blur', function () {
                    scopeService.safeApply(scope, function () {
                        var date = element.datepicker("getDate");
                        ngModel.$setViewValue(date);
                    });
                });

            }
        }
    }]);
});