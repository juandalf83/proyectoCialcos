angular.module('cialcosApp')
.controller('CialcosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {
      $scope.pantalla = "cialco";
      $scope.objetos = [];
      cargar();

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_cialcos/"+id+"/"+editable);
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.pantalla, id:objeto.ciaid}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$scope.pantalla},function(objetos){
          $scope.objetos = angular.copy(objetos);
          $scope.objetos.sort();
        });
      }
  }
]);
