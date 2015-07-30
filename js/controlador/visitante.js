angular.module('cialcosApp')
.controller('VisitanteCtrl', ['$scope', '$location', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $location, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "visitante";
      $scope.objetos = [];

      $scope.guardar = function(objeto){
          Administracion.guardar($scope.tabla, 'vis', objeto, function(id){
            if($.isNumeric(id)){
              $rootScope.conMenu = true;
              $rootScope.cssConMenu = 'col-sm-6 col-md-9';
              $location.path("/");
            }
          });
      };

      $scope.cancelar = function(objeto){
        $rootScope.conMenu = true;
        $rootScope.cssConMenu = 'col-sm-6 col-md-9';
        $location.path("/");
      };

      $scope.validarEmail = function(email) {
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ( !expr.test(email) )
          alert("Error: La dirección de correo " + email + " es incorrecta.");
      };
  }
]);
