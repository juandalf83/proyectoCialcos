'use strict';

angular.module('cialcosApp')
  .controller('InicioCtrl', function ($scope, $q, TareasResource, Entidad, $log, $cookieStore, $location, $rootScope, Administracion) {
    var inicioSesion = $q.defer();
    $scope.mensajeError = '';
    $scope.isError = false;

    inicioSesion.promise.then(usrASesion);
    function usrASesion(usr) {
      getPerfil(usr, function(perfil){
        $cookieStore.put('perfil', perfil);

        getUsuario(usr, function(valUsuario){
          $scope.usrConectado.nombre = valUsuario.usrnombrecompleto;
          $scope.usrConectado.estaConectado = true;

          $log.info($scope.usrConectado);

          $cookieStore.put('estaConectado', true);
          $cookieStore.put('usuario', valUsuario);
          // getAcceso(usr, function(acceso){
          //   $cookieStore.put('acceso', acceso);
          // });
          $rootScope.cargarMenu();
          $location.path('/bienvenida');
        });
      });
    }

    $scope.iniciarSesion = function() {
      TareasResource.iniciar.sesion({nombreUsuario: $scope.usuario.usuario, clave: $scope.usuario.clave})
        .$promise.then(function(usr) {
          inicioSesion.resolve(usr);
        })
        .catch(function(fallback) {
          $scope.showMensajeError('USUARIO O CLAVE INCORRECTA');
        });
    };

    function getPerfil(usuario, callback){
      var perfil = {};
      var fechaActual = new Date();
      var perfiles = '';
      var crear = 0, editar = 0, consultar = 0, eliminar = 0;
      Administracion.getPerfilesUsuario(usuario.usrid, function(datos){
        for(var i = 0; i < datos.length; i++){
          var fechaPerfil = new Date(datos[i].upefechacaducidad);
          if(fechaActual <= fechaPerfil){
            perfiles += datos[i].perid.perid+",";
            if(datos[i].perid.percrear)
              crear += parseInt(datos[i].perid.percrear);
            if(datos[i].perid.pereditar)
              editar += parseInt(datos[i].perid.pereditar);
            if(datos[i].perid.perconsultar)
              consultar += parseInt(datos[i].perid.perconsultar);
            if(datos[i].perid.pereliminar)
              eliminar += parseInt(datos[i].perid.pereliminar);
          }
        }
        perfil = datos[datos.length-1].perid;
        if(crear >= 1) perfil.percrear = 1;
        else  perfil.percrear = 0;
        if(editar >= 1) perfil.pereditar = 1;
        else  perfil.pereditar = 0;
        if(consultar >= 1) perfil.perconsultar = 1;
        else  perfil.perconsultar = 0;
        if(eliminar >= 1) perfil.pereliminar = 1;
        else  perfil.pereliminar = 0;

        $cookieStore.put('perfilesExtra', perfiles);
        callback(perfil);
      });
    }

    function getAcceso(usuario, callback){
      var perfil = '';
      Entidad.query({tabla:'acceso'}).$promise.then(function(datos){
        angular.forEach(datos, function(item){
          if(usuario.usrid == item.usrid.usrid){
            callback(item);
          }
        });
      });
    }

    function getUsuario(usuario, callback){
      var perfil = '';
      Entidad.get({tabla:'usuario', id:usuario.usrid}, function(datos){
        callback(datos);
      });
    }
  });
