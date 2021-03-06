angular.module('cialcosApp')
.controller('ParametrizacionCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore','$localStorage', 'Administracion',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, $localStorage, Administracion) {

      $scope.error = false;
      $scope.textoError = '';

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
      var menuSeleccionado = $cookieStore.get('menuSeleccionado');
      $scope.tituloListado = menuSeleccionado.nombre;
      $scope.identificador = $scope.identificadores[$routeParams.ubicacion];
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$routeParams.ubicacion, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          var nombre = menuSeleccionado.nombre;
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                console.log($routeParams.ubicacion);
                console.log($scope.infoTabla[$routeParams.ubicacion]);
                nombre = $scope.infoTabla[$routeParams.ubicacion];
              }
            }
          }
          if(reg[$scope.identificador+"id"] === undefined){
            $scope.titulo = "INGRESO DE "+nombre;
            $scope.objeto ={
              descripcion: '',
              estado: 1,
              fechacreacion: '',
              ususariocreacion: ''
            };
          }else{
            $scope.titulo = "EDICION DE "+nombre;
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
        if(objeto.descripcion){
          if(objeto.id === 0 || objeto.id === '' || objeto.id === undefined){
            getIdFormulario($routeParams.ubicacion, function(id){
              data[$scope.identificador+'id'] = id;
              data[$scope.identificador+'descripcion'] = objeto.descripcion;
              data[$scope.identificador+'estado'] = 'A';
              data[$scope.identificador+'fechacreacion'] = fecha;
              usr = $cookieStore.get('usuario');
              data[$scope.identificador+'usuariocreacion'] = usr.usrid;
              console.log(data);
              Entidad.save({tabla:$routeParams.ubicacion},data).$promise
                .then(function(data) {
                  redireccionar();
                })
                .catch(function(error) {
                  console.log("rejected " + JSON.stringify(error));
                });
            });
          }else{
            data[$scope.identificador+'id'] = objeto.id;
            data[$scope.identificador+'descripcion'] = objeto.descripcion;
            data[$scope.identificador+'estado'] = 'A';
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
        }
      };

      $scope.cancelar = function(objeto){
        redireccionar();
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.id, true);
          var fecha = new Date();
          var data = {};
          data[$scope.identificador+'id'] = objeto.id;
          data[$scope.identificador+'descripcion'] = objeto.descripcion;
          data[$scope.identificador+'estado'] = 'I';
          data[$scope.identificador+'fechacreacion'] = fecha;
          var usr = $cookieStore.get('usuario');
          data[$scope.identificador+'usuariocreacion'] = usr.usrid;
          console.log(data);
          console.log($routeParams.ubicacion);
          console.log(objeto.id);
          Entidad.update({tabla:$routeParams.ubicacion, id:objeto.id}, data).$promise
            .then(function(data) {
              cargar();
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      function cargar(){
        Entidad.query({tabla:$routeParams.ubicacion, id:'cargar'},function(objetos){
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

      function getIdFormulario(tabla, callback){
        var num = 0;
        var numString = '';
        Entidad.get({tabla:tabla, id:'numeroRegistros'}).$promise
        .then(function(data) {
          console.log(data);
          angular.forEach(data, function(item){
            if($.isNumeric(item))
              numString += item;
          });
          if(numString)
            num = parseInt(numString);
          callback(num+1);
        });
        // var index = 0;
        // if(objetos !== undefined){
        //   index = objetos.length;
        // }
        // var id = 1;
        // if(index > 0){
        //   objetos.sort();
        //   id = objetos[0].id;
        //   angular.forEach(objetos, function (objeto) {
        //     if(id < objeto.id){
        //       id = objeto.id;
        //     }
        //   });
        //   id = id + 1;
        // }
        // return id;
      }

      function redireccionar(){
        var usr = $cookieStore.get('usuario');
        if($localStorage.dataRedireccion){
          var redireccion = $localStorage.dataRedireccion[usr.usrid];
          console.log(redireccion);
          if(redireccion){
            if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid)
              $location.path(redireccion.pantalla);
            else
              $location.path("listado/"+$routeParams.ubicacion);
          }else{
            $location.path("listado/"+$routeParams.ubicacion);
          }
        }else{
          $location.path("listado/"+$routeParams.ubicacion);
        }
      }

      $scope.validarRepetidos = function(objeto){
        if(objeto.descripcion){
          Administracion.validarRepetidos($routeParams.ubicacion, $scope.identificador+'descripcion', objeto.descripcion,
          function(result){
            if(!result){
              objeto.descripcion = '';
              $scope.error = true;
              $scope.textoError = 'LA DESCRIPCION INGRESADA YA EXISTE';
            }else{
              $scope.error = false;
              $scope.textoError = '';
            }
          });
        }
      };
  }
]);
