angular.module('cialcosApp')
.controller('PantallasCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "pantalla";
      $scope.objetos = [];
      $scope.error = false;
      $scope.textoError = '';
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.panid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_pantalla/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        if(objeto.panurl){
          Administracion.guardar($scope.tabla, 'pan', objeto, function(id){
            if($.isNumeric(id)){
              redireccionar("pantallas");
            }
          });
        }else{
          alert("LA DESCRIPCION ES UN CAMPO OBLIGATORIO");
        }
      };

      $scope.cancelar = function(objeto){
        redireccionar("pantallas");
      };

      function redireccionar(urlRegresar){
        var usr = $cookieStore.get('usuario');
        if($localStorage.dataRedireccion){
          var redireccion = $localStorage.dataRedireccion[usr.usrid];
          if(redireccion){
            if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid)
              $location.path(redireccion.pantalla);
            else
              $location.path(urlRegresar);
          }else{
            $location.path(urlRegresar);
          }
        }else{
          $location.path(urlRegresar);
        }
      }

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.panid, true);
          Administracion.eliminar($scope.tabla, 'pan', objeto, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
        });
      }

      $scope.validarRepetidos = function(objeto){
        if(objeto.panurl){
          Administracion.validarRepetidos($scope.tabla, 'panurl', objeto.panurl,
          function(result){
            if(!result){
              objeto.panurl = '';
              $scope.error = true;
              $scope.textoError = 'EL LINK INGRESADO YA EXISTE';
            }else{
              $scope.error = false;
              $scope.textoError = '';
            }
          });
        }else{
          $scope.error = false;
          $scope.textoError = '';
        }
      };
  }
]);
