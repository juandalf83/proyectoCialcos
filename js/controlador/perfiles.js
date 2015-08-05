angular.module('cialcosApp')
.controller('PerfilesCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "perfil";
      $scope.objetos = [];
      $scope.error = false;
      $scope.textoError = '';
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          if(registro.perid === undefined){
            $scope.titulo = "Ingreso de";
            $scope.objeto = {};
            $scope.objeto.percrear = '0';
            $scope.objeto.pereditar = '0';
            $scope.objeto.perconsultar = '0';
            $scope.objeto.pereliminar = '0';
          }else{
            if(registro.perpadre){
              Entidad.get({tabla:$scope.tabla, id:registro.perpadre}, function(dato){
                padre = angular.copy(dato);
                padre.id = padre.perid;
                padre.text = padre.perdescripcion;
                registro.perpadre = padre;
                $scope.titulo = "Edicion de";
                $scope.objeto = registro;
              });
            }else{
              $scope.titulo = "Edicion de";
              $scope.objeto = registro;
            }
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_perfiles/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        if(objeto.perdescripcion && objeto.perpadre){
          objeto.perpadre = objeto.perpadre.perid;
          Administracion.guardar($scope.tabla, 'per', objeto, function(id){
            if($.isNumeric(id)){
              redireccionar("perfiles");
            }
          });
        }else{
          alert("EXISTEN CAMPOS VACIO");
        }
      };

      $scope.cancelar = function(objeto){
        redireccionar("perfiles");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.perid, true);
          Administracion.eliminar($scope.tabla, 'per', objeto, function(result){
            cargar();
          });
        }
      };

      $scope.getPerfiles = function(term, done){
        $scope.perfilesPadre = [];
        Entidad.query({tabla:$scope.tabla}, function(items){
          angular.forEach(items, function (item) {
            if(item.perid != $routeParams.id && item.perpadre != $routeParams.id){
              if(item.perestado == 'A'){
                item.id = item.perid;
                item.text = item.perdescripcion;
                $scope.perfilesPadre.push(item);
              }
            }
          });
          done($filter('filter')($scope.perfilesPadre, {text: term}, 'text'));
        });
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          var objetosCopy = angular.copy(objetos);
          $scope.objetos = objetos;
          $scope.objetos.sort();
          angular.forEach($scope.objetos,function(objeto){
            angular.forEach(objetosCopy,function(objetoCopy){
              if(objeto.perpadre == objetoCopy.perid){
                objeto.padre = objetoCopy;
              }
            });
          });
          console.log($scope.objetos);
        });
      }

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

      $scope.validarRepetidos = function(objeto){
        if(objeto.perdescripcion){
          Administracion.validarRepetidos($scope.tabla, 'perdescripcion', objeto.perdescripcion,
          function(result){
            if(!result){
              objeto.perdescripcion = '';
              $scope.error = true;
              $scope.textoError = 'EL PERFIL INGRESADO YA EXISTE';
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
