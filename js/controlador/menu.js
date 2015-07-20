angular.module('cialcosApp')
.controller('MenuCtrl', ['$scope', '$element', '$location', '$cookieStore', 'Entidad', '$rootScope', '$interval',
  function($scope, $element, $location, $cookieStore, Entidad, $rootScope, $interval) {
    $scope.usrConectado = {nombre: '', estaConectado: '', id: ''};
    $('.dropdown-toggle').dropdown();
    $scope.baseUrl = "#/";
    $scope.menu = [];
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
      $rootScope.menuSeleccionado = item;
      $cookieStore.put('menuSeleccionado', item);
      $rootScope.guardarBitacora($rootScope.menuSeleccionado, $rootScope.mensajes.ingresoMenu+$rootScope.menuSeleccionado.nombre);
      $location.path(item.url);
    };

    $scope.getInfoItem = function(url){
      console.log("url");
    };

    var usr = $cookieStore.get('usuario');
    var perfilUsuario = $cookieStore.get('perfil');
    var acceso = $cookieStore.get('acceso');
    console.log(usr);
    if (usr !== undefined) {
      $scope.perfilUsuario = perfilUsuario;
      $scope.acceso = acceso;
      $scope.usrConectado.id = usr.usrid;
      $scope.usrConectado.nombre = usr.nombrecompleto;
      $scope.usrConectado.estaConectado = true;
      console.log($scope.usrConectado);
      $scope.perfilesMenu = Entidad.query({tabla: 'perfilmenu'});
      $scope.perfilesMenu.$promise.then(function(perfilMenu){
        angular.forEach(perfilMenu, function(perfil){
          if(perfilUsuario.perid == perfil.perid.perid){
            if(!perfil.menid.menpadre){
              $scope.menu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, submenu: []});
            }else{
              angular.forEach($scope.menu, function(submenu){
                if(submenu.id == perfil.menid.menpadre){
                  if(!perfil.menid.panid){
                    submenu.submenu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, submenu1: []});
                  }else{
                    submenu.submenu.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, url: perfil.menid.panid.panurl});
                  }
                }
              });
              angular.forEach($scope.menu, function(menu){
                angular.forEach(menu.submenu, function(submenu){
                  if(submenu.submenu1){
                    if(submenu.id == perfil.menid.menpadre){
                      submenu.submenu1.push({id: perfil.menid.menid, nombre: perfil.menid.mendescripcion, url: perfil.menid.panid.panurl});
                    }
                  }
                });
              });
            }
          }
        });
      });
    }

    $scope.salir = function() {
      $scope.usrConectado = {nombre: "", estaConectado: ''};

      $cookieStore.remove('estaConectado');
      $cookieStore.remove('usuario');

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
      console.log($scope.bitacora);
      Entidad.get({tabla:'menu', id:menuSeleccionado.id}).$promise.then(function(data) {
        $scope.bitacora.menid = data;

        guardarBit($scope.bitacora, observacion);
      });
    }

    function guardarBit(bitacora, observacion){
      var fecha = new Date();
      var hora = fecha.getHours()+":"+fecha.getMinutes();
      bitacora.bitobservacion = observacion;
      bitacora.bitfecha = fecha;
      bitacora.bithora = hora;
      bitacora.bitfechacreacion = fecha;
      bitacora.bitusuariocreacion = usr.usrid;
      bitacora.bitestado = 'A';
      console.log(bitacora);
      Entidad.save({tabla:'bitacora'}, bitacora);
    }

    $rootScope.guardarBitacoraCRUD = function(editable, id, eliminar){
      var menuSeleccionado = $cookieStore.get('menuSeleccionado');
      console.log(menuSeleccionado.nombre);
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
        }, 8000);
    };

    $scope.showMensajeErrorModal = function(item, mensaje) {
        item.isError = true;
        item.mensajeError = mensaje;
        var intervalo = $interval(function() {
            item.mensajeError = "";
            item.isError = false;
            $interval.cancel(intervalo);
        }, 8000);
    };
  }
]);
