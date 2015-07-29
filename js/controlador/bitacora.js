angular.module('cialcosApp')
.controller('BitacoraCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage', 'tablaDinamicaNormal',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage, tablaDinamicaNormal) {

      $scope.tabla = "acceso";
      $scope.objetos = [];
      //cargar();
      var counts = [10, 25, 50, 100];
      var count = 10;
      $scope.tablaBitacora = tablaDinamicaNormal(count, counts, 'bitacora', 0, 'bit', 'bit', $scope);

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
        });
      }
  }
]);
