'use strict';

angular.module('cialcosApp')
  .controller('InicioCtrl', function ($scope, $q, TareasResource, Entidad, $log, $cookieStore, $location) {
    var inicioSesion = $q.defer();

    inicioSesion.promise.then(usrASesion);
    function usrASesion(usr) {
      getPerfil(usr, function(perfil){
        $cookieStore.put('perfil', perfil);

        getUsuario(usr, function(valUsuario){
          console.log(valUsuario);
          $scope.usrConectado.nombre = valUsuario.usrnombrecompleto;
          $scope.usrConectado.estaConectado = true;

          $log.info($scope.usrConectado);

          $cookieStore.put('estaConectado', true);
          $cookieStore.put('usuario', valUsuario);
          getAcceso(usr, function(acceso){
            console.log("acc",acceso);
            $cookieStore.put('acceso', acceso);
          });
          $location.path('/bienvenida');
        });
      });
    }

    $scope.iniciarSesion = function() {
      var usr = TareasResource.iniciar.sesion({nombreUsuario: $scope.usuario.usuario, clave: $scope.usuario.clave})
        .$promise.then(function(usr) {
          inicioSesion.resolve(usr);
        });
    };

    function getPerfil(usuario, callback){
      var perfil = '';
      Entidad.query({tabla:'usuarioperfil'}).$promise.then(function(datos){
        angular.forEach(datos, function(item){
          if(usuario.usrid == item.usrid.usrid){
            callback(item.perid);
          }
        });
      });
    }

    function getAcceso(usuario, callback){
      var perfil = '';
      Entidad.query({tabla:'acceso'}).$promise.then(function(datos){
        angular.forEach(datos, function(item){
          console.log(item);
          if(usuario.usrid == item.usrid.usrid){
            callback(item);
          }
        });
      });
    }

    function getUsuario(usuario, callback){
      var perfil = '';
      Entidad.get({tabla:'usuario', id:usuario.usrid}, function(datos){
      console.log(datos);
        callback(datos);
      });
    }
  });
