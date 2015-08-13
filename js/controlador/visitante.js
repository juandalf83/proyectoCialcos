angular.module('cialcosApp')
.controller('VisitanteCtrl', ['$scope', '$location', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $location, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "visitante";
      $scope.objeto = {viscorreo: ''};

      $scope.guardar = function(objeto){
        objeto.viscomentario = objeto.viscomentario.replace(/\n/g, " | ");
        Administracion.guardar($scope.tabla, 'vis', objeto, function(id){
          if($.isNumeric(id)){
            $rootScope.conMenu = true;
            $rootScope.cssConMenu = 'col-sm-6 col-md-9';
            alert("Su solicitud se ha enviado correctamente");
            $location.path("/");
          }
        });
      };

      $scope.cancelar = function(objeto){
        $rootScope.conMenu = true;
        $rootScope.cssConMenu = 'col-sm-6 col-md-9';
        $location.path("/");
      };

      $scope.validarEmail = function(objeto) {
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!expr.test(objeto.viscorreo)){
          alert("Error: La dirección de correo " + objeto.viscorreo + " es incorrecta.");
          objeto.viscorreo = "";
        }
      };
  }
]);
