angular.module('cialcosApp')
.controller('MapaCtrl',['$scope', '$window', '$location', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
function ($scope, $window, $location, $filter, Administracion, $routeParams, $rootScope, $cookieStore) {
    angular.extend($scope, {
        quito: {
            lat: -0.237,
            lng: -78.513,
            zoom: 13
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
        console.log($scope.markers);
        // angular.extend($scope, {
        //     markers: {
        //         m1: {
        //             lat: -0.237,
        //             lng: -78.513,
        //             message: "I'm a static marker",
        //         },
        //         // m2: {
        //         //     lat: -0.237,
        //         //     lng: 0,
        //         //     focus: true,
        //         //     message: "Hey, drag me if you want",
        //         //     draggable: false
        //         // }
        //     }
        // });
      });
    };

    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
      getDireccion(args.modelName);
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
        getDireccion(new_value.ciaid);
      }
    }, true);

    function getDireccion(idCialco){
      Administracion.getDirecciones(parseInt(idCialco), function(data){
        if(data.length > 0){
          angular.forEach(data, function(item){
            if(item.dirprincipal == 'S'){
              $scope.registro = item;
            }
          });
        }else{
          $scope.registro = {};
        }
      });
    }
}]);
