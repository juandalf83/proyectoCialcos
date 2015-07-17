angular.module('cialcosApp')
.controller('PerfilesMenuCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.tabla = "perfilmenu";
      $scope.perfiles = Entidad.query({tabla:'perfil'});
      $scope.menus = Entidad.query({tabla:'menu'});
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.pemid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
            angular.forEach($scope.perfiles, function(item){
              if(item.perid == $scope.objeto.perid.perid){
                $scope.objeto.perid = item;
              }
            });
            angular.forEach($scope.menus, function(item){
              if(item.menid == $scope.objeto.menid.menid){
                $scope.objeto.menid = item;
              }
            });
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_perfil_menu/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();
        console.log(objeto);
        if(objeto.pemid === undefined){
          objeto.pemestado = 1;
          objeto.pemfechacreacion = fecha;
          objeto.pemusuariocreacion = 2;
          console.log(objeto);
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("perfilmenu");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.pemestado = 1;
          objeto.pemfechacreacion = fecha;
          objeto.pemusuariocreacion = 2;
          Entidad.update({tabla:$scope.tabla, id:objeto.perid}, objeto).$promise
            .then(function(data) {
              $location.path("perfilmenu");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("perfilmenu");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.pemid}, function(result){
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
