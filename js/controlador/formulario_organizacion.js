$(document).on("focusin", ".datepicker", function () {
  $(this).datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
  });
});

angular.module('cialcosApp')
.controller('FormularioOrganizacionCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log', '$cookieStore', 'Administracion', 'tablaDinamica', '$localStorage',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $cookieStore, Administracion, tablaDinamica, $localStorage) {
      $scope.pantalla = "organizacion";
      $scope.estructuras = [];
      $scope.representantes = [];
      $scope.direcciones = [];
      $scope.error = false;
      $scope.textoError = '';

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.pantalla, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'organizacion'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(reg.orgid === undefined){
            $scope.titulo = "Ingreso de ";
            $scope.objeto = reg;
          }else{
            $scope.titulo = "Edicion de ";
            $scope.objeto = reg;
            $scope.objeto.orgfecharegistrosep = moment($scope.objeto.orgfecharegistrosep).format('YYYY-MM-DD');
            $scope.objeto.orgfechaacreditacionmagap = moment($scope.objeto.orgfechaacreditacionmagap).format('YYYY-MM-DD');

            var counts = [5, 10, 15];
            var count = 5;
            $scope.tablaEstructuras = tablaDinamica(count, counts, 'organizaestructura', $scope.objeto.orgid, 'oif', 'org', $scope);
            $scope.tablaRepresentantes = tablaDinamica(count, counts, 'usuarioorganizacion', $scope.objeto.orgid, 'uso', 'org', $scope);
            $scope.tablaDirecciones = tablaDinamica(count, counts, 'direccion', $scope.objeto.orgid, 'dir', 'org', $scope);

          }
        });
      }

      $scope.guardar = function(objeto, tipo){
        if(objeto.orgnombre){
          objeto.orgfecharegistrosep = new Date(objeto.orgfecharegistrosep);
          objeto.orgfechaacreditacionmagap = new Date(objeto.orgfechaacreditacionmagap);
          Administracion.guardar('organizacion', 'org', objeto, function(id){
            if($.isNumeric(id)){
              if(tipo == 'A'){
                $location.path("formulario_adicional_organizacion/"+id+"/true");
              }else{
                redireccionar("organizaciones");
              }
            }
          });
        }else{
          alert("EL CAMPO DESCRIPCION ES OBLIGATORIO");
        }
      };

      $scope.cancelar = function(objeto){
        redireccionar("organizaciones");
      };

      $scope.irOrganizacion = function(){
        //redireccionar("formulario_organizacion/"+$routeParams.id+"/"+$routeParams.editable);
        redireccionar("organizaciones");
      };

      $scope.open = function(tabla, fila) {
        var url = '';
        var controlador = '';
        var objetoTabla = '';
        switch(tabla){
          case 'usuarioorganizacion':
            url = 'html/utilitarios/representantes.html';
            controlador = ModalRepresentantesCtrl;
            objetoTabla = $scope.tablaRepresentantes;
            break;
          case 'direccion':
            url = 'html/utilitarios/direccion.html';
            controlador = ModalDireccionesCtrl;
            objetoTabla = $scope.tablaDirecciones;
            break;
          case 'organizaestructura':
            url = 'html/utilitarios/estructuras.html';
            controlador = ModalEstructuraCtrl;
            objetoTabla = $scope.tablaEstructuras;
            break;
        }

        openModal(url, fila, objetoTabla, controlador);
      };

      var ModalEstructuraCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        agregarCampos('inf', $scope.items.registro.infid);
        $scope.getInfraestructura = function(term, done){
          getListado ('infraestructura', 'inf', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('organizaestructura', 'oif', $scope.items.registro, $scope.items.organizacion, function(resultado){
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

      var ModalRepresentantesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        agregarCampos('inf', $scope.items.registro.infid);
        $scope.getUsuario = function(term, done){
          getListado ('usuario', 'usr', function(resultados){
            var usuarios = [];
            angular.forEach(resultados, function(item){
              console.log(item);
              if(item.tpuid.tpuid == 2){
                usuarios.push(item);
              }
            });
            done($filter('filter')(usuarios, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          console.log($scope.items.registro);
          guardarDatosAdicionales('usuarioorganizacion', 'uso', $scope.items.registro, $scope.items.organizacion, function(resultado){
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
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('direccion', 'dir', $scope.items.registro, $scope.items.organizacion, function(resultado){
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
                organizacion: angular.copy($scope.objeto)
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

      function guardarDatosAdicionales(tabla, tipo, objeto, organizacion, callback) {
        objeto.orgid = organizacion;
        Administracion.guardar(tabla, tipo, objeto, callback);
      }

      function getListado (tabla, tipo, callback){
        var resultados = [];
        Entidad.query({tabla:tabla}, function(data){
          values = angular.copy(data);
          for(var i = 0; i < values.length; i++){
            if(values[i][tipo+'estado'] == 'A'){
              values[i].id = values[i][tipo+'id'];
              if(tabla == 'usuario')
                values[i].text = values[i][tipo+'nombrecompleto'];
              else
                values[i].text = values[i][tipo+'descripcion'];
              resultados.push(values[i]);
            }
          }
          callback(resultados);
        });
      }

      function agregarCampos (tipo, objeto){
        if(objeto){
          objeto.text = objeto[tipo+'descripcion'];
          objeto.id = objeto[tipo+'id'];
        }
      }

      var irPantallaNuevo = function (tabla){
        var usr = $cookieStore.get('usuario');
        var data = {};
        registros = {
          respaldoUsuario: $scope.objeto,
          usuarioConectado: usr,
          irPantalla: true,
          tabla: 'organizacion',
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
        if(tabla == 'usuario')
          $location.path('formulario_usuario/0/true');
        if(tabla == 'parroquia')
          $location.path('territorios');
        else
          $location.path('formulario/0/'+tabla+'/true');
      };

      function redireccionar(urlRegresar){
        var usr = $cookieStore.get('usuario');
        if($localStorage.dataRedireccion){
          var redireccion = $localStorage.dataRedireccion[usr.usrid];
          if(redireccion){
            if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid)
              $location.path(redireccion.pantalla);
            else
              $location.path(urlRegresar);
          }else{
            $location.path(urlRegresar);
          }
        }else{
          $location.path(urlRegresar);
        }
      }

      $scope.validarRepetidos = function(objeto){
        if(objeto.orgnombre){
          Administracion.validarRepetidos($scope.pantalla, 'orgnombre', objeto.orgnombre,
          function(result){
            if(!result){
              objeto.orgnombre = '';
              $scope.error = true;
              $scope.textoError = 'LA ORGANIZACION INGRESADO YA EXISTE';
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
