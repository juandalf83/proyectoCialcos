angular.module('cialcosApp')
.controller('IngresoMenuCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.tabla = "menu";
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        obtenerItemMenuPadre($routeParams.id);
        $scope.pantallas = Entidad.query({tabla:'pantalla'});
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.menid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_ingreso_menu/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();

        if(objeto.menid === undefined){
          objeto.menestado = 1;
          objeto.menfechacreacion = fecha;
          objeto.menusuariocreacion = 2;
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("ingresomenu");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.menestado = 1;
          objeto.menfechacreacion = fecha;
          objeto.menusuariocreacion = 2;
          Entidad.update({tabla:$scope.tabla, id:objeto.menid}, objeto).$promise
            .then(function(data) {
              $location.path("ingresomenu");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("ingresomenu");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.menid}, function(result){
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
              if(objeto.menpadre == objetoCopy.menid){
                objeto.padre = objetoCopy;
              }
            });
          });
          console.log($scope.objetos);
        });
      }

    function obtenerItemMenuPadre(id){
      $scope.menusPadre = [];
      Entidad.query({tabla:$scope.tabla}, function(items){
        angular.forEach(items, function (item) {
          if(item.menid != id && item.menpadre != id){
            $scope.menusPadre.push(item);
          }
        });
      });
    }
  }
]);
