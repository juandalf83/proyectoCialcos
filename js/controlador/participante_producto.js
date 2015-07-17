angular.module('cialcosApp')
.controller('ParticipadorProductoCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {
      $scope.pantalla = "participadorproducto";
      $scope.objetos = [];
      cargar();

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_participador_producto/"+id+"/"+editable);
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.pantalla, id:objeto.papid}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$scope.pantalla},function(objetos){
          $scope.objetos = angular.copy(objetos);
          console.log($scope.objetos);
          $scope.objetos.sort();
        });
      }
  }
]);
