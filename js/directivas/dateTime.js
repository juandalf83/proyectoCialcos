angular.module('cialcosApp')
    .directive('dateTime', function(Configuraciones) {
        return {
            restrict: 'A',
            require : '?ngModel',
            link : function (scope, element, attrs, model) {
                $(element).datepicker(Configuraciones.formatoFecha()).change(function (evt) {
                    if (model) {
                        scope.$apply(function (scope) {
                            model.$setViewValue(element.val());
                        });
                    }
                });
            }
        };
});
