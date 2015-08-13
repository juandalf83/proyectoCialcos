$(document).on("focusin", ".datepicker", function () {
  $(this).datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
  });
});

angular.module('cialcosApp')
.controller('FormularioCialcosCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log','$cookieStore', 'Administracion', '$localStorage', 'tablaDinamica',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $cookieStore, Administracion, $localStorage, tablaDinamica) {
      $scope.pantalla = "cialco";
      $scope.registrado = false;
      $scope.error = false;
      $scope.textoError = '';

      $scope.objetos = Entidad.query({tabla:'cialco'});

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.pantalla, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'cialco'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(reg.ciaid === undefined){
            $scope.titulo = "Ingreso de ";
            $scope.objeto = reg;
          }else{
            $scope.titulo = "Edicion de ";
            $scope.registrado = true;
            $scope.objeto = reg;

            agregarCampos('tco', $scope.objeto.tcoid);
            agregarCampos('pta', $scope.objeto.ptaid);
            agregarCampos('fre', $scope.objeto.freid);

            var counts = [5, 10, 15];
            var count = 5;
            $scope.tablaDifusion = tablaDinamica(count, counts, 'difucioncialco', $scope.objeto.ciaid, 'dfc', 'cia', $scope);
            $scope.tablaOrganizaciones = tablaDinamica(count, counts, 'cialcoorganizacion', $scope.objeto.ciaid, 'cor', 'cia', $scope);
            $scope.tablaEquipos = tablaDinamica(count, counts, 'equipocialco', $scope.objeto.ciaid, 'eqc', 'cia', $scope);
            $scope.tablaHorarios = tablaDinamica(count, counts, 'horario', $scope.objeto.ciaid, 'hor', 'cia', $scope);
            $scope.tablaContratos = tablaDinamica(count, counts, 'contratoadjudicados', $scope.objeto.ciaid, 'coa', 'cia', $scope);
            $scope.tablaParcipantes = tablaDinamica(count, counts, 'participante', $scope.objeto.ciaid, 'paf', 'cia', $scope);
            $scope.tablaDirecciones = tablaDinamica(count, counts, 'direccion', $scope.objeto.ciaid, 'dir', 'cia', $scope);
          }
        });
      }

      $scope.guardar = function(objeto, tipo){
        if(objeto.ciadescripcion){
          objeto.ciacoordX = 0;
          objeto.ciacoordY = 0;
          objeto.ciacoordZ = 0;
          Administracion.guardar($scope.pantalla, 'cia', objeto, function(id){
            if($.isNumeric(id)){
              if(tipo == 'A'){
                $location.path("formulario_adicional_cialco/"+id+"/true");
              }else{
                $location.path("cialcos");
              }
            }
          });
        }else{
          alert("EL CAMPO DESCRIPCION ES OBLIGATORIO");
        }
      };


      $scope.cancelar = function(objeto){
        $location.path("cialcos");
      };

      $scope.eliminarLista = function(registro, tabla, tipo, objetoTabla){
        eliminar(tabla, tipo, registro, function(resultado){
          objetoTabla.reload();
        });
      };

      $scope.open = function(tabla, fila) {
        var url = '';
        var controlador = '';
        var objetoTabla = '';
        console.log(tabla);
        switch(tabla){
          case 'difucioncialco':
            url = 'html/utilitarios/difusion.html';
            controlador = ModalDifusionCtrl;
            objetoTabla = $scope.tablaDifusion;
            break;
          case 'cialcoorganizacion':
            url = 'html/utilitarios/organizacion.html';
            controlador = ModalOrganizacionCtrl;
            objetoTabla = $scope.tablaOrganizaciones;
            break;
          case 'equipocialco':
            url = 'html/utilitarios/equipos.html';
            controlador = ModalEquiposCtrl;
            objetoTabla = $scope.tablaEquipos;
            break;
          case 'horario':
            url = 'html/utilitarios/horarios.html';
            controlador = ModalHorariosCtrl;
            objetoTabla = $scope.tablaHorarios;
            break;
          case 'contratoadjudicados':
            url = 'html/utilitarios/contratosAdjudicados.html';
            controlador = ModalContratosCtrl;
            objetoTabla = $scope.tablaContratos;
            break;
          case 'participante':
            url = 'html/utilitarios/participantes.html';
            controlador = ModalParticipantesCtrl;
            objetoTabla = $scope.tablaParcipantes;
            break;
          case 'direccion':
            url = 'html/utilitarios/direccion.html';
            controlador = ModalDireccionesCtrl;
            objetoTabla = $scope.tablaDirecciones;
            break;
        }
        openModal(url, fila, objetoTabla, controlador);
      };

      var ModalDifusionCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('tpd', $scope.items.registro.tpdid);
        $scope.getTiposDifusion = function(term, done){
          getListado ('tipodifusion', 'tpd', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('difucioncialco', 'dfc', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      var ModalOrganizacionCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('org', $scope.items.registro.orgid);
        $scope.getOrganizaciones = function(term, done){
          getListado ('organizacion', 'org', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('cialcoorganizacion', 'cor', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      var ModalParticipantesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('usr', $scope.items.registro.usrid);
        $scope.getUsuarios = function(term, done){
          getListado ('usuario', 'usr', function(resultados){
            var productores = [];
            angular.forEach(resultados, function(result){
              if(result.tpuid.tpuid == 2)
                productores.push(result);
            });
            done($filter('filter')(productores, {text: term}, 'text'));
          });
        };

        agregarCampos('fre', $scope.items.registro.freid);
        $scope.getFrecuencias = function(term, done){
          getListado ('frecuencia', 'fre', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        agregarCampos('mov', $scope.items.registro.movid);
        $scope.getMovilizaciones = function(term, done){
          getListado ('movilizacion', 'mov', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        agregarCampos('prc', $scope.items.registro.prcid);
        $scope.getParentescos = function(term, done){
          getListado ('parentesco', 'prc', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('participante', 'paf', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      var ModalEquiposCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('eqd', $scope.items.registro.eqdid);
        $scope.getEquipos = function(term, done){
          getListado ('equipamientodisponible', 'eqd', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('equipocialco', 'eqc', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      var ModalHorariosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          $scope.items.registro.horfechainicio = new Date($scope.items.registro.horfechainicio);
          $scope.items.registro.horfechafin = new Date($scope.items.registro.horfechafin);
          $scope.items.registro.horhorainicio = new Date($scope.items.registro.horhorainicio);
          $scope.items.registro.horhorafin = new Date($scope.items.registro.horhorafin);

          guardarDatosAdicionales('horario', 'hor', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      var ModalContratosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          guardarDatosAdicionales('contratoadjudicados', 'coa', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      var ModalDireccionesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.getTipoDirecciones = function(term, done){
          getListado ('tipodireccion', 'tdr', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };
        $scope.getParroquias = function(term, done){
          getListado ('parroquia', 'par', function(resultados){
            angular.forEach(resultados, function(item){
              item.text = item.canid.provid.provdescripcion+" / "+item.canid.candescripcion+" / "+item.pardescripcion;
            });
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('direccion', 'dir', $scope.items.registro, $scope.items.cialco, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        $scope.agregarNuevo = function(tabla){
          $modalInstance.dismiss('cancel');
          irPantallaNuevo(tabla);
        };
      };

      $scope.irCialco = function(){
        //$location.path("formulario_cialcos/"+$routeParams.id+"/"+$routeParams.editable);
        $location.path("cialcos");
      };

      $scope.agregarNuevo = function(tabla){
        console.log(tabla);
        irPantallaNuevo(tabla);
      };

      $scope.getTiposCialcos = function(term, done){
        getListado ('tipocialco', 'tco', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      $scope.getProcesosContratacion = function(term, done){
        getListado ('procesocontratacion', 'pta', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      $scope.getFrecuencia = function(term, done){
        getListado ('frecuencia', 'fre', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      function getListado (tabla, tipo, callback){
        var resultados = [];
        Entidad.query({tabla:tabla}, function(data){
          values = angular.copy(data);
          for(var i = 0; i < values.length; i++){
            if(values[i][tipo+'estado'] == 'A'){
              values[i].id = values[i][tipo+'id'];
              if(tabla == 'organizacion'){
                values[i].text = values[i][tipo+'nombre'];
              }else{
                if(tabla == 'usuario'){
                  values[i].text = values[i][tipo+'nombrecompleto'];
                }else{
                  values[i].text = values[i][tipo+'descripcion'];
                }
              }
              resultados.push(values[i]);
            }
          }
          callback(resultados);
        });
      }

      function agregarCampos (tipo, objeto){
        if(objeto){
          if(tipo == 'org'){
            objeto.text = objeto[tipo+'nombre'];
          }else{
            if(tipo == 'usr'){
              objeto.text = objeto[tipo+'nombrecompleto'];
            }else{
              objeto.text = objeto[tipo+'descripcion'];
            }
          }
          objeto.id = objeto[tipo+'id'];
        }
      }

      function guardarDatosAdicionales(tabla, tipo, objeto, cialco, callback) {
        objeto.ciaid = cialco;
        Administracion.guardar(tabla, tipo, objeto, callback);
      }

      function eliminar(tabla, tipo, objeto, callback){
        Administracion.eliminar(tabla, tipo, objeto, callback);
      }

      function openModal(url, fila, tablaModal, modalCtrl) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+url,
          controller: modalCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                cialco: angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          if(item != 'cancel'){
            tablaModal.reload();
          }
        });
      }

      var irPantallaNuevo = function (tabla){
        console.log(tabla);
        var usr = $cookieStore.get('usuario');
        var data = {};
        registros = {
          respaldoUsuario: $scope.objeto,
          usuarioConectado: usr,
          irPantalla: true,
          tabla: 'cialco',
          pantalla: $location.url()
        };
        if($localStorage.dataRedireccion){
          $localStorage.dataRedireccion[usr.usrid] = registros;
        }else{
          data[usr.usrid] = registros;
          $localStorage.$default({
            dataRedireccion: data
          });
        }
        if(tabla == 'organizacion'){
          $location.path('formulario_organizacion/0/true');
        }
        if(tabla == 'usuario'){
          $location.path('formulario_usuario/0/true');
        }else{
          $location.path('formulario/0/'+tabla+'/true');
        }
      };

      $scope.validarRepetidos = function(objeto){
        if(objeto.ciadescripcion){
          Administracion.validarRepetidos($scope.pantalla, 'ciadescripcion', objeto.ciadescripcion,
          function(result){
            if(!result){
              objeto.ciadescripcion = '';
              $scope.error = true;
              $scope.textoError = 'EL CIALCO INGRESADO YA EXISTE';
            }else{
              $scope.error = false;
              $scope.textoError = '';
            }
          });
        }else{
          $scope.error = false;
          $scope.textoError = '';
        }
      };
  }
]);
