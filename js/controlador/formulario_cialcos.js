angular.module('cialcosApp')
.controller('FormularioCialcosCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log','$cookieStore',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $cookieStore) {
      $scope.pantalla = "cialco";
      $scope.organizaciones = [];
      $scope.difusiones = [];
      $scope.equipos = [];
      $scope.horarios = [];
      $scope.contratos = [];
      $scope.participantes = [];
      $scope.direcciones = [];
      $scope.registrado = false;

      $scope.objetos = Entidad.query({tabla:'cialco'});

      $scope.tiposCialco = Entidad.query({tabla:'tipocialco'});
      $scope.procesosContratacion = Entidad.query({tabla:'procesocontratacion'});
      $scope.frecuencias = Entidad.query({tabla:'frecuencia'});


      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.pantalla, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          console.log(reg);
          if(reg.ciaid === undefined){
            $scope.titulo = "Ingreso de ";
            $scope.objeto = reg;
          }else{
            $scope.titulo = "Edicion de ";
            $scope.registrado = true;
            $scope.objeto = reg;
            angular.forEach($scope.tiposCialco, function(item){
              if(item.tcoid == $scope.objeto.tcoid.tcoid){
                $scope.objeto.tcoid = item;
              }
            });
            angular.forEach($scope.procesosContratacion, function(item){
              if(item.ptaid == $scope.objeto.ptaid.ptaid){
                $scope.objeto.ptaid = item;
              }
            });
            angular.forEach($scope.frecuencias, function(item){
              if(item.freid == $scope.objeto.freid.freid){
                $scope.objeto.freid = item;
              }
            });

            Entidad.query({tabla:'difucioncialco'}).$promise
              .then(function(data) {
                $scope.difusionesCialco = angular.copy(data);
                angular.forEach($scope.difusionesCialco, function(item){
                  if(item.ciaid.ciaid == $scope.objeto.ciaid){
                    $scope.difusiones.push(item);
                  }
                });
                $scope.tablaDifusion = crearTabla($scope.difusiones);
              });
            Entidad.query({tabla:'cialcoorganizacion'}).$promise
              .then(function(data) {
                $scope.listaOrg = angular.copy(data);
                angular.forEach($scope.listaOrg, function(item){
                  if(item.ciaid.ciaid == $scope.objeto.ciaid){
                    $scope.organizaciones.push(item);
                  }
                });
                $scope.tablaOrganizaciones = crearTabla($scope.organizaciones);
              });

            Entidad.query({tabla:'equipocialco'}).$promise
              .then(function(data) {
                $scope.listaEquipos = angular.copy(data);
                angular.forEach($scope.listaEquipos, function(item){
                  if(item.ciaid.ciaid == $scope.objeto.ciaid){
                    $scope.equipos.push(item);
                  }
                });
                $scope.tablaEquipos = crearTabla($scope.equipos);
              });

            Entidad.query({tabla:'horario'}).$promise
              .then(function(data) {
                $scope.listaHorarios = angular.copy(data);
                angular.forEach($scope.listaHorarios, function(item){
                  if(item.ciaid.ciaid == $scope.objeto.ciaid){
                    $scope.horarios.push(item);
                  }
                });
                $scope.tablaHorarios = crearTabla($scope.horarios);
              });

            Entidad.query({tabla:'contratoadjudicados'}).$promise
              .then(function(data) {
                $scope.listaContratos = angular.copy(data);
                angular.forEach($scope.listaContratos, function(item){
                  if(item.ciaid.ciaid == $scope.objeto.ciaid){
                    $scope.contratos.push(item);
                  }
                });
                $scope.tablaContratos = crearTabla($scope.contratos);
              });

            Entidad.query({tabla:'participante'}).$promise
              .then(function(data) {
                $scope.listaParticipantes = angular.copy(data);
                angular.forEach($scope.listaParticipantes, function(item){
                  if(item.ciaid.ciaid == $scope.objeto.ciaid){
                    $scope.participantes.push(item);
                  }
                });
                $scope.tablaParcipantes = crearTabla($scope.participantes);
              });
            Entidad.query({tabla:'direccion'}).$promise
              .then(function(data) {
                $scope.listaDirecciones = angular.copy(data);
                angular.forEach($scope.listaDirecciones, function(item){
                  if(item.ciaid !== undefined){
                    if(item.ciaid.ciaid == $scope.objeto.ciaid){
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
        if(objeto.ciaid === undefined){
          objeto.ciaid = $scope.getMaximoId();
          objeto.ciacoordX = 0;
          objeto.ciacoordY = 0;
          objeto.ciacoordZ = 0;
          objeto.ciaestado = 1;
          objeto.ciafechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.ciausuariocreacion = usr.usrid;
          console.log(objeto);
          Entidad.save({tabla:$scope.pantalla}, objeto).$promise
            .then(function(data) {
              $location.path("cialcos");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }else{
          objeto.ciacoordX = 0;
          objeto.ciacoordY = 0;
          objeto.ciacoordZ = 0;
          objeto.ciaestado = 1;
          objeto.ciafechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.ciausuariocreacion = usr.usrid;
          Entidad.update({tabla:$scope.pantalla, id:objeto.ciaid}, objeto).$promise
            .then(function(data) {
              $location.path("cialcos");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        }
      };


      $scope.cancelar = function(objeto){
        $location.path("cialcos");
      };

      $scope.getMaximoId =  function (){
        var index = $scope.objetos.length;
        var id = 1;
        if(index > 0){
          $scope.objetos.sort();
          id = $scope.objetos[0].ciaid;
          angular.forEach($scope.objetos, function (objeto) {
            if(id < objeto.ciaid){
              id = objeto.ciaid;
            }
          });
          id = id + 1;
        }
        return id;
      };

      $scope.openDifusion = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/difusion.html',
          controller: ModalDifusionCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                cialco:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.difusiones.push(item);
          }
        });
      };

      var ModalDifusionCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'tipodifusion'}).$promise
          .then(function(data) {
            $scope.tiposDifusion = angular.copy(data);
            if($scope.items.registro.dfcid !== undefined){
                angular.forEach($scope.tiposDifusion, function(item){
                  if(item.tpdid == $scope.items.registro.tpdid.tpdid){
                    $scope.items.registro.tpdid = item;
                  }
                });
            }
          });

        $scope.ok = function() {
          var fecha = new Date();
          if($scope.items.registro.dfcid === undefined){
            $scope.items.registro.dfcid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.dfcestado = 1;
            $scope.items.registro.dfcfechacreacion = fecha;
            $scope.items.registro.dfcusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'difucioncialco'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.dfcestado = 1;
            $scope.items.registro.dfcfechacreacion = fecha;
            $scope.items.registro.dfcusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'difucioncialco', id:$scope.items.registro.dfcid}, objeto).$promise
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
            id = $scope.items.registros[0].dfcid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.dfcid){
                id = objeto.dfcid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openOrganizacion = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/organizacion.html',
          controller: ModalOrganizacionCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                cialco:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.organizaciones.push(item);
          }
        });
      };

      var ModalOrganizacionCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

      //$scope.listaOrganizaciones = Entidad.query({tabla:'organizacion'});
        Entidad.query({tabla:'organizacion'}).$promise
          .then(function(data) {
            $scope.listaOrganizaciones = angular.copy(data);
            if($scope.items.registro.orgid !== undefined){
                angular.forEach($scope.listaOrganizaciones, function(item){
                  if(item.orgid == $scope.items.registro.orgid.orgid){
                    $scope.items.registro.orgid = item;
                  }
                });
            }
          });

        $scope.ok = function() {
          var fecha = new Date();
          if($scope.items.registro.corid === undefined){
            $scope.items.registro.corid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.corestado = 1;
            $scope.items.registro.corfechacreacion = fecha;
            $scope.items.registro.corusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'cialcoorganizacion'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.corestado = 1;
            $scope.items.registro.corfechacreacion = fecha;
            $scope.items.registro.corusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'cialcoorganizacion', id:$scope.items.registro.dfcid}, objeto).$promise
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
            id = $scope.items.registros[0].corid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.corid){
                id = objeto.corid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openParticipantes = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/participantes.html',
          controller: ModalParticipantesCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                cialco:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.participantes.push(item);
          }
        });
      };

      var ModalParticipantesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        Entidad.query({tabla:'usuario'}).$promise
          .then(function(data) {
            $scope.listaUsuarios = angular.copy(data);
            if($scope.items.registro.usrid !== undefined){
                angular.forEach($scope.listaUsuarios, function(item){
                  if(item.usrid == $scope.items.registro.usrid.usrid){
                    $scope.items.registro.usrid = item;
                  }
                });
            }
          });

        Entidad.query({tabla:'frecuencia'}).$promise
          .then(function(data) {
            $scope.listaFrecuencias = angular.copy(data);
            if($scope.items.registro.freid !== undefined){
                angular.forEach($scope.listaFrecuencias, function(item){
                  if(item.freid == $scope.items.registro.freid.freid){
                    $scope.items.registro.freid = item;
                  }
                });
            }
          });

        Entidad.query({tabla:'movilizacion'}).$promise
          .then(function(data) {
            $scope.listaMovilizaciones = angular.copy(data);
            if($scope.items.registro.movid !== undefined){
                angular.forEach($scope.listaMovilizaciones, function(item){
                  if(item.movid == $scope.items.registro.movid.movid){
                    $scope.items.registro.movid = item;
                  }
                });
            }
          });

        Entidad.query({tabla:'parentesco'}).$promise
          .then(function(data) {
            $scope.listaParentescos = angular.copy(data);
            if($scope.items.registro.prcid !== undefined){
                angular.forEach($scope.listaParentescos, function(item){
                  if(item.prcid == $scope.items.registro.prcid.prcid){
                    $scope.items.registro.prcid = item;
                  }
                });
            }
          });

        $scope.ok = function() {
          var fecha = new Date();
          if($scope.items.registro.pafid === undefined){
            $scope.items.registro.pafid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.pafestado = 1;
            $scope.items.registro.paffechacreacion = fecha;
            $scope.items.registro.pafusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'participante'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.pafestado = 1;
            $scope.items.registro.paffechacreacion = fecha;
            $scope.items.registro.pafusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'participante', id:$scope.items.registro.pafid}, objeto).$promise
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
            id = $scope.items.registros[0].pafid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.pafid){
                id = objeto.pafid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };


      $scope.openEquipos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/equipos.html',
          controller: ModalEquiposCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                cialco:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.equipos.push(item);
          }
        });
      };

      var ModalEquiposCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        $scope.equipos = Entidad.query({tabla:'equipamientodisponible'});

        $scope.ok = function() {
          var fecha = new Date();
          if($scope.items.registro.eqcid === undefined){
            $scope.items.registro.eqcid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.eqcestado = 1;
            $scope.items.registro.eqcfechacreacion = fecha;
            $scope.items.registro.eqcusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'equipocialco'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.eqcestado = 1;
            $scope.items.registro.eqcfechacreacion = fecha;
            $scope.items.registro.eqcusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'equipocialco', id:$scope.items.registro.eqcid}, objeto).$promise
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
            id = $scope.items.registros[0].eqcid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.eqcid){
                id = objeto.eqcid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openHorarios = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/horarios.html',
          controller: ModalHorariosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                cialco:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.horarios.push(item);
          }
        });
      };

      var ModalHorariosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          var fecha = new Date();
          if($scope.items.registro.horid === undefined){
            $scope.items.registro.horid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.horestado = 1;
            $scope.items.registro.horfechacreacion = fecha;
            $scope.items.registro.horfechainicio = new Date($scope.items.registro.horfechainicio);
            $scope.items.registro.horfechafin = new Date($scope.items.registro.horfechafin);
            $scope.items.registro.horhorainicio = new Date($scope.items.registro.horhorainicio);
            $scope.items.registro.horhorafin = new Date($scope.items.registro.horhorafin);
            $scope.items.registro.horusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'horario'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.horestado = 1;
            $scope.items.registro.horfechacreacion = fecha;
            $scope.items.registro.horfechainicio = new Date($scope.items.registro.horfechainicio);
            $scope.items.registro.horfechafin = new Date($scope.items.registro.horfechafin);
            $scope.items.registro.horhorainicio = new Date($scope.items.registro.horhorainicio);
            $scope.items.registro.horhorafin = new Date($scope.items.registro.horhorafin);
            $scope.items.registro.horusuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'horario', id:$scope.items.registro.horid}, objeto).$promise
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
            id = $scope.items.registros[0].horid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.horid){
                id = objeto.horid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openContratos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/contratosAdjudicados.html',
          controller: ModalContratosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                cialco:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.contratos.push(item);
          }
        });
      };

      var ModalContratosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          var fecha = new Date();
          if($scope.items.registro.coaid === undefined){
            $scope.items.registro.coaid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.coaestado = 1;
            $scope.items.registro.coafechacreacion = fecha;
            $scope.items.registro.coausuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'contratoadjudicados'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.ciaid = $scope.items.cialco;
            $scope.items.registro.coaestado = 1;
            $scope.items.registro.coafechacreacion = fecha;
            $scope.items.registro.coausuariocreacion = 2;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'contratoadjudicados', id:$scope.items.registro.coaid}, objeto).$promise
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
            id = $scope.items.registros[0].coaid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.coaid){
                id = objeto.coaid;
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
                cialco:angular.copy($scope.objeto)
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
                angular.forEach($scope.tiposDireccion, function(item){
                  if($scope.items.registro){
                    if(item.tdrid == $scope.items.registro.tdrid.tdrid){
                      $scope.items.registro.tdrid = item;
                    }
                  }
                });
            });

          Entidad.query({tabla:'parroquia'}).$promise
            .then(function(data) {
              $scope.parroquias = angular.copy(data);
                angular.forEach($scope.parroquias, function(item){
                  if($scope.items.registro){
                    if(item.parid == $scope.items.registro.parid.parid){
                      $scope.items.registro.parid = item;
                    }
                  }
                });
            });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.dirid === undefined){
            $scope.items.registro.dirid = $scope.getIdFormulario();
            $scope.items.registro.ciaid = $scope.items.cialco;
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
            $scope.items.registro.ciaid = $scope.items.cialco;
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


      $scope.irAdicionales = function(){
        $location.path("formulario_adicional_cialco/"+$routeParams.id+"/"+$routeParams.editable);
      };

      // $scope.$watch('searchText', function() {
      //   $scope.tableParams.reload();
      //   $scope.tableParams.page(1);
      // }, true);

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

      $scope.irCialco = function(){
        $location.path("formulario_cialcos/"+$routeParams.id+"/"+$routeParams.editable);
      };
  }
]);
