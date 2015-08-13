'use strict';

angular.module('cialcosApp')
  .factory('TareasResource', function($resource) {
    var factory = {
      iniciar: $resource('http://localhost:8080/cialcoBackend/appcialcos/usuario/:nombreUsuario/:clave', {nombreUsuario: '@nombreUsuario', clave: '@clave'}, {
        sesion: {method:'GET'}
      })
    };
    return factory;
  });