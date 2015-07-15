'use strict';
angular.module('cialcosApp')
.directive('chosen', function () {

  var linker = function (scope, element, attr){
    scope.$watch('materiales', function(){
      element.trigger('chosen:updated');
    });

    element.chosen({
      no_results_text: "No se encuentra este material"
    });
  };

  return {
    restrict: 'A',
    link: linker
  };

});
