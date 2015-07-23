angular.module('cialcosApp')
.controller('TerritoriosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams,$rootScope, $cookieStore, Administracion, $localStorage) {
      $scope.disabledZona = true;
      $scope.disabledProvincia = true;
      $scope.disabledCanton = true;
      $scope.disabledParroquia = true;

      cargar();

      $scope.guardar = function(objeto, objetos, tabla, identificador, externo, isExterno){
        if(isExterno){
          objeto[externo+'id'] = objeto[externo+'id'];
        }
        console.log(objeto);
        Administracion.guardar(tabla, identificador, objeto, function(id){
          if($.isNumeric(id)){
            redireccionar(tabla);
          }
        });
        // objeto[identificador+'descripcion'] = objeto[identificador+'descripcion'];
        // var fecha = new Date();
        // var data = {};
        // if(objeto[identificador+'id'] === 0 || objeto[identificador+'id'] === '' || objeto[identificador+'id'] === undefined){
        //   objeto[identificador+'id'] = 0;
        //   var id = $scope.getMaximoId(objetos);
        //   data[identificador+'id'] = id;
        //   data[identificador+'estado'] = 1;
        //   data[identificador+'fechacreacion'] = fecha;
        //   data[identificador+'usuariocreacion'] = 2;
        //   if(isExterno){
        //     data[externo+'id'] = objeto[externo+'id'];
        //   }
        //   Entidad.save({tabla:tabla},data, function(result){
        //     $scope.cancelar(tabla);
        //     $rootScope.guardarBitacoraCRUD(true, false, false);
        //     cargar();
        //   });
        // }else{
        //   data[identificador+'id'] = objeto[identificador+'id'];
        //   data[identificador+'descripcion'] = objeto[identificador+'descripcion'];
        //   data[identificador+'estado'] = 1;
        //   data[identificador+'fechacreacion'] = fecha;
        //   data[identificador+'usuariocreacion'] = 2;
        //   if(isExterno){
        //     data[externo+'id'] = objeto[externo+'id'];
        //   }
        //   Entidad.update({tabla:tabla, id:objeto[identificador+'id']}, data, function(result){
        //     $scope.cancelar(tabla);
        //     $rootScope.guardarBitacoraCRUD(true, true, false);
        //     cargar();
        //   });
        // }
      };

      $scope.editar = function(objeto, tabla){
        switch(tabla) {
          case 'zona':
            $scope.zona = objeto;
            $scope.disabledZona = false;
            break;
          case 'provincia':
            $scope.provincia = objeto;
            $scope.disabledProvincia = false;
            break;
          case 'canton':
            $scope.canton = objeto;
            $scope.disabledCanton = false;
            break;
          case 'parroquia':
            $scope.parroquia = objeto;
            $scope.disabledParroquia = false;
            break;
        }
      };

      $scope.eliminar = function(objeto, tabla, identificador){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto[identificador+'id'], true);
          Administracion.eliminar(tabla, identificador, objeto, function(result){
            //cargar();
            redireccionar(tabla);
          });
        }
      };

      $scope.nuevo = function(tabla, identificacion, idExt){
        switch(tabla) {
          case 'zona':
            $scope.zona ={
              zonid: 0,
              zondescripcion: '',
              zonestado: 1,
              zonfechacreacion: '',
              zonusuariocreacion: ''
            };
            $scope.disabledZona = false;
            break;
          case 'provincia':
            if(idExt){
              $scope.provincia = {
                provid: 0,
                provdescripcion: '',
                provestado: 1,
                provfechacreacion: '',
                provusuariocreacion: '',
                zonid: idExt
              };
              console.log($scope.provincia);
              $scope.disabledProvincia = false;
            }else{
              alert('Debe seleccionar una zona');
            }
            break;
          case 'canton':
            if(idExt){
              $scope.canton = {
                canid: 0,
                candescripcion: '',
                canestado: 1,
                canfechacreacion: '',
                canusuariocreacion: '',
                provid: idExt
              };
              $scope.disabledCanton = false;
            }else{
              alert('Debe seleccionar una provincia');
            }
            break;
          case 'parroquia':
            if(idExt){
              $scope.parroquia = {
                parid: 0,
                pardescripcion: '',
                parestado: 1,
                parfechacreacion: '',
                parusuariocreacion: '',
                canid: idExt
              };
              $scope.disabledParroquia = false;
            }else{
              alert('Debe seleccionar un canton');
            }
            break;
        }
      };

      $scope.cancelar = function(tabla){
        switch(tabla) {
          case 'zona':
            $scope.zona = {};
            $scope.disabledZona = true;
            break;
          case 'provincia':
            $scope.provincia = {};
            $scope.disabledProvincia = true;
            break;
          case 'canton':
            $scope.canton = {};
            $scope.disabledCanton = true;
            break;
          case 'parroquia':
            $scope.parroquia = {};
            $scope.disabledParroquia = true;
            break;
        }
      };

      $scope.getMaximoId =  function (objetos){
        var index = objetos.length;
        var id = 0;
        if(index > 0){
          objetos.sort();
          id = objetos[0].id;
          angular.forEach(objetos, function (objeto) {
            if(id < objeto.id){
              id = objeto.id;
            }
          });
          id = id + 1;
        }
        return id;
      };

      function cargar(){
        // $scope.zonas = Entidad.query({tabla:'zona'});
        Administracion.cargar('zona',function(objetos){
          console.log(objetos);
          $scope.zonas = objetos;
          $scope.zonas.sort();

          angular.forEach($scope.zonas, function(zona){
            zona.cssSelect = '';
            zona.select = false;
            $scope.provincias = [];
            $scope.provincia = {};
            $scope.cantones = [];
            $scope.canton = {};
            $scope.parroquias = [];
            $scope.parroquia = {};
          });
        });
      }

      $scope.cargarProvincias = function(zona){
        if(!zona.select){
          zona.select = true;
          zona.cssSelect = 'seleccionado';
          $scope.zonid = angular.copy(zona);
          getElementos(zona.zonid, 'provincia', 'zon', function(elementos){
            $scope.provincias = elementos;
          });
          // deseleccionar(zona, $scope.zonas, 'zon');
          // $scope.cantones = [];
          // $scope.canton = {};
          // $scope.parroquias = [];
          // $scope.parroquia = {};
        }else{
          zona.select = false;
          zona.cssSelect = '';
          $scope.provincias = [];
          $scope.provincia = {};
          $scope.cantones = [];
          $scope.canton = {};
          $scope.parroquias = [];
          $scope.parroquia = {};
        }
      };

      $scope.cargarCantones = function(provincia){
        if(!provincia.select){
          provincia.select = true;
          provincia.cssSelect = 'seleccionado';
          $scope.provid = angular.copy(provincia);
          console.log($scope.provid);
          getElementos(provincia.provid, 'canton', 'prov', function(elementos){
            $scope.cantones = elementos;
          });
          deseleccionar(provincia, $scope.provincias, 'prov');
          $scope.parroquias = [];
          $scope.parroquia = {};
        }else{
          provincia.select = false;
          provincia.cssSelect = '';
          $scope.cantones = [];
          $scope.canton = {};
          $scope.parroquias = [];
          $scope.parroquia = {};
        }
      };

      $scope.cargarParroquias = function(canton){
        if(!canton.select){
          canton.select = true;
          canton.cssSelect = 'seleccionado';
          $scope.canid = angular.copy(canton);
          getElementos(canton.canid, 'parroquia', 'can', function(elementos){
            $scope.parroquias = elementos;
          });
          deseleccionar(canton, $scope.cantones, 'can');
        }else{
          canton.select = false;
          canton.cssSelect = '';
          $scope.parroquias = [];
          $scope.parroquia = {};
        }
      };

      function getElementos(id, tabla, tipo, callback){
        array = [];
        Entidad.query({tabla:tabla, id:'cargar'}, function(elementos){
          angular.forEach(elementos, function(item){
            console.log(item);
            if(item[tipo+"id"][tipo+"id"] == id){
              array.push(angular.copy(item));
            }
          });
          callback(array);
        });
      }

      function deseleccionar(objeto, objetos, identificador){
        angular.forEach(objetos, function(item){
          console.log(item[identificador+'id'], objeto[identificador+'id']);
          if(item[identificador+'id'] != objeto[identificador+'id']){
            item.select = false;
            item.cssSelect = '';
          }
        });
      }

      function redireccionar(tabla){
        var usr = $cookieStore.get('usuario');
        if($localStorage.dataRedireccion){
          var redireccion = $localStorage.dataRedireccion[usr.usrid];
          if(redireccion){
            if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid)
              $location.path(redireccion.pantalla);
            else
              cargarSegunTabla(tabla);
          }else{
            cargarSegunTabla(tabla);
          }
        }else{
          cargarSegunTabla(tabla);
        }
      }

      function cargarSegunTabla(tabla){
        switch(tabla){
          case 'zona':
            cargar();
            break;
          case 'provincia':
            $scope.cargarProvincias($scope.zonid);
            break;
          case 'canton':
            $scope.cargarCantones($scope.provid);
            break;
          case 'parroquia':
            $scope.cargarParroquias($scope.canid);
            break;
        }
      }
  }
]);
