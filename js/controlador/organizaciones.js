angular.module('cialcosApp')
.controller('OrganizacionesCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {
      $scope.pantalla = "organizacion";
      $scope.objetos = [];
      cargar();

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_organizacion/"+id+"/"+editable);
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
            var item = angular.copy(objeto);
            $scope.objetos.push(item);
          });
          $scope.objetos.sort();
        });
      }
  }
]);
