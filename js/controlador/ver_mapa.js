angular.module('cialcosApp')
.controller('MapaCtrl',['$scope', '$window', '$location', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
function ($scope, $window, $location, $filter, Administracion, $routeParams, $rootScope, $cookieStore) {
    angular.extend($scope, {
        quito: {
            lat: -0.237,
            lng: -78.513,
            zoom: 9
        },
        defaults: {
            scrollWheelZoom: false
        },
        events: {
            map: {
                enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                logic: 'emit'
            }
        },
        markers: {}
    });
    $scope.markers = {};
    $scope.productos = [];
    $scope.addMarkers = function() {
      Administracion.cargar('cialco', function(data){
        values = angular.copy(data);
        angular.forEach(values, function(item){
          if(item.ciacoordx && item.ciacoordy){
            var mark = {
                lat: item.ciacoordx,
                lng: item.ciacoordy,
                focus: false,
                message: item.ciadescripcion,
            };
            $scope.markers[item.ciaid] = mark;
          }
        });
      });
    };

    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
      Administracion.get('cialco', parseInt(args.modelName), function(objeto){
        console.log(objeto);
        getDireccion(angular.copy(objeto));
      });
    });

    $scope.addMarkers();
    $scope.objeto = {};
    $scope.registro = {};
    $scope.getCialcos = function(term, done){
      getListado ('cialco', function(resultados){
        done($filter('filter')(resultados, {text: term}, 'text'));
      });
    };

    function getListado (tabla, callback){
      var resultados = [];
      Administracion.cargar(tabla, function(data){
        values = angular.copy(data);
        for(var i = 0; i < values.length; i++){
          if(values[i].ciaestado == 'A' && values[i].ciacoordx && values[i].ciacoordy){
            values[i].id = values[i].ciaid;
            values[i].text = values[i].ciadescripcion;
            resultados.push(values[i]);
          }
        }
        callback(resultados);
      });
    }

    $scope.cancelar = function(objeto){
      $rootScope.conMenu = true;
      $rootScope.cssConMenu = 'col-sm-6 col-md-9';
      $location.path("/");
    };

    $scope.$watch('objeto', function (new_value, old_value) {
      if (new_value !== old_value) {
        $scope.markers[new_value.ciaid].focus = true;
        getDireccion(new_value);
      }
    }, true);

    function getDireccion(cialco){
      var id = parseInt(cialco.ciaid);
      Administracion.getDirecciones(id, function(data){
        if(data.length > 0){
          angular.forEach(data, function(item){
            if(item.dirprincipal == 'S'){
              $scope.registro = item;
              var calleSecundaria = "";
              var numero = "";
              if(item.dircallesecundaria){
                calleSecundaria = " y "+item.dircallesecundaria;
              }
              if(item.dirnumero){
                numero = " Nro "+item.dirnumero;
              }
              $scope.markers[id].message = cialco.ciadescripcion + "<br>" + item.dircalleprincipal + calleSecundaria + numero;
            }
          });
          cialco.text = cialco.ciadescripcion;
          cialco.id = cialco.ciaid;
          $scope.objeto = cialco;
          getProductos(id);
        }else{
          $scope.registro = {};
        }
      });
    }

    function getProductos(idCialco){
      Administracion.getParticipantes(idCialco, function(data){
        var participantes = angular.copy(data);
        angular.forEach(participantes, function(participante){
          Administracion.getParticipadorProductos(participante.pafid, function(items){
            var productos = angular.copy(items);
            angular.forEach(productos, function(producto){
              var item = angular.copy(producto);
              if($.inArray(item.uprid.prodid.prodnombreproducto, $scope.productos)){
                $scope.productos.push(item.uprid.prodid.prodnombreproducto);
              }
            });
          });
        });
      });
    }
}]);
