angular.module('cialcosApp')
.controller('PerfilesMenuCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion) {

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
        Administracion.guardar($scope.tabla, 'pem', objeto, function(id){
          if($.isNumeric(id)){
            $location.path("accesos");
          }
        });
      };

      $scope.cancelar = function(objeto){
        $location.path("perfilmenu");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Administracion.eliminar($scope.tabla, 'pem', objeto, function(result){
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
  }
]);
