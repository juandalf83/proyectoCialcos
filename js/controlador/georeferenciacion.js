angular.module('cialcosApp')
.controller('GeoreferenciacionCtrl',['$scope', '$window', '$location', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
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

    // $scope.addMarkers = function() {
    //     angular.extend($scope, {
    //         markers: {
    //             m1: {
    //                 lat: -0.237,
    //                 lng: -78.513,
    //                 message: "I'm a static marker",
    //             },
    //             // m2: {
    //             //     lat: -0.237,
    //             //     lng: 0,
    //             //     focus: true,
    //             //     message: "Hey, drag me if you want",
    //             //     draggable: false
    //             // }
    //         }
    //     });
    // };
    //
    // $scope.removeMarkers = function() {
    //     $scope.markers = {};
    // };

    $scope.$on('leafletDirectiveMap.click', function(event, args){
        console.log(args.leafletEvent.latlng);
        $scope.objeto.ciacoordx = args.leafletEvent.latlng.lat;
        $scope.objeto.ciacoordy = args.leafletEvent.latlng.lng;
        $scope.objeto.ciacoordz = 13;
    });

    //$scope.addMarkers();
    $scope.objeto = {};
    $scope.getCialcos = function(term, done){
      getListado ('cialco', 'cia', function(resultados){
        done($filter('filter')(resultados, {text: term}, 'text'));
      });
    };

    function getListado (tabla, tipo, callback){
      var resultados = [];
      Administracion.cargar(tabla, function(data){
        values = angular.copy(data);
        for(var i = 0; i < values.length; i++){
          if(values[i][tipo+'estado'] == 'A'){
            values[i].id = values[i][tipo+'id'];
            values[i].text = values[i][tipo+'descripcion'];
            resultados.push(values[i]);
          }
        }
        callback(resultados);
      });
    }

    $scope.cancelar = function(objeto){
      $location.path("cialcos");
    };

    $scope.guardar = function(objeto){
      if(objeto){
        Administracion.guardar('cialco', 'cia', objeto, function(id){
          if($.isNumeric(id)){
            $scope.objeto = {};
            alert("REGISTRO GUARDADO CORRECTAMENTE");
          }
        });
      }else{
        alert("DEBE SELECCIONAR UN CIALCO");
      }
    };
}]);
