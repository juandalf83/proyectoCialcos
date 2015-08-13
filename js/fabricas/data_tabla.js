angular.module('DataTablaFactory', [])
.factory('DataTabla', function($resource){
  return $resource('http://localhost:8080/cialcoBackend/appcialcos/:tabla/:from/:to', {tabla:'@tabla', from:'@from', to:'@to'},{
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'update': {method:'PUT'},
    'query':  {method:'GET', isArray:true},
    'delete': {method:'DELETE'},
  });
});
