angular.module('EntidadFactory', [])
.factory('Entidad', function($resource){
  return $resource('http://localhost:8080/cialcoBackend/appcialcos/:tabla/:id', {tabla:'@tabla', id:'@id'},{
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'update': {method:'PUT'},
    'query':  {method:'GET', isArray:true},
    'delete': {method:'DELETE'},
  });
});
