angular.module('cialcosApp')
.controller('GeoreferenciacionCtrl',['$scope', '$window', '$location', '$filter', 'Administracion', '$routeParams', '$rootScope','$cookieStore',
function ($scope, $window, $location, $filter, Administracion, $routeParams, $rootScope, $cookieStore) {
    angular.extend($scope, {
        quito: {
            lat: -0.237,
            lng: -78.513,
            zoom: 13
        },
        markers: {}
    });

    $scope.addMarkers = function() {
        angular.extend($scope, {
            markers: {
                m1: {
                    lat: -0.237,
                    lng: -78.513,
                    message: "I'm a static marker",
                },
                // m2: {
                //     lat: -0.237,
                //     lng: 0,
                //     focus: true,
                //     message: "Hey, drag me if you want",
                //     draggable: false
                // }
            }
        });
    };

    $scope.removeMarkers = function() {
        $scope.markers = {};
    };

    $scope.addMarkers();
}]);
