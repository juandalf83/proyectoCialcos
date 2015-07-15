angular.module('cialcosApp')
.controller('PerfilesCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.tabla = "perfil";
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        obtenerItemPerfilPadre($routeParams.id);
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.perid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_perfiles/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();

        if(objeto.perid === undefined){
          objeto.perestado = 1;
          objeto.perfechacreacion = fecha;
          objeto.perusuariocreacion = 2;
          console.log(objeto);
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("perfiles");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.perestado = 1;
          objeto.perfechacreacion = fecha;
          objeto.perusuariocreacion = 2;
          Entidad.update({tabla:$scope.tabla, id:objeto.perid}, objeto).$promise
            .then(function(data) {
              $location.path("perfiles");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("perfiles");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.perid}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$scope.tabla},function(objetos){
          var objetosCopy = angular.copy(objetos)
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

    function obtenerItemPerfilPadre(id){
      $scope.perfilesPadre = [];
      Entidad.query({tabla:$scope.tabla}, function(items){
        angular.forEach(items, function (item) {
          if(item.perid != id && item.perpadre != id){
            $scope.perfilesPadre.push(item);
          }
        });
      });
    }
  }
]);
