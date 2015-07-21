angular.module('cialcosApp')
.controller('DireccionCtrl', ['$scope', '$modalInstance', 'items', '$location', '$filter', 'Entidad', 'Administracion',
  function($scope, $modalInstance, items, $location, $filter, Entidad, Administracion) {
    $scope.items = items;
        $scope.items.editable = true;
        $scope.items.objeto = items.registro;
        console.log($scope.items.objeto);
        $scope.items.tiposDireccion = Entidad.query({tabla:'tipodireccion'});
        $scope.items.zonas = Entidad.query({tabla:'zona'});
        var direcciones = Entidad.query({tabla:'direccion'});

        $scope.cargarProvincias = function(zona){
            getElementos(zona.zonid, 'provincia', 'zon', function(elementos){
              $scope.items.provincias = elementos;
            });
            $scope.items.cantones = [];
            $scope.items.parroquias = [];
        };

        $scope.cargarCantones = function(provincia){
            getElementos(provincia.provid, 'canton', 'prov', function(elementos){
              $scope.items.cantones = elementos;
            });
            $scope.items.parroquias = [];
        };

        $scope.cargarParroquias = function(canton){
            getElementos(canton.canid, 'parroquia', 'can', function(elementos){
              $scope.items.parroquias = elementos;
            });
        };

        function getElementos(id, tabla, tipo, callback){
        array = [];
        Entidad.query({tabla:tabla}, function(elementos){
          angular.forEach(elementos, function(item){
            console.log(item);
            if(item[tipo+"id"][tipo+"id"] == id){
              array.push(angular.copy(item));
            }
          });
          callback(array);
        });
        }

        $scope.ok = function() {
          console.log(items.objeto.dirid);
          if(items.objeto.dirid === undefined){
            console.log(items.objeto);
            var id = $scope.getMaximoId(direcciones);
            items.objeto.dirid = id;
            items.objeto.direstado = 1;
            items.objeto.dirfechacreacion = new Date();
            Entidad.save({tabla:'direccion'},items.objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss(items.objeto);
              })
              .catch(function(error) {
                  console.log("rejected " + JSON.stringify(error));
              });
          }else{
            Entidad.update({tabla:'direccion', id:items.objeto.id}, items.objeto, function(result){
              $location.path("usuarios");
            });
          }
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.getMaximoId =  function (objetos){
          var index = objetos.length;
          var id = 1;
          if(index > 0){
            objetos.sort();
            id = objetos[0].dirid;
            angular.forEach(objetos, function (objeto) {
              if(id < objeto.dirid){
                id = objeto.dirid;
              }
            });
            id = id + 1;
          }
          return id;
        };
  }
]);
