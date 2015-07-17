angular.module('cialcosApp')
.controller('ComercializacionCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.pantalla = "comercializacion";
      $scope.objetos = [];
      cargar();

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_comercializacion/"+id+"/"+editable);
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.pantalla, id:objeto.id}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$scope.pantalla},function(objetos){
          $scope.objetos = [];
          angular.forEach(objetos, function (objeto) {
            $scope.objetos = angular.copy(objeto);
            $scope.objetos.sort();
          });
        });
      }
  }
]);
