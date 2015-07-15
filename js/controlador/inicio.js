'use strict';

angular.module('cialcosApp')
  .controller('InicioCtrl', function ($scope, $q, TareasResource, Entidad, $log, $cookieStore, $location) {
    var inicioSesion = $q.defer();

    inicioSesion.promise.then(usrASesion);

    function usrASesion(usr) {
      console.log(usr);
      getPerfil(usr, function(perfil){
        $cookieStore.put('perfil', perfil);
      });
      getAcceso(usr, function(acceso){
        $cookieStore.put('acceso', acceso);
      });
      $scope.usrConectado.nombre = usr.usrnombrecompleto;
      $scope.usrConectado.estaConectado = true;

      $log.info($scope.usrConectado);

      $cookieStore.put('estaConectado', true);
      $cookieStore.put('usuario', usr);

      $location.path('/bienvenida');
    };

    $scope.iniciarSesion = function() {
      var usr = TareasResource.iniciar.sesion({nombreUsuario: $scope.usuario.usuario, clave: $scope.usuario.clave})
        .$promise.then(function(usr) {
          inicioSesion.resolve(usr);
        });
    };

    function getPerfil(usuario, callback){
      var perfil = '';
      var usuarioPerfil = Entidad.query({tabla:'usuarioperfil'}, function(datos){
        angular.forEach(usuarioPerfil, function(item){
          if(usuario.usrid == item.usrid.usrid){
            callback(item.perid);
          }
        });
      });
    }

    function getAcceso(usuario, callback){
      var perfil = '';
      Entidad.query({tabla:'acceso'}, function(datos){
        angular.forEach(datos, function(item){
          if(usuario.usrid == item.usrid.usrid){
            callback(item);
          }
        });
      });
    }
  });
