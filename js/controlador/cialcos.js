angular.module('cialcosApp')
.controller('CialcosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Administracion, $routeParams, $rootScope, $cookieStore) {
      $scope.pantalla = "cialco";
      $scope.objetos = [];
      cargar();

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_cialcos/"+id+"/"+editable);
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.ciaid, true);
          Administracion.eliminar($scope.pantalla, 'cia', objeto, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Administracion.cargar($scope.pantalla,function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
        });
      }
  }
]);
