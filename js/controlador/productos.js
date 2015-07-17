angular.module('cialcosApp')
.controller('ProductosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.tabla = "producto";
      $scope.tiposProductos = Entidad.query({tabla:'tipoproducto'});
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          console.log(registro);
          if(registro.prodid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
            angular.forEach($scope.tiposProductos, function(item){
              if(item.topid == $scope.objeto.topid.topid){
                $scope.objeto.topid = item;
              }
            });
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_producto/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();
        console.log(objeto);
        if(objeto.prodid === undefined){
          objeto.prodestado = 1;
          objeto.prodfechacreacion = fecha;
          objeto.produsuariocreacion = 2;
          objeto.prodprecio = parseFloat(objeto.prodprecio);
          console.log(objeto);
          Entidad.save({tabla:$scope.tabla}, objeto).$promise
            .then(function(data) {
              $location.path("producto");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.prodestado = 1;
          objeto.prodfechacreacion = fecha;
          objeto.produsuariocreacion = 2;
          objeto.prodprecio = parseFloat(objeto.prodprecio);
          Entidad.update({tabla:$scope.tabla, id:objeto.prodid}, objeto).$promise
            .then(function(data) {
              $location.path("producto");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("producto");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$scope.tabla, id:objeto.prodid}, function(result){
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
