angular.module('cialcosApp')
.controller('UsuariosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Administracion, $routeParams, $rootScope, $cookieStore) {
      $scope.pantalla = "usuario";
      $scope.objetos = [];
      cargar();

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_usuario/"+id+"/"+editable);
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.usrid, true);
          Administracion.eliminar($scope.pantalla,'usr', objeto, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Administracion.cargar($scope.pantalla, function(objetos){
          console.log(objetos);
          $scope.objetos = [];
          var item = {};
          angular.forEach(objetos, function (objeto) {
            item = angular.copy(objeto);
            if(item.usrcargo == 'PRI'){
              item.cargo = 'PRINCIPAL';
            }else{
              item.cargo = 'SECUNDARIA';
            }
            if(item.usrestado == 'A'){
              item.estado = 'ACTIVO';
            }else{
              item.estado = 'INACTIVO';
            }
            $scope.objetos.push(item);
          });
          console.log($scope.objetos);
          $scope.objetos.sort();
        });
      }
  }
]);
