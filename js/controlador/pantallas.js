angular.module('cialcosApp')
.controller('PantallasCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.tabla = "pantalla";
      $scope.objetos = [];
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
        var fecha = new Date();

        if(objeto.panid === undefined){
          objeto.panestado = 1;
          objeto.panfechacreacion = fecha;
          objeto.panusuariocreacion = 2;
          console.log(objeto);
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("pantallas");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.panestado = 1;
          objeto.panfechacreacion = fecha;
          objeto.panusuariocreacion = 2;
          Entidad.update({tabla:$scope.tabla, id:objeto.panid}, objeto).$promise
            .then(function(data) {
              $location.path("pantallas");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("pantallas");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.panid}, function(result){
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
