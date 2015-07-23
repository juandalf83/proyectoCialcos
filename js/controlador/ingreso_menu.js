angular.module('cialcosApp')
.controller('IngresoMenuCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "menu";
      $scope.objetos = [];
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'menu'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(registro.menid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            if(registro.menpadre){
              Entidad.get({tabla:$scope.tabla, id:registro.menpadre}, function(dato){
                padre = angular.copy(dato);
                padre.id = padre.menid;
                padre.text = padre.mendescripcion;
                registro.menpadre = padre;
                $scope.titulo = "Edicion de";
                $scope.objeto = registro;
                agregarCampos('pan', $scope.objeto.panid);
              });
            }else{
              $scope.titulo = "Edicion de";
              $scope.objeto = registro;
              agregarCampos('pan', $scope.objeto.panid);
            }
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_ingreso_menu/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        Administracion.guardar($scope.tabla, 'men', objeto, function(id){
          if($.isNumeric(id)){
            redireccionar("ingresomenu");
          }
        });
      };

      $scope.cancelar = function(objeto){
        redireccionar("ingresomenu");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Administracion.eliminar($scope.tabla, 'men', objeto, function(result){
            cargar();
          });
        }
      };

      $scope.getMenus = function(term, done){
        $scope.menusPadre = [];
        Entidad.query({tabla:$scope.tabla}, function(items){
          angular.forEach(items, function (item) {
            if(item.menid != $routeParams.id && item.menpadre != $routeParams.id){
              item.id = item.menid;
              item.text = item.mendescripcion;
              $scope.menusPadre.push(item);
            }
          });
          done($filter('filter')($scope.menusPadre, {text: term}, 'text'));
        });
      };
      $scope.getPantallas = function(term, done){
        getListado ('pantalla', 'pan', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          var objetosCopy = angular.copy(objetos);
          $scope.objetos = objetos;
          $scope.objetos.sort();
          angular.forEach($scope.objetos,function(objeto){
            angular.forEach(objetosCopy,function(objetoCopy){
              if(objeto.menpadre == objetoCopy.menid){
                objeto.padre = objetoCopy;
              }
            });
          });
        });
      }

      function getListado (tabla, tipo, callback){
        var resultados = [];
        Entidad.query({tabla:tabla}, function(data){
          values = angular.copy(data);
          for(var i = 0; i < values.length; i++){
            if(values[i][tipo+'estado'] == 'A'){
              values[i].id = values[i][tipo+'id'];
              values[i].text = values[i][tipo+'url'];
              resultados.push(values[i]);
            }
          }
          callback(resultados);
        });
      }

      $scope.agregarNuevo = function(tabla){
        irPantallaNuevo(tabla);
      };

      var irPantallaNuevo = function (tabla){
        var usr = $cookieStore.get('usuario');
        var data = {};
        registros = {
          respaldoUsuario: $scope.objeto,
          usuarioConectado: usr,
          irPantalla: true,
          tabla: 'menu',
          pantalla: $location.url()
        };
        if($localStorage.dataRedireccion){
          $localStorage.dataRedireccion[usr.usrid] = registros;
        }else{
          data[usr.usrid] = registros;
          $localStorage.$default({
            dataRedireccion: data
          });
        }
        $location.path('formulario_pantalla/0/true');
      };

      function redireccionar(urlRegresar){
        var usr = $cookieStore.get('usuario');
        if($localStorage.dataRedireccion){
          var redireccion = $localStorage.dataRedireccion[usr.usrid];
          if(redireccion){
            if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid)
              $location.path(redireccion.pantalla);
            else
              $location.path(urlRegresar);
          }else{
            $location.path(urlRegresar);
          }
        }else{
          $location.path(urlRegresar);
        }
      }

      function agregarCampos (tipo, objeto){
        if(objeto){
          console.log(objeto);
          objeto.id = objeto[tipo+'id'];
          objeto.text = objeto[tipo+'url'];
        }
      }

  }
]);
