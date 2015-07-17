angular.module('cialcosApp')
.controller('FormularioOrganizacionCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log', '$cookieStore',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $cookieStore) {
      $scope.pantalla = "organizacion";
      $scope.estructuras = [];
      $scope.representantes = [];
      $scope.direcciones = [];

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.pantalla, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          console.log(reg);
          if(reg.orgid === undefined){
            $scope.titulo = "Ingreso de ";
            $scope.objeto = reg;
          }else{
            $scope.titulo = "Edicion de ";
            $scope.objeto = reg;
            $scope.objeto.orgfecharegistrosep = new Date($scope.objeto.orgfecharegistrosep);

            Entidad.query({tabla:'organizaestructura'}).$promise
              .then(function(data) {
                $scope.listaEstructuras = angular.copy(data);
                angular.forEach($scope.listaEstructuras, function(item){
                  if(item.orgid.orgid == $scope.objeto.orgid){
                    $scope.estructuras.push(item);
                  }
                });
                $scope.tablaEstructuras = crearTabla($scope.estructuras);
              });
            Entidad.query({tabla:'usuarioorganizacion'}).$promise
              .then(function(data) {
                $scope.listaUsuarios = angular.copy(data);
                angular.forEach($scope.listaUsuarios, function(item){
                  if(item.orgid.orgid == $scope.objeto.orgid){
                    $scope.representantes.push(item);
                  }
                });
                $scope.tablaRepresentantes = crearTabla($scope.representantes);
              });
            Entidad.query({tabla:'direccion'}).$promise
              .then(function(data) {
                $scope.listaDirecciones = angular.copy(data);
                angular.forEach($scope.listaDirecciones, function(item){
                  if(item.orgid !== undefined){
                    if(item.orgid.orgid == $scope.objeto.orgid){
                      $scope.direcciones.push(item);
                    }
                  }
                });
                $scope.tablaDirecciones = crearTabla($scope.direcciones);
              });
          }
        });
      }

      $scope.guardar = function(objeto){
        var fecha = new Date();
        var usr = '';
        console.log(objeto);
        if(objeto.orgid === undefined){
          objeto.orgid = getMaximoId();
          objeto.orgestado = 'A';
          objeto.orgfechacreacion = fecha;
          objeto.orgfecharegistrosep = new Date(objeto.orgfecharegistrosep);
          objeto.orgfechaacreditacionmagap = new Date(objeto.orgfechaacreditacionmagap);
          usr = $cookieStore.get('usuario');
          objeto.orgusuariocreacion = usr.usrid;
          console.log(objeto);
          Entidad.save({tabla:$scope.pantalla}, objeto).$promise
            .then(function(data) {
              $location.path("organizaciones");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.orgestado = 'A';
          objeto.orgfechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.orgusuariocreacion = usr.usrid;
          objeto.orgfecharegistrosep = new Date(objeto.orgfecharegistrosep);
          objeto.orgfechaacreditacionmagap = new Date(objeto.orgfechaacreditacionmagap);
          Entidad.update({tabla:$scope.pantalla, id:objeto.orgid}, objeto).$promise
            .then(function(data) {
              $location.path("organizaciones");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("organizaciones");
      };

      $scope.getMaximoId =  function (){
        var index = $scope.objetos.length;
        var id = 0;
        if(index > 0){
          $scope.objetos.sort();
          id = $scope.objetos[0].orgid;
          angular.forEach($scope.objetos, function (objeto) {
            if(id < objeto.orgid){
              id = objeto.orgid;
            }
          });
          id = id + 1;
        }
        return id;
      };

      // $scope.agregarFila = function(tabla) {
      //   array = $scope.emails;
      //   if(tabla == 'telefono'){
      //     array = $scope.telefonos;
      //   }
      //   var max = getMaximo(array);
      //   array.push({});
      //   console.log("agrega");
      // };
      //
      // $scope.eliminarFila = function (tabla, fila) {
      //   array = $scope.emails;
      //   if(tabla == 'telefono'){
      //     array = $scope.telefonos;
      //   }
      //   if (array.length > 0) {
      //     var index = array.indexOf(fila);
      //     array.splice(index, 1);
      //   }
      // };
      //
      // function getMaximo(array) {
      //   var maximo = 0;
      //   if (array.length > 0)
      //     maximo = array[0].orgid;
      //   angular.forEach(array, function(item, index) {
      //     if (item.orgid > maximo)
      //       maximo = item.orgid;
      //   });
      //   return  parseInt(maximo) + 1;
      // }

      $scope.irAdicionales = function(){
        $location.path("formulario_adicional_organizacion/"+$routeParams.id+"/"+$routeParams.editable);
      };

      $scope.irOrganizacion = function(){
        $location.path("formulario_organizacion/"+$routeParams.id+"/"+$routeParams.editable);
      };

      $scope.openEstructura = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/estructuras.html',
          controller: ModalEstructuraCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                organizacion:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.estructuras.push(item);
          }
        });
      };

      var ModalEstructuraCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'infraestructura'}).$promise
          .then(function(data) {
            $scope.infraestructuras = angular.copy(data);
            console.log($scope.items.registro);
            //if($scope.items.registro.orgid !== undefined){
                console.log($scope.infraestructuras);
                angular.forEach($scope.infraestructuras, function(item){
                  if($scope.items.registro){
                    if(item.infid == $scope.items.registro.infid.infid){
                      console.log(item);
                      $scope.items.registro.infid = item;
                    }
                  }
                });
            //}
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.oifid === undefined){
            $scope.items.registro.oifid = $scope.getIdFormulario();
            $scope.items.registro.orgid = $scope.items.organizacion;
            $scope.items.registro.oifestado = 'A';
            $scope.items.registro.oiffechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.oifusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'organizaestructura'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.orgid = $scope.items.organizacion;
            $scope.items.registro.oifestado = 'A';
            $scope.items.registro.oiffechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.oifusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'organizaestructura', id:$scope.items.registro.oifid}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.getIdFormulario =  function (){
          var index = 0;
          if($scope.items.registros !== undefined)
            index = $scope.items.registros.length;
          var id = 1;
          if(index > 0){
            $scope.items.registros.sort();
            id = $scope.items.registros[0].oifid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.oifid){
                id = objeto.oifid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openRepresentante = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/representantes.html',
          controller: ModalRepresentantesCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                organizacion:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item, accion) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            console.log(accion);
            if(accion == 'I')
              $scope.representantes.push(item);
            else{

            }
          }
        });
      };

      var ModalRepresentantesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'usuario'}).$promise
          .then(function(data) {
            $scope.usuarios = angular.copy(data);
            if($scope.items.registro.usrid !== undefined){
                angular.forEach($scope.usuarios, function(item){
                  if(item.usrid == $scope.items.registro.usrid.usrid){
                    $scope.items.registro.usrid = item;
                  }
                });
            }
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.usoid === undefined){
            $scope.items.registro.usoid = $scope.getIdFormulario();
            $scope.items.registro.orgid = $scope.items.organizacion;
            $scope.items.registro.usoestado = 'A';
            $scope.items.registro.usofechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.usousuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'usuarioorganizacion'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.orgid = $scope.items.organizacion;
            $scope.items.registro.usoestado = 'A';
            $scope.items.registro.usofechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.usousuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'usuarioorganizacion', id:$scope.items.registro.usoid}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.getIdFormulario =  function (){
          var index = 0;
          if($scope.items.registros !== undefined)
            index = $scope.items.registros.length;
          var id = 1;
          if(index > 0){
            $scope.items.registros.sort();
            id = $scope.items.registros[0].usoid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.usoid){
                id = objeto.usoid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openDirecciones = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/direccion.html',
          controller: ModalDireccionesCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                registrosCompletos: angular.copy($scope.listaDirecciones),
                organizacion:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.direcciones.push(item);
          }
        });
      };

      var ModalDireccionesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'tipodireccion'}).$promise
          .then(function(data) {
            $scope.tiposDireccion = angular.copy(data);
            console.log($scope.tiposDireccion);
            //if($scope.items.registro.orgid !== undefined){
                angular.forEach($scope.tiposDireccion, function(item){
                  if($scope.items.registro){
                    if(item.tdrid == $scope.items.registro.tdrid.tdrid){
                      $scope.items.registro.tdrid = item;
                    }
                  }
                });
            //}
          });

        Entidad.query({tabla:'parroquia'}).$promise
          .then(function(data) {
            $scope.parroquias = angular.copy(data);
            //if($scope.items.registro.orgid !== undefined){
                angular.forEach($scope.parroquias, function(item){
                  if($scope.items.registro){
                    if(item.parid == $scope.items.registro.parid.parid){
                      $scope.items.registro.parid = item;
                    }
                  }
                });
            //}
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.dirid === undefined){
            $scope.items.registro.dirid = $scope.getIdFormulario();
            $scope.items.registro.orgid = $scope.items.organizacion;
            $scope.items.registro.direstado = 'A';
            $scope.items.registro.dirfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.dirusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'direccion'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.orgid = $scope.items.organizacion;
            $scope.items.registro.direstado = 'A';
            $scope.items.registro.dirfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.dirusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'direccion', id:$scope.items.registro.dirid}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.getIdFormulario =  function (){
          var index = 0;
          if($scope.items.registrosCompletos !== undefined)
            index = $scope.items.registrosCompletos.length;
          var id = 1;
          if(index > 0){
            $scope.items.registros.sort();
            id = $scope.items.registrosCompletos[0].dirid;
            angular.forEach($scope.items.registrosCompletos, function (objeto) {
              if(id < objeto.dirid){
                id = objeto.dirid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      function crearTabla($registros){
        var data = $registros;
        return new ngTableParams({
          page: 1,
          count: 5,
          filter: {
            nombre: ''
          },
          sorting: {
            nombre: 'asc'
          }
        }, {
          total: data.length,
          getData: function($defer, params) {
            var filteredData = $filter('filter')(data, $scope.searchText);

            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

            params.total(orderedData.length);

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          },
          $scope: $scope

        });
      }
      function filter_by_fields(data) {
        var text = $scope.searchText;
        if (text) {
          var reg_exp = new RegExp(text, 'i');
          return !text || reg_exp.test(data.nombre) || reg_exp.test(data.descripcion);
        }
        return true;
      }

  }
]);
