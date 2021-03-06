$(document).on("focusin", ".datepicker", function () {
  $(this).datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
  });
});

angular.module('cialcosApp')
.controller('FormularioUsuariosCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log', '$q', 'MagapService','$cookieStore','$localStorage', 'tablaDinamica', 'Administracion',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $q, MagapService, $cookieStore, $localStorage, tablaDinamica, Administracion) {
      $scope.pantalla = "usuario";
      $scope.mails = [];
      $scope.telefonos = [];
      $scope.direcciones = [];
      $scope.practicas = [];
      $scope.apoyos = [];
      $scope.destinos = [];
      $scope.fuentes = [];
      $scope.ingresos = [];
      $scope.productos = [];
      $scope.extras = false;
      $scope.errorPassword = false;
      $scope.errorIdentificacion = false;
      $scope.errorUsuario = false;
      $scope.errorConfirmacion = false;
      $scope.textoErrorPassword = '';
      $scope.textoErrorIdentificacion = '';
      $scope.textoErrorUsuario = '';
      $scope.textoErrorConfirmacion = '';
      $scope.confirmacion = {otraClave: ''};

      $scope.tiposIdentificacion = [
        {codigo: 'ci', text: 'Cedula'},
        {codigo: 'ruc', text: 'Ruc'},
      ];

      $scope.listaDirecciones = Entidad.query({tabla:'direccion'});
      $scope.usuarios = Entidad.query({tabla:'usuario'});

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.pantalla, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'usuario'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(reg.usrid === undefined){
            $scope.titulo = "Ingreso de ";
            $scope.objeto = reg;
            $scope.objeto.usrtipoidentificacion = 'ci';
          }else{
            $scope.titulo = "Edicion de ";
            $scope.objeto = reg;
            $scope.objeto.usrfechanacimiento = moment($scope.objeto.usrfechanacimiento).format('YYYY-MM-DD');
            agregarCampos('tpu', $scope.objeto.tpuid);
            agregarCampos('etn', $scope.objeto.etnid);
            agregarCampos('nie', $scope.objeto.nieid);
            agregarCampos('ptr', $scope.objeto.ptrid);

            var counts = [5, 10, 15];
	          var count = 5;
            $scope.tablaEmails = tablaDinamica(count, counts, 'mail', $scope.objeto.usrid, 'mai', 'usr', $scope);
            $scope.tablaTelefonos = tablaDinamica(count, counts, 'telefono', $scope.objeto.usrid, 'tlf', 'usr', $scope);
            $scope.tablaDirecciones = tablaDinamica(count, counts, 'direccion', $scope.objeto.usrid, 'dir', 'usr', $scope);
            $scope.tablaPracticas = tablaDinamica(count, counts, 'practicausuario', $scope.objeto.usrid, 'ppu', 'usr', $scope);
            $scope.tablaApoyo = tablaDinamica(count, counts, 'usuarioapoyo', $scope.objeto.usrid, 'uap', 'usr', $scope);
            $scope.tablaDestino = tablaDinamica(count, counts, 'destinoproduccion', $scope.objeto.usrid, 'dep', 'usr', $scope);
            $scope.tablaFuentes = tablaDinamica(count, counts, 'fuentesingresos', $scope.objeto.usrid, 'fin', 'usr', $scope);
            $scope.tablaIngresos = tablaDinamica(count, counts, 'usuariodesingreso', $scope.objeto.usrid, 'udi', 'usr', $scope);
            $scope.tablaProductos = tablaDinamica(count, counts, 'usuarioproducto', $scope.objeto.usrid, 'upr', 'usr', $scope);
          }
        });
      }

      $scope.guardar = function(objeto, tipo){
        var fecha = new Date();
        var data = {};
        var validar = true;
        var mensajeError = "Exiten datos obligatorios vacios";
        if(objeto.usrtipoidentificacion == 'ci'){
          if(objeto.usrprimernombre && objeto.usrsegundonombre && objeto.usrprimerapellido && objeto.usrsegundoapellido)
            objeto.usrnombrecompleto = objeto.usrprimernombre+" "+objeto.usrsegundonombre+" "+objeto.usrprimerapellido+" "+objeto.usrsegundoapellido;
          else
            validar = false;
        }else{
          if(objeto.usrrazonsocial)
            objeto.usrnombrecompleto = objeto.usrrazonsocial;
          else
            validar = false;
        }
        if(objeto.usrfechanacimiento){
          objeto.usrfechanacimiento = new Date(objeto.usrfechanacimiento);
        }

        if(validar){
          Administracion.guardar('usuario', 'usr', objeto, function(id){
            if($.isNumeric(id)){
              if(tipo == 'A'){
                $location.path("formulario_adicional_usuario/"+id+"/true");
              }else{
                redireccionar("usuarios");
              }
            }
          });
        }else{
          alert(mensajeError);
        }
      };

      $scope.cancelar = function(objeto){
        redireccionar("usuarios");
      };

      function redireccionar(urlRegresar){
        var usr = $cookieStore.get('usuario');
        if($localStorage.dataRedireccion){
          var redireccion = $localStorage.dataRedireccion[usr.usrid];
          if(redireccion){
            if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
              $location.path(redireccion.pantalla);
            }else{
              $location.path(urlRegresar);
            }
          }else{
            $location.path(urlRegresar);
          }
        }else{
          $location.path(urlRegresar);
        }
      }

      $scope.validacionDocumento = function(objeto){
        if(objeto.usridentificacion){
          //if (validarDocumento(objeto.usridentificacion)){
            validarRepetido(objeto);
            //$scope.getDatosUsuario(objeto.usridentificacion);
          //}
        }
      };

      $scope.getDatosUsuario = function(identificacion){
        //Creamos la variable que contiene la url del webservice
        //Este es el mensaje SOAP, dentro de las etiquetas <CI>'+ $('#ci').val() +'</CI> hacemos uso de una función JQuery para obtener valor que está en el campo de texto
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://sinagap.magap.gob.ec/enlaces/Service.asmx?op=WBConsultaCed",true);
        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4) {
            //alert(xmlhttp.responseText);
            // // http://www.terracoder.com convert XML to JSON
            // var json = XMLObjectifier.xmlToJSON(xmlhttp.responseXML);
            // var result = json.Body[0].GetQuoteResponse[0].GetQuoteResult[0].Text;
            // // Result text is escaped XML string, convert string to XML object then convert to JSON object
            // json = XMLObjectifier.xmlToJSON(XMLObjectifier.textToXML(result));
            // alert(symbol + ' Stock Quote: $' + json.Stock[0].Last[0].Text);
          }
        };
        xmlhttp.setRequestHeader("SOAPAction", "http://www.agricultura.gob.ec/WBConsultaCed");
        xmlhttp.setRequestHeader("Content-Type", "text/xml");
        var xml = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><WBConsultaCed xmlns="http://www.agricultura.gob.ec/"><cadena>'+identificacion+'</cadena></WBConsultaCed></soap:Body></soap:Envelope>';
        xmlhttp.send(xml);
          // MagapService.validarCedula(identificacion).then(function(response){
          //   console.log(response);
          // });
      };

      $scope.irUsuario = function(){
        //redireccionar("formulario_usuario/"+$routeParams.id+"/"+$routeParams.editable);
        redireccionar("usuarios");
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
        switch(tabla){
          case 'mail':
            url = 'html/utilitarios/mails.html';
            controlador = ModalMailsCtrl;
            objetoTabla = $scope.tablaEmails;
            break;
          case 'telefono':
            url = 'html/utilitarios/telefonos.html';
            controlador = ModalTelefonosCtrl;
            objetoTabla = $scope.tablaTelefonos;
            break;
          case 'direccion':
            url = 'html/utilitarios/direccion.html';
            controlador = ModalDireccionesCtrl;
            objetoTabla = $scope.tablaDirecciones;
            break;
          case 'practica':
            url = 'html/utilitarios/practicas.html';
            controlador = ModalPracticasCtrl;
            objetoTabla = $scope.tablaPracticas;
            break;
          case 'apoyo':
            url = 'html/utilitarios/apoyos.html';
            controlador = ModalApoyosCtrl;
            objetoTabla = $scope.tablaApoyo;
            break;
          case 'destino':
            url = 'html/utilitarios/destinos.html';
            controlador = ModalDestinosCtrl;
            objetoTabla = $scope.tablaDestino;
            break;
          case 'fuente':
            url = 'html/utilitarios/fuentes.html';
            controlador = ModalFuentesCtrl;
            objetoTabla = $scope.tablaFuentes;
            break;
          case 'ingreso':
            url = 'html/utilitarios/ingresos.html';
            controlador = ModalIngresosCtrl
            objetoTabla = $scope.tablaIngresos;
            break;
          case 'producto':
            url = 'html/utilitarios/productos.html';
            controlador = ModalProductosCtrl;
            objetoTabla = $scope.tablaProductos;
            break;
        }

        openModal(url, fila, objetoTabla, controlador);
      };

      var ModalMailsCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        agregarCampos('tpm', $scope.items.registro.tpmid);
        $scope.getTipoEmail = function(term, done){
          getListado ('tipomail', 'tpm', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('mail', 'mai', $scope.items.registro, $scope.items.usuario, function(resultado){
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

        $scope.validarEmail = function(objeto) {
          expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!expr.test(objeto.maidireccion)){
            alert("Error: La dirección de correo " + objeto.maidireccion + " es incorrecta.");
            objeto.maidireccion = "";
          }
        };
      };

      var ModalTelefonosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.getTiposTelefono = function(term, done){
          getListado ('tipotelefono', 'tpt', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('telefono', 'tlf', $scope.items.registro, $scope.items.usuario, function(resultado){
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
        $scope.items.canton = '';
        agregarCampos('tdr', $scope.items.registro.tdrid);
        $scope.getTipoDirecciones = function(term, done){
          getListado ('tipodireccion', 'tdr', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        agregarCampos('par', $scope.items.canton);
        $scope.getProvincias = function(term, done){
          getListado ('parroquia', 'par', function(resultados){
            var cantones = [];
            angular.forEach(resultados, function(item){
              item.canid.id = item.canid.canid;
              item.canid.text = item.canid.candescripcion;
              cantones[item.canid.canid] = item.canid;
            });
            done($filter('filter')(cantones, {text: term}, 'text'));
          });
        };

        agregarCampos('par', $scope.items.registro.parid);
        $scope.getParroquias = function(term, done){
          getListado ('parroquia', 'par', function(resultados){
            var parroquias = [];
            angular.forEach(resultados, function(item){
              if(item.canid.canid == $scope.items.canton.id){
                parroquias.push(item);
              }
            });
            done($filter('filter')(parroquias, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('direccion', 'dir', $scope.items.registro, $scope.items.usuario, function(resultado){
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

      var ModalPracticasCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('ppr', $scope.items.registro.pprid);
        $scope.getPracticas = function(term, done){
          getListado ('practicaproductiva', 'ppr', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('practicausuario', 'ppu', $scope.items.registro, $scope.items.usuario, function(resultado){
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

      var ModalApoyosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('apy', $scope.items.registro.apyid);
        $scope.getApoyo = function(term, done){
          getListado ('apoyoproduccion', 'apy', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('usuarioapoyo', 'uap', $scope.items.registro, $scope.items.usuario, function(resultado){
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

      var ModalDestinosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          $scope.items.registro.depporcentaje = parseFloat($scope.items.registro.depporcentaje);
          guardarDatosAdicionales('destinoproduccion', 'dep', $scope.items.registro, $scope.items.usuario, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

      };

      var ModalFuentesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          guardarDatosAdicionales('fuentesingresos', 'fin', $scope.items.registro, $scope.items.usuario, function(resultado){
            $modalInstance.dismiss(resultado);
          });
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      };

      var ModalIngresosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.getDestino = function(term, done){
          getListado ('destinoingresos', 'dei', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('usuariodesingreso', 'udi', $scope.items.registro, $scope.items.usuario, function(resultado){
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

      var ModalProductosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        agregarCampos('prod', $scope.items.registro.prodid);
        $scope.getProductos = function(term, done){
          getListado ('producto', 'prod', function(resultados){
            done($filter('filter')(resultados, {text: term}, 'text'));
          });
        };

        $scope.ok = function() {
          guardarDatosAdicionales('usuarioproducto', 'upr', $scope.items.registro, $scope.items.usuario, function(resultado){
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

      $scope.agregarNuevo = function(tabla){
        irPantallaNuevo(tabla);
      };

      $scope.getEtnias = function(term, done){
        getListado ('etnia', 'etn', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };
      $scope.getTiposUsuario = function(term, done){
        getListado ('tipousuario', 'tpu', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };
      $scope.getNivelesEscolaridad = function(term, done){
        getListado ('nivelescolaridad', 'nie', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };
      $scope.getPosesionTierras = function(term, done){
        getListado ('posesiontierra', 'ptr', function(resultados){
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
              if(tabla == 'producto'){
                values[i].text = values[i][tipo+'nombreproducto'];
              }else{
                values[i].text = values[i][tipo+'descripcion'];
              }
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

      function guardarDatosAdicionales(tabla, tipo, objeto, usuario, callback) {
        objeto.usrid = usuario;
        Administracion.guardar(tabla, tipo, objeto, callback);
      }

      function eliminar(tabla, tipo, objeto, callback){
        Administracion.eliminar(tabla, tipo, objeto, callback);
      }

      $scope.$watch('objeto.usrfechanacimiento', function (new_value, old_value) {
        if (new_value !== old_value) {
          var fechaActual = new Date();
          var fechaSelecionada = new Date(new_value);
          var anioActual = fechaActual.getFullYear();
          var anioSeleccionado = fechaSelecionada.getFullYear();
          var edad = anioActual - anioSeleccionado;
          $scope.objeto.usredad = edad;
        }
      }, true);

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
                usuario: angular.copy($scope.objeto)
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
        var usr = $cookieStore.get('usuario');
        var data = {};
        registros = {
          respaldoUsuario: $scope.objeto,
          usuarioConectado: usr,
          irPantalla: true,
          tabla: 'usuario',
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
        $location.path('formulario/0/'+tabla+'/true');
      };

      $scope.minimoLength = function(password){
        $scope.confirmacion.otraClave = '';
        $scope.errorConfirmacion = false;
        $scope.textoErrorConfirmacion = '';
        if(password.length < 6){
          $scope.errorPassword = true;
          $scope.textoErrorPassword = 'DEBE INGRESAR MINIMO 6 CARACTERES';
        }else{
          $scope.errorPassword = false;
          $scope.textoErrorPassword = '';
        }
      };

      $scope.validarUsuario = function(objeto){
        if(objeto.usrusuario){
          Administracion.validarRepetidos('usuario', 'usrusuario', objeto.usrusuario, function(result){
            if(!result){
              objeto.usrusuario = '';
              $scope.errorUsuario = true;
              $scope.textoErrorUsuario = 'EL NOMBRE DE USUARIO YA EXISTE';
            }else{
              $scope.errorUsuario = false;
              $scope.textoErrorUsuario = '';
            }
          });
        }
      };

      function validarRepetido(objeto){
        Administracion.validarRepetidos('usuario', 'usridentificacion', objeto.usridentificacion, function(result){
          if(!result){
            objeto.usridentificacion = '';
            $scope.errorIdentificacion = true;
            $scope.textoErrorIdentificacion = 'LA IDENTIFICACION INGRESADA YA EXISTE';
          }else{
            $scope.errorIdentificacion = false;
            $scope.textoErrorIdentificacion = '';
          }
        });
      }

      $scope.confirmarClave = function(password){
          $scope.errorConfirmacion = false;
          $scope.textoErrorConfirmacion = '';
          if($scope.objeto.usrcontrasenia != password){
            $scope.errorConfirmacion = true;
            $scope.textoErrorConfirmacion = "La contraseña no ha sido confirmada";
            $scope.objeto.usrcontrasenia = '';
            $scope.confirmacion.otraClave = '';
          }else{
            $scope.errorConfirmacion = false;
            $scope.textoErrorConfirmacion = '';
          }
      };

      $scope.minimoLengthConfirmacion = function(password){
        if(password.length < 6){
          $scope.errorConfirmacion = true;
          $scope.textoErrorConfirmacion = 'DEBE INGRESAR MINIMO 6 CARACTERES';
        }else{
          $scope.errorConfirmacion = false;
          $scope.textoErrorConfirmacion = '';
        }
      };
  }
]);
