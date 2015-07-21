angular.module('cialcosApp')
.controller('OrganizacionesCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Administracion, $routeParams, $rootScope, $cookieStore) {
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
          Administracion.eliminar($scope.pantalla, 'org', objeto, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Administracion.cargar($scope.pantalla,function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
          console.log($scope.objetos);
        });
      }
  }
]);
