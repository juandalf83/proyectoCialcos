angular.module('cialcosApp')
.controller('FormularioParticipadorCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log', '$cookieStore',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $cookieStore) {
      $scope.pantalla = "PARTICIPADOR PRODUCTO";
      $scope.objetos = Entidad.query({tabla:'participadorproducto'});
      var unique = {};
      console.log($scope.menu);
      console.log($scope.menuSeleccionado);
      Entidad.query({tabla:'participante'}).$promise
        .then(function(data) {
          $scope.participantes = data;
          Entidad.query({tabla:'usuarioproducto'}).$promise
            .then(function(data) {
              $scope.productos = [];
              angular.forEach($scope.participantes, function(participante){
                angular.forEach(data, function(item){
                  if(participante.usrid.usrid == item.usrid.usrid){
                    if (!unique[item.usrid.usrid]) {
                      $scope.productos.push(item);
                      unique[item.usrid.usrid] = item;
                    }
                  }
                });
              });
            });
        });
      $scope.unidadesMedida = Entidad.query({tabla:'unidadmedida'});

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:'participadorproducto', id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          if(reg.papid === undefined){
            $scope.titulo = "INGRESO DE ";
            $scope.objeto = reg;
          }else{
            $scope.titulo = "EDICION DE ";
            $scope.objeto = reg;
            angular.forEach($scope.participantes, function(item){
              if(item.pafid == $scope.objeto.pafid.pafid){
                $scope.objeto.tcoid = item;
              }
            });
            angular.forEach($scope.productos, function(item){
              if(item.uprid == $scope.objeto.uprid.uprid){
                $scope.objeto.uprid = item;
              }
            });
            angular.forEach($scope.unidadesMedida, function(item){
              if(item.umeid == $scope.objeto.umeid.umeid){
                $scope.objeto.umeid = item;
              }
            });
          }
        });
      }

      $scope.guardar = function(objeto){
        var fecha = new Date();
        var usr = '';
        if(objeto.papid === undefined){
          objeto.papid = $scope.getMaximoId();
          objeto.papestado = 'A';
          objeto.papfechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.papusuariocreacion = usr.usrid;
          objeto.papprecio = parseFloat(objeto.papprecio);
          objeto.papcantidad = parseFloat(objeto.papcantidad);
          objeto.papventacantidad = parseFloat(objeto.papventacantidad);
          objeto.papventatotal = parseFloat(objeto.papventatotal);
          console.log(objeto);
          Entidad.save({tabla:"participadorproducto"}, objeto).$promise
            .then(function(data) {
              $location.path("participadorproducto");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.papestado = 'A';
          objeto.papfechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.papusuariocreacion = usr.usrid;
          Entidad.update({tabla:"participadorproducto", id:objeto.papid}, objeto).$promise
            .then(function(data) {
              $location.path("participadorproducto");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("participadorproducto");
      };

      $scope.getMaximoId =  function (){
        var index = $scope.objetos.length;
        var id = 1;
        if(index > 0){
          $scope.objetos.sort();
          id = $scope.objetos[0].papid;
          angular.forEach($scope.objetos, function (objeto) {
            if(id < objeto.papid){
              id = objeto.papid;
            }
          });
          id = id + 1;
        }
        return id;
      };
  }
]);
