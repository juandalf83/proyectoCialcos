angular.module('AdministracionDataFactory', [
  'EntidadFactory'
])
.factory('Administracion', ['Entidad', '$cookieStore', function(Entidad, $cookieStore){
  var factory = {};

  function getMaximoId(tabla, callback){
    var num = 0;
    var numString = '';
    Entidad.get({tabla:tabla, id:'numeroRegistros'}).$promise
      .then(function(data) {
        console.log(data);
        angular.forEach(data, function(item){
          if($.isNumeric(item))
            numString += item;
        });
        if(numString)
          num = parseInt(numString);
        callback(num+1);
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
        if(identificador == 'vis'){
          objeto[identificador+'usuariocreacion'] = 0;
        }else{
          usr = $cookieStore.get('usuario');
          objeto[identificador+'usuariocreacion'] = usr.usrid;
        }
        console.log(objeto);
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

  factory.getMenuPerfil = function(idPerfil, callback){
    Entidad.query({tabla:'perfilmenu', id:'getMenu', parametro:idPerfil},function(objetos){
      objetos.sort();
      callback(objetos);
    });
  };

  factory.getMenuExtra = function(idPerfiles, callback){
    Entidad.query({tabla:'perfilmenu', id:'getItemsMenu', parametro:idPerfiles},function(objeto){
      callback(objeto);
    });
  };

  factory.countData = function(tabla, callback){
    var cantidadData = '';
    Entidad.get({tabla:tabla, id:'count'}).$promise
    .then(function(cantidad){
      angular.forEach(cantidad, function(item, index){
        if($.isNumeric(index))
          cantidadData += item;
      });
      callback(parseInt(cantidadData));
    });
  };

  factory.getPerfilesUsuario = function(idUsuario, callback){
    Entidad.query({tabla:'usuarioperfil', id:'getPerfil', parametro:idUsuario},function(objetos){
      callback(objetos);
    });
  };

  factory.guardarReturnObjeto = function(tabla, identificador, objeto, callback){
    var fecha = new Date();
    var data = {};
    if(!objeto[identificador+'id']){
      getMaximoId(tabla, function(id){
        objeto[identificador+'id'] = id;
        objeto[identificador+'estado'] = 'A';
        objeto[identificador+'fechacreacion'] = fecha;
        if(identificador == 'vis'){
          objeto[identificador+'usuariocreacion'] = 0;
        }else{
          usr = $cookieStore.get('usuario');
          objeto[identificador+'usuariocreacion'] = usr.usrid;
        }
        console.log(objeto);
        Entidad.save({tabla:tabla},objeto).$promise
          .then(function(data) {
            callback(objeto);
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
          callback(objeto);
        })
        .catch(function(error) {
          console.log("rejected " + JSON.stringify(error));
        });
    }
  };

  factory.getDetalleConsumidor = function(idConsumidor, callback){
    Entidad.query({tabla:'detalleconsumidor', id:'getDetalle', parametro:idConsumidor},function(objetos){
      callback(objetos);
    });
  };

  factory.getAccesoMenu = function(idUsuario, idPantalla, callback){
    Entidad.query({tabla:'acceso', id:'getAccesoMenu', parametro:idUsuario, parametro2: idPantalla},function(objetos){
      callback(objetos);
    });
  };

  return factory;
}]);
