angular.module('AdministracionDataFactory', [
  'EntidadFactory'
])
.factory('Administracion', ['Entidad', '$cookieStore', function(Entidad, $cookieStore){
  var factory = {};

  function getMaximoId(tabla, callback){
    var num = '';
    var count = Entidad.get({tabla:tabla, id:'numeroRegistros'}).$promise
      .then(function(data) {
        angular.forEach(data, function(item){
          if($.isNumeric(item))
            num += item;
        });
        callback(parseInt(num)+1);
      });
  }

  factory.guardar = function(tabla, identificador, objeto, callback){
    var fecha = new Date();
    var data = {};
    if(!objeto[identificador+'id']){
      getMaximoId(tabla, function(id){
        objeto[identificador+'id'] = id;
        objeto[identificador+'estado'] = 'A';
        objeto[identificador+'fechacreacion'] = fecha;
        usr = $cookieStore.get('usuario');
        objeto[identificador+'usuariocreacion'] = usr.usrid;
        Entidad.save({tabla:tabla},objeto).$promise
          .then(function(data) {
            callback(objeto[identificador+'id']);
          })
          .catch(function(error) {
            console.log("rejected " + JSON.stringify(error));
          });
      });
    }else{
      objeto[identificador+'estado'] = 'A';
      objeto[identificador+'fechacreacion'] = fecha;
      usr = $cookieStore.get('usuario');
      objeto[identificador+'usuariocreacion'] = usr.usrid;
      Entidad.update({tabla:tabla, id:objeto[identificador+'id']}, objeto).$promise
        .then(function(data) {
          callback(objeto[identificador+'id']);
        })
        .catch(function(error) {
          console.log("rejected " + JSON.stringify(error));
        });
    }
  };

  factory.eliminar = function(tabla, tipo, objeto, callback){
    var fecha = new Date();
    objeto[tipo+'estado'] = 'I';
    objeto[tipo+'fechacreacion'] = fecha;
    var usr = $cookieStore.get('usuario');
    objeto[tipo+'usuariocreacion'] = usr.usrid;
    objeto = angular.copy(objeto);
    Entidad.update({tabla:tabla, id:objeto[tipo+'id']}, objeto).$promise
      .then(function(data) {
        callback(data);
      })
      .catch(function(error) {
        console.log("rejected " + JSON.stringify(error));
      });
  };

  factory.cargar = function(tabla, callback){
    Entidad.query({tabla:tabla, id:'cargar'},function(objetos){
      objetos.sort();
      callback(objetos);
    });
  };

  return factory;
}]);
