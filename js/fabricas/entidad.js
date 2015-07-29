angular.module('EntidadFactory', [])
.factory('Entidad', function($resource){
  return $resource('http://localhost:8080/cialcoBackend/appcialcos/:tabla/:id/:parametro/:parametro2', {tabla:'@tabla', id:'@id', parametro: '@parametro', parametro2: '@parametro2'},{
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'update': {method:'PUT'},
    'query':  {method:'GET', isArray:true},
    'delete': {method:'DELETE'},
  });
});
