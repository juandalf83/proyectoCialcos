angular.module('cialcosApp')
.controller('ParametrizacionCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore) {

      $scope.identificadores ={
        apoyoproduccion: 'apy',
        destinoingresos: 'dei',
        equipamientodisponible: 'eqd',
        etnia: 'etn',
        frecuencia: 'fre',
        fuentesingresos: 'fin',
        infraestructura: 'inf',
        movilizacion: 'mov',
        nivelescolaridad: 'nie',
        parentesco: 'prc',
        posesiontierra: 'ptr',
        practicaproductiva: 'ppr',
        procesocontratacion: 'pta',
        tipocialco: 'tco',
        tipodifusion: 'tpd',
        tipodireccion: 'tdr',
        tipomail: 'tpm',
        tipoproducto: 'top',
        tipotelefono: 'tpt',
        tipousuario: 'tpu',
        unidadmedida: 'ume',
        zona: 'zon',
      };

      $scope.objetos = [];
      $scope.tituloListado = $rootScope.menuSeleccionado.nombre;
      $scope.identificador = $scope.identificadores[$routeParams.ubicacion];
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$routeParams.ubicacion, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          if(reg[$scope.identificador+"id"] === undefined){
            $scope.titulo = "INGRESO DE "+$rootScope.menuSeleccionado.nombre;
            $scope.objeto ={
              descripcion: '',
              estado: 1,
              fechacreacion: '',
              ususariocreacion: ''
            };
          }else{
            $scope.titulo = "EDICION DE "+$rootScope.menuSeleccionado.nombre;
            $scope.objeto ={
              id: reg[$scope.identificador+'id'],
              descripcion: reg[$scope.identificador+'descripcion'],
              estado: reg[$scope.identificador+'estado'],
              fechacreacion: reg[$scope.identificador+'fechacreacion'],
              ususariocreacion: reg[$scope.identificador+'usuariocreacion']
            };
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario/"+id+"/"+$routeParams.ubicacion+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var fecha = new Date();
        var data = {};
        if(objeto.id === 0 || objeto.id === '' || objeto.id === undefined){
          data[$scope.identificador+'descripcion'] = objeto.descripcion;
          data[$scope.identificador+'estado'] = 1;
          data[$scope.identificador+'fechacreacion'] = fecha;
          usr = $cookieStore.get('usuario');
          data[$scope.identificador+'usuariocreacion'] = usr.usrid;
          Entidad.save({tabla:$routeParams.ubicacion},data).$promise
            .then(function(data) {
              $location.path("listado/"+$routeParams.ubicacion);
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          data[$scope.identificador+'id'] = objeto.id;
          data[$scope.identificador+'descripcion'] = objeto.descripcion;
          data[$scope.identificador+'estado'] = 1;
          data[$scope.identificador+'fechacreacion'] = fecha;
          usr = $cookieStore.get('usuario');
          data[$scope.identificador+'usuariocreacion'] = usr.usrid;
          Entidad.update({tabla:$routeParams.ubicacion, id:objeto.id}, data).$promise
            .then(function(data) {
              $location.path("listado/"+$routeParams.ubicacion);
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("listado/"+$routeParams.ubicacion);
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Entidad.delete({tabla:$routeParams.ubicacion, id:objeto.id}, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Entidad.query({tabla:$routeParams.ubicacion},function(objetos){
          $scope.objetos = [];
          angular.forEach(objetos, function (objeto) {
            objetosCopy = angular.copy(objeto);
            campos = Object.keys(objetosCopy);
            var item = {};
            angular.forEach(campos, function (campo) {
              var campoNuevo = campo.substring(3);
              item[campoNuevo] = objetosCopy[campo];
            });
            $scope.objetos.push(item);
            $scope.objetos.sort();
          });
        });
      }
  }
]);
