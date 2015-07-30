angular.module('cialcosApp')
.controller('MenuCtrl', ['$scope', '$element', '$location', '$cookieStore', 'Entidad', '$rootScope', '$interval', 'Administracion',
  function($scope, $element, $location, $cookieStore, Entidad, $rootScope, $interval, Administracion) {
    $scope.usrConectado = {nombre: '', estaConectado: '', id: ''};
    $('.dropdown-toggle').dropdown();
    $rootScope.conMenu = true;
    $rootScope.cssConMenu = 'col-sm-6 col-md-9';
    $scope.baseUrl = "#/";
    $rootScope.mensajes = {
      ingresoMenu: 'INGRESA OPCION MENU ',
      crear: 'CREAR ',
      editar: 'EDITAR ',
      vizualizar: 'VISUALIZAR ',
      eliminar: 'ELIMINAR ',
    };
    $scope.bitacora = {
      usrid:'',
      menid:'',
      bitobservacion: '',
      bitfecha: '',
      bithora: '',
      bitfechacreacion: '',
      bitusuariocreacion: '',
      bitestado: ''
    };

    $scope.infoTabla = {
      'apoyoproduccion': 'APOYO PRODUCCION',
      'destinoingresos': 'DESTINO INGRESOS',
      'etnia': 'ETNIA',
      'nivelescolaridad': 'NIVELES ESCOLARIDAD',
      'practicaproductiva': 'PRACTICA PRODUCTIVA',
      'posesiontierra': 'POSESION TIERRA',
      'tipodireccion': 'TIPO DIRECCCION',
      'tipomail': 'TIPO EMAIL',
      'tipotelefono': 'TIPO TELEFONO',
      'tipousuario': 'TIPO USUARIO',
      'equipamientodisponible': 'EQUIPAMENTO DISPONIBLE',
      'frecuencia': 'FRECUENCIA',
      'infraestructura': 'INFRAESTRUCTURA',
      'movilizacion': 'MOVILIZACION',
      'parentesco': 'PARENTESCO',
      'procesocontratacion': 'PROCESO CONTRATACION',
      'tipocialco': 'TIPO CIALCO',
      'tipodifusion': 'TIPO DIFUSION',
      'tipoproducto': 'TIPO PRODUCTO',
      'unidadmedida': 'UNIDAD MEDIDA'
    };

    $scope.openSubMenu = function(item){
      if(item.isOpen){
        item.isOpen = false;
      }else{
        item.isOpen = true;
      }
    };

    $scope.irPantalla = function(item){
      var usr = $cookieStore.get('usuario');
      $scope.acceso = {};
      Administracion.getAccesoMenu(usr.usrid, item.pantallaId, function(acceso){
        accesoCopy = angular.copy(acceso);
        if(accesoCopy.length > 0){
          if(accesoCopy[0].accactualizar) accesoCopy[0].accactualizar = 1;
          else  accesoCopy[0].accactualizar = 0;
          if(accesoCopy[0].acceditar) accesoCopy[0].acceditar = 1;
          else accesoCopy.acceditar = 0;
          if(accesoCopy[0].acceliminar) accesoCopy[0].acceliminar = 1;
          else  accesoCopy[0].acceliminar = 0;
          if(accesoCopy[0].accconsultar) accesoCopy[0].accconsultar = 1;
          else  accesoCopy[0].accconsultar = 0;
          $scope.acceso = accesoCopy[0];
          $cookieStore.put('acceso', accesoCopy[0]);
        }
        console.log($scope.acceso);
        $rootScope.menuSeleccionado = item;
        $cookieStore.put('menuSeleccionado', item);
        $rootScope.guardarBitacora($rootScope.menuSeleccionado, $rootScope.mensajes.ingresoMenu+$rootScope.menuSeleccionado.nombre);
        $location.path(item.url);
      });
    };

    $scope.getInfoItem = function(url){
      console.log("url");
    };

    $rootScope.cargarMenu = function(){
      var usr = $cookieStore.get('usuario');
      var perfilUsuario = $cookieStore.get('perfil');
      var perfilesExtra = $cookieStore.get('perfilesExtra');
      $rootScope.menu = [];
      if (usr !== undefined) {
        $scope.perfilUsuario = perfilUsuario;
        $scope.usrConectado.id = usr.usrid;
        $scope.usrConectado.nombre = usr.usrnombrecompleto;
        $scope.usrConectado.estaConectado = true;
        perfiles = perfilesExtra.replace(/,+$/,'');
        Administracion.getMenuExtra(perfiles, function(perfilExtra){
          Administracion.getMenuPerfil(perfilUsuario.perid, function(perfilMenu){
            angular.forEach(perfilMenu, function(perfil){
              if(!perfil.menid.menpadre){
                if(perfil.pemestado == 'A'){
                  $scope.menu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, submenu: []});
                }else{
                  getItemExtra(perfilExtra, perfil.menid.menid, $scope.menu, 'menu');
                }
              }
            });
            angular.forEach(perfilMenu, function(perfil){
              angular.forEach($scope.menu, function(item){
                if(item.id == perfil.menid.menpadre){
                  if(!perfil.menid.panid){
                    if(perfil.pemestado == 'A'){
                      item.submenu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, submenu1: []});
                    }else{
                      getItemExtra(perfilExtra, perfil.menid.menid, item.submenu, 'submenu');
                    }
                  }else{
                    if(perfil.pemestado == 'A'){
                      item.submenu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, pantallaId: perfil.menid.panid.panid, url: perfil.menid.panid.panurl});
                    }else{
                      getItemExtra(perfilExtra, perfil.menid.menid, item.submenu, 'item');
                    }
                  }
                }
              });
            });
            angular.forEach(perfilMenu, function(perfil){
              angular.forEach($scope.menu, function(item){
                angular.forEach(item.submenu, function(subitem){
                  if(subitem.submenu1){
                    if(subitem.id == perfil.menid.menpadre){
                      if(perfil.pemestado == 'A'){
                        subitem.submenu1.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, pantallaId: perfil.menid.panid.panid, url: perfil.menid.panid.panurl});
                      }else{
                        getItemExtra(perfilExtra, perfil.menid.menid, subitem.submenu1, 'item');
                      }
                    }
                  }
                });
              });
            });

            $scope.menu.sort(function(a, b){
                if(a.nombre < b.nombre) return -1;
                if(a.nombre > b.nombre) return 1;
                return 0;
            });
          });
        });
      }
    };

    function getItemExtra(perfilesExtra, idMenu, menu, tipo){
      angular.forEach(perfilesExtra, function(perfil){
        if(perfil.menid.menid == idMenu){
          switch(tipo){
          case 'menu':
              menu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, submenu: []});
              break;
            case 'submenu':
              menu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, submenu1: []});
              break;
            case 'item':
              menu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, pantallaId: perfil.menid.panid.panid, url: perfil.menid.panid.panurl});
              break;
          }
        }
      });
    }

    $scope.salir = function() {
      $scope.usrConectado = {nombre: "", estaConectado: ''};
      $rootScope.conMenu = true;
      $rootScope.cssConMenu = 'col-sm-6 col-md-9';
      $cookieStore.remove('estaConectado');
      $cookieStore.remove('usuario');
      $rootScope.menu = [];
      $location.path('/');
    };

    function getDatos(tabla, callback){
      Entidad.query({tabla: tabla}, function(datos){
        callback(datos);
      });
    }

    $rootScope.guardarBitacora = function(menuSeleccionado, observacion){
      var usr = $cookieStore.get('usuario');
      Entidad.get({tabla:'usuario', id:usr.usrid}).$promise.then(function(data) {
        var usuario = angular.copy(data);
        recuperarMenu(usuario, menuSeleccionado, observacion);
      });
    };

    function recuperarMenu(usuario, menuSeleccionado, observacion){
      $scope.bitacora.usrid = usuario;
      Entidad.get({tabla:'menu', id:menuSeleccionado.id}).$promise.then(function(data) {
        $scope.bitacora.menid = data;

        guardarBit($scope.bitacora, observacion);
      });
    }

    function guardarBit(bitacora, observacion){
      var usr = $cookieStore.get('usuario');
      var fecha = new Date();
      var hora = fecha.getHours()+":"+fecha.getMinutes();
      bitacora.bitobservacion = observacion;
      bitacora.bitfecha = fecha;
      bitacora.bithora = hora;
      bitacora.bitfechacreacion = fecha;
      bitacora.bitusuariocreacion = usr.usrid;
      bitacora.bitestado = 'A';
      Entidad.save({tabla:'bitacora'}, bitacora);
    }

    $rootScope.guardarBitacoraCRUD = function(editable, id, eliminar){
      var menuSeleccionado = $cookieStore.get('menuSeleccionado');
      if(editable){
        if(id){
          $rootScope.guardarBitacora(menuSeleccionado, $rootScope.mensajes.editar+menuSeleccionado.nombre);
        }else{
          $rootScope.guardarBitacora(menuSeleccionado, $rootScope.mensajes.crear+menuSeleccionado.nombre);
        }
      }else{
        $rootScope.guardarBitacora(menuSeleccionado, $rootScope.mensajes.vizualizar+menuSeleccionado.nombre);
      }
      if(eliminar){
        $rootScope.guardarBitacora(menuSeleccionado, $rootScope.mensajes.eliminar+menuSeleccionado.nombre);
      }
    };

    $scope.showMensajeError = function(mensaje) {
        $scope.isErrorView = true;
        $scope.mensajeErrorView = mensaje;
        var intervalo = $interval(function() {
            $scope.mensajeErrorView = "";
            $scope.isErrorView = false;
            $interval.cancel(intervalo);
        }, 3000);
    };

    $scope.showMensajeErrorModal = function(item, mensaje) {
        item.isError = true;
        item.mensajeError = mensaje;
        var intervalo = $interval(function() {
            item.mensajeError = "";
            item.isError = false;
            $interval.cancel(intervalo);
        }, 3000);
    };

    $scope.irVisitante = function(){
      $rootScope.conMenu = false;
      $rootScope.cssConMenu = 'col-sm-12 col-md-12';
      $location.path('visitantes');
    };

    $scope.irMapa = function(){
      $rootScope.conMenu = false;
      $rootScope.cssConMenu = 'col-sm-12 col-md-12';
      $location.path('verMapa');
    };

  }
]);
