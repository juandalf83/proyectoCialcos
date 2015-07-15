angular.module('cialcosApp')
.controller('UsuariosPerfilesCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, $cookieStore) {

      $scope.tabla = "usuarioperfil";
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        $scope.perfiles = Entidad.query({tabla:'perfil'});
        $scope.usuarios = Entidad.query({tabla:'usuario'});
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.upeid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_usuario_perfil/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();

        if(objeto.upeid === undefined){
          objeto.upeestado = 1;
          objeto.upefechacreacion = fecha;
          objeto.upeusuariocreacion = 2;
          objeto.upefechacaducidad = new Date(objeto.upefechacaducidad);
          console.log(objeto);
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("usuarioperfil");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.upeestado = 1;
          objeto.upefechacreacion = fecha;
          objeto.upeusuariocreacion = 2;
          Entidad.update({tabla:$scope.tabla, id:objeto.upeid}, objeto).$promise
            .then(function(data) {
              $location.path("usuarioperfil");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("usuarioperfil");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.upeid}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$scope.tabla},function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
        });
      }
  }
]);
