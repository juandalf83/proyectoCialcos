angular.module('cialcosApp')
.controller('FormularioUsuariosCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log', '$q', 'MagapService','$cookieStore',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $q, MagapService, $cookieStore) {
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

      $scope.tiposIdentificacion = [
        {codigo: 'ci', text: 'Cedula'},
        {codigo: 'ruc', text: 'Ruc'},
      ];
      $scope.tiposUsuario = Entidad.query({tabla:'tipousuario'});
      $scope.etnias = Entidad.query({tabla:'etnia'});
      $scope.nivelEscolaridad = Entidad.query({tabla:'nivelescolaridad'});
      $scope.posesionTierras = Entidad.query({tabla:'posesiontierra'});
      $scope.tiposTelefono = Entidad.query({tabla:'tipotelefono'});
      $scope.tiposMail = Entidad.query({tabla:'tipomail'});
      $scope.destinosIngresos = Entidad.query({tabla:'destinoingresos'});
      $scope.apoyosproduccion = Entidad.query({tabla:'apoyoproduccion'});
      $scope.practicasProductivas = Entidad.query({tabla:'practicaproductiva'});
      $scope.usuarios = Entidad.query({tabla:'usuario'});

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.pantalla, id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          console.log(reg);
          if(reg.usrid === undefined){
            $scope.titulo = "Ingreso de ";
            $scope.objeto = reg;
            $scope.objeto.usrtipoidentificacion = 'ci';
          }else{
            $scope.titulo = "Edicion de ";
            $scope.objeto = reg;
            angular.forEach($scope.tiposUsuario, function(item){
              if(item.tpuid == $scope.objeto.tpuid.tpuid){
                $scope.objeto.tpuid = item;
              }
            });
            angular.forEach($scope.etnias, function(item){
              if(item.etnid == $scope.objeto.etnid.etnid){
                $scope.objeto.etnid = item;
              }
            });
            angular.forEach($scope.nivelEscolaridad, function(item){
              if(item.nieid == $scope.objeto.nieid.tpuid){
                $scope.objeto.nieid = item;
              }
            });
            angular.forEach($scope.posesionTierras, function(item){
              if(item.ptrid == $scope.objeto.ptrid.ptrid){
                $scope.objeto.ptrid = item;
              }
            });
            Entidad.query({tabla:'mail'}).$promise
              .then(function(data) {
                $scope.listaMails = angular.copy(data);
                angular.forEach($scope.listaMails, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.mails.push(item);
                  }
                });
                $scope.tablaEmails = crearTabla($scope.mails);
              });
            Entidad.query({tabla:'telefono'}).$promise
              .then(function(data) {
                $scope.listaTelefonos = angular.copy(data);
                angular.forEach($scope.listaTelefonos, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.telefonos.push(item);
                  }
                });
                $scope.tablaTelefonos = crearTabla($scope.telefonos);
              });
            Entidad.query({tabla:'direccion'}).$promise
              .then(function(data) {
                $scope.listaDirecciones = angular.copy(data);
                angular.forEach($scope.listaDirecciones, function(item){
                  if(item.usrid !== undefined){
                    if(item.usrid.usrid == $scope.objeto.usrid){
                      $scope.direcciones.push(item);
                    }
                  }
                });
                $scope.tablaDirecciones = crearTabla($scope.direcciones);
              });
            Entidad.query({tabla:'practicausuario'}).$promise
              .then(function(data) {
                $scope.listaPracticas = angular.copy(data);
                angular.forEach($scope.listaPracticas, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.practicas.push(item);
                  }
                });
                $scope.tablaPracticas = crearTabla($scope.practicas);
              });
            Entidad.query({tabla:'usuarioapoyo'}).$promise
              .then(function(data) {
                $scope.listaApoyo = angular.copy(data);
                angular.forEach($scope.listaApoyo, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.apoyos.push(item);
                  }
                });
                $scope.tablaApoyo = crearTabla($scope.apoyos);
              });
            Entidad.query({tabla:'destinoproduccion'}).$promise
              .then(function(data) {
                $scope.listaDestinos = angular.copy(data);
                angular.forEach($scope.listaDestinos, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.destinos.push(item);
                  }
                });
                $scope.tablaDestino = crearTabla($scope.destinos);
              });
            Entidad.query({tabla:'fuentesingresos'}).$promise
              .then(function(data) {
                $scope.listaFuentes = angular.copy(data);
                angular.forEach($scope.listaFuentes, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.fuentes.push(item);
                  }
                });
                $scope.tablaFuentes = crearTabla($scope.fuentes);
              });
            Entidad.query({tabla:'usuariodesingreso'}).$promise
              .then(function(data) {
                $scope.listaIngresos = angular.copy(data);
                angular.forEach($scope.listaIngresos, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.ingresos.push(item);
                  }
                });
                $scope.tablaIngresos = crearTabla($scope.ingresos);
              });
            Entidad.query({tabla:'usuarioproducto'}).$promise
              .then(function(data) {
                $scope.listaProductos = angular.copy(data);
                angular.forEach($scope.listaProductos, function(item){
                  if(item.usrid.usrid == $scope.objeto.usrid){
                    $scope.productos.push(item);
                  }
                });
                $scope.tablaProductos = crearTabla($scope.productos);
              });
          }
        });
      }

      $scope.guardar = function(objeto){
        var fecha = new Date();
        var data = {};
        if(objeto.usrid === undefined){
          var id = $scope.getMaximoId($scope.usuarios);
          objeto.usrid = id;
          if(objeto.usrtipoidentificacion == 'ci')
            objeto.usrnombrecompleto = objeto.usrprimernombre+" "+objeto.usrsegundonombre+" "+objeto.usrprimerapellido+" "+objeto.usrsegundoapellido;
          else
            objeto.usrnombrecompleto = objeto.usrrazonsocial;
          objeto.usrestado = 1;
          objeto.usrfechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.usrusuariocreacion = usr.usrid;
          objeto.usrfechanacimiento = new Date(objeto.usrfechanacimiento);
          var dia = objeto.usrfechanacimiento.getDate() + 1;
          objeto.usrfechanacimiento.setDate(dia);
          console.log(objeto);
          Entidad.save({tabla:$scope.pantalla},objeto).$promise
            .then(function(data) {
               console.log("ok");
               $scope.extras = true;
               $scope.persona = objeto;
               console.log($scope.persona);
            })
            .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
            });
        }else{
          if(objeto.usrtipoidentificacion == 'ci')
            objeto.usrnombrecompleto = objeto.usrprimernombre+" "+objeto.usrsegundonombre+" "+objeto.usrprimerapellido+" "+objeto.usrsegundoapellido;
          else
            objeto.usrnombrecompleto = objeto.usrrazonsocial;
          objeto.usrestado = 1;
          objeto.usrfechacreacion = fecha;
          usr = $cookieStore.get('usuario');
          objeto.usrusuariocreacion = usr.usrid;
          objeto.usrfechanacimiento = new Date(objeto.usrfechanacimiento);
          Entidad.update({tabla:$scope.pantalla, id:objeto.usrid}, data, function(result){
            $location.path("usuarios");
          });
        }
      };

      $scope.cancelar = function(objeto){
        $location.path("usuarios");
      };

      $scope.getMaximoId =  function (objetos){
        var index = objetos.length;
        var id = 1;
        if(index > 0){
          objetos.sort();
          id = objetos[0].usrid;
          angular.forEach(objetos, function (objeto) {
            if(id < objeto.usrid){
              id = objeto.usrid;
            }
          });
          id = id + 1;
        }
        return id;
      };

      $scope.validacionDocumento = function(objeto){
          if (validarDocumento(objeto.usridentificacion)){
            $scope.getDatosUsuario(objeto.usridentificacion);
          }else{
            objeto.usridentificacion = "";
            objeto.cssValido = "obligatorio";
          }
      };

      $scope.getDatosUsuario = function(identificacion){
        //Creamos la variable que contiene la url del webservice
        //Este es el mensaje SOAP, dentro de las etiquetas <CI>'+ $('#ci').val() +'</CI> hacemos uso de una función JQuery para obtener valor que está en el campo de texto
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://sinagap.magap.gob.ec/enlaces/Service.asmx?op=WBConsultaCed",true);
        xmlhttp.onreadystatechange = function() {
          console.log(xmlhttp);
          if (xmlhttp.readyState == 4) {
            alert(xmlhttp.responseText);
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

      $scope.irAdicionales = function(){
        $location.path("formulario_adicional_usuario/"+$routeParams.id+"/"+$routeParams.editable);
      };

      $scope.irUsuario = function(){
        $location.path("formulario_usuario/"+$routeParams.id+"/"+$routeParams.editable);
      };

      $scope.openMails = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/mails.html',
          controller: ModalMailsCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.mails.push(item);
          }
        });
      };

      var ModalMailsCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'tipomail'}).$promise
          .then(function(data) {
            $scope.tipos = angular.copy(data);
            angular.forEach($scope.tipos, function(item){
              if($scope.items.registro){
                if(item.tpmid == $scope.items.registro.tpmid.tpmid){
                  $scope.items.registro.tpmid = item;
                }
              }
            });
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.maiid === undefined){
            $scope.items.registro.maiid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.maiestado = 'A';
            $scope.items.registro.maifechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.maiusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'mail'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.maiestado = 'A';
            $scope.items.registro.maifechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.maiusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'mail', id:$scope.items.registro.maiid}, objeto).$promise
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
            id = $scope.items.registros[0].maiid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.maiid){
                id = objeto.maiid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openTelefonos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/telefonos.html',
          controller: ModalTelefonosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.telefonos.push(item);
          }
        });
      };

      var ModalTelefonosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'tipotelefono'}).$promise
          .then(function(data) {
            $scope.tipos = angular.copy(data);
            angular.forEach($scope.tipos, function(item){
              if($scope.items.registro){
                if(item.tptid == $scope.items.registro.tptid.tptid){
                  $scope.items.registro.tptid = item;
                }
              }
            });
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.tlfid === undefined){
            $scope.items.registro.tlfid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.tlfestado = 'A';
            $scope.items.registro.tlffechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.tlfusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'telefono'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.tlfestado = 'A';
            $scope.items.registro.tlffechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.tlfusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'telefono', id:$scope.items.registro.tlfid}, objeto).$promise
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
            id = $scope.items.registros[0].tlfid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.tlfid){
                id = objeto.tlfid;
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
                usuario:angular.copy($scope.objeto)
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
            $scope.items.registro.usrid = $scope.items.usuario;
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
            $scope.items.registro.usrid = $scope.items.usuario;
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

      $scope.openPracticas = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/practicas.html',
          controller: ModalPracticasCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.practicas.push(item);
          }
        });
      };

      var ModalPracticasCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'practicaproductiva'}).$promise
          .then(function(data) {
            $scope.practicasProductivas = angular.copy(data);
            angular.forEach($scope.practicasProductivas, function(item){
              if($scope.items.registro){
                if(item.pprid == $scope.items.registro.pprid.pprid){
                  $scope.items.registro.pprid = item;
                }
              }
            });
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.ppuid === undefined){
            $scope.items.registro.ppuid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.ppuestado = 'A';
            $scope.items.registro.ppufechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.ppuusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'practicausuario'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.ppuestado = 'A';
            $scope.items.registro.ppufechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.ppuusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'practicausuario', id:$scope.items.registro.ppuid}, objeto).$promise
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
            id = $scope.items.registros[0].ppuid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.ppuid){
                id = objeto.ppuid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openApoyos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/apoyos.html',
          controller: ModalApoyosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.apoyos.push(item);
          }
        });
      };

      var ModalApoyosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'apoyoproduccion'}).$promise
          .then(function(data) {
            $scope.apoyosProduccion = angular.copy(data);
            angular.forEach($scope.apoyosProduccion, function(item){
              if($scope.items.registro){
                if(item.apyid == $scope.items.registro.apyid.apyid){
                  $scope.items.registro.apyid = item;
                }
              }
            });
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.uapid === undefined){
            $scope.items.registro.uapid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.uapestado = 'A';
            $scope.items.registro.uapfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.uapusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'usuarioapoyo'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.uapestado = 'A';
            $scope.items.registro.uapfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.uapusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'mail', id:$scope.items.registro.uapid}, objeto).$promise
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
            id = $scope.items.registros[0].uapid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.uapid){
                id = objeto.uapid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openDestinos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/destinos.html',
          controller: ModalDestinosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.destinos.push(item);
          }
        });
      };

      var ModalDestinosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.depid === undefined){
            $scope.items.registro.depid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.depestado = 'A';
            $scope.items.registro.depfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.depusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'destinoproduccion'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.depestado = 'A';
            $scope.items.registro.depfechacreacion = fecha;
            usr = $cookieStore.get('destinoproduccion');
            $scope.items.registro.depusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'mail', id:$scope.items.registro.depid}, objeto).$promise
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
            id = $scope.items.registros[0].depid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.depid){
                id = objeto.depid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openFuentes = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/fuentes.html',
          controller: ModalFuentesCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.fuentes.push(item);
          }
        });
      };

      var ModalFuentesCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.finid === undefined){
            $scope.items.registro.finid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.finestado = 'A';
            $scope.items.registro.finfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.finusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'fuentesingresos'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.finestado = 'A';
            $scope.items.registro.finfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.finusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'fuentesingresos', id:$scope.items.registro.finid}, objeto).$promise
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
            id = $scope.items.registros[0].finid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.finid){
                id = objeto.finid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openIngresos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/destinosIngresos.html',
          controller: ModalIngresosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.ingresos.push(item);
          }
        });
      };

      var ModalIngresosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'destinoingresos'}).$promise
          .then(function(data) {
            $scope.destinosIngreso = angular.copy(data);
            angular.forEach($scope.destinosIngreso, function(item){
              if($scope.items.registro){
                if(item.deiid == $scope.items.registro.deiid.deiid){
                  $scope.items.registro.deiid = item;
                }
              }
            });
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.udiid === undefined){
            $scope.items.registro.udiid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.udiestado = 'A';
            $scope.items.registro.udifechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.udiusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'usuariodesingreso'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.udiestado = 'A';
            $scope.items.registro.udifechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.udiusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'usuariodesingreso', id:$scope.items.registro.udiid}, objeto).$promise
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
            id = $scope.items.registros[0].udiid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.udiid){
                id = objeto.udiid;
              }
            });
            id = id + 1;
          }
          return id;
        };
      };

      $scope.openProductos = function(filas, fila) {
        var urlAbs = $location.absUrl();
        posicion = urlAbs.indexOf('#');
        var urlBase = urlAbs.substr(0, posicion);
        var modalInstance = $modal.open({
          templateUrl: urlBase+'html/utilitarios/productos.html',
          controller: ModalProductosCtrl,
          resolve: {
            items: function() {
              return {
                registro: angular.copy(fila),
                registros: angular.copy(filas),
                usuario:angular.copy($scope.objeto)
              };
            }
          }
        });

        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function(item) {
          //$log.info('Modal dismissed at: ' + new Date());
          if(item != 'cancel'){
            $scope.productos.push(item);
          }
        });
      };

      var ModalProductosCtrl = function($scope, $modalInstance, items, Entidad) {
        $scope.items = items;
        $scope.items.editable = true;
        //$scope.items.objeto = {};

        Entidad.query({tabla:'producto'}).$promise
          .then(function(data) {
            $scope.listadoProductos = angular.copy(data);
            angular.forEach($scope.listadoProductos, function(item){
              if($scope.items.registro){
                if(item.prodid == $scope.items.registro.prodid.prodid){
                  $scope.items.registro.prodid = item;
                }
              }
            });
          });

        $scope.ok = function() {
          var fecha = new Date();
          var usr = '';
          if($scope.items.registro.uprid === undefined){
            $scope.items.registro.uprid = $scope.getIdFormulario();
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.uprestado = 'A';
            $scope.items.registro.uprfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.uprusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.save({tabla:'usuarioproducto'}, objeto).$promise
              .then(function(data) {
                $modalInstance.dismiss($scope.items.registro);
              })
              .catch(function(error) {
                console.log("rejected " + JSON.stringify(error));
              });
          }else{
            $scope.items.registro.usrid = $scope.items.usuario;
            $scope.items.registro.uprestado = 'A';
            $scope.items.registro.uprfechacreacion = fecha;
            usr = $cookieStore.get('usuario');
            $scope.items.registro.uprusuariocreacion = usr.usrid;
            objeto = angular.copy($scope.items.registro);
            Entidad.update({tabla:'usuarioproducto', id:$scope.items.registro.uprid}, objeto).$promise
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
            id = $scope.items.registros[0].uprid;
            angular.forEach($scope.items.registros, function (objeto) {
              if(id < objeto.uprid){
                id = objeto.uprid;
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

      $scope.agregarNuevo = function(tabla){
        $location.path('formulario/0/'+tabla+'/true');        
      }
  }
]);
