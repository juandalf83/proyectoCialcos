angular.module('cialcosApp')
.controller('AccesosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.tabla = "acceso";
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        $scope.usuarios = Entidad.query({tabla:'usuario'});
        $scope.pantallas = Entidad.query({tabla:'pantalla'});
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.accid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
            angular.forEach($scope.usuarios, function(item){
              if(item.usrid == $scope.objeto.usrid.usrid){
                $scope.objeto.usrid = item;
              }
            });
            angular.forEach($scope.pantallas, function(item){
              if(item.panid == $scope.objeto.panid.panid){
                $scope.objeto.panid = item;
              }
            });
            console.log($scope.objeto);
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_accesos/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();

        if(objeto.accid === undefined){
          objeto.accestado = 1;
          objeto.accfechacreacion = fecha;
          objeto.accusuariocreacion = 2;
          console.log(objeto);
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("accesos");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.accestado = 1;
          objeto.accfechacreacion = fecha;
          objeto.accusuariocreacion = 2;
          Entidad.update({tabla:$scope.tabla, id:objeto.accid}, objeto).$promise
            .then(function(data) {
              $location.path("accesos");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("accesos");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.accid}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$scope.tabla},function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
          console.log($scope.objetos);
        });
      }
  }
]);
