angular.module('cialcosApp')
.controller('ConsumidoresCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "consumidores";
      $scope.objetos = [];
      $scope.detalles = [];
      $scope.productos = [];
      cargar();

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        $scope.isDetalle = false;
        Entidad.get({tabla:$scope.tabla, id:$routeParams.id}, function(item) {
          registro = angular.copy(item);
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'consumidores'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(registro.conid === undefined){
            $scope.titulo = "Ingreso de ";
          }else{
              $scope.titulo = "Edicion de ";
              $scope.objeto = registro;
              agregarCampos('usr', $scope.objeto.usrid);
              agregarCampos('paf', $scope.objeto.pafid);
              Administracion.getDetalleConsumidor($scope.objeto.conid, function(detalles){
                $scope.detalles = angular.copy(detalles);
                angular.forEach($scope.detalles, function(detalle){
                  console.log(detalle);
                  agregarCampos('pap', detalle.papid);
                });
              });
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_consumidores/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        var unique = {};
        var contador = 0;
        angular.forEach($scope.detalles, function(detalle){
          if (unique[detalle.papid]) {
            contador++;
          }else{
            unique[detalle.papid] = detalle;
          }
        });
        if(contador <= 1){
          Administracion.guardarReturnObjeto($scope.tabla, 'con', objeto, function(objeto){
            guadarDetalle(objeto);
          });
        }else{
          alert("Existen detalles repetidos");
        }
      };

      function guadarDetalle(objeto){
        var fecha = new Date();
        var usr = $cookieStore.get('usuario');
        var data = [];
        angular.forEach($scope.detalles, function(detalle){
          var item = angular.copy(detalle);
          item.conid = objeto;
          item.detfechacreacion = fecha;
          item.detestado = 'A';
          item.detusuariocreacion = usr.usrid;
          data.push(item);
        });
        Entidad.delete({tabla:'detalleconsumidor', id:objeto.conid}).$promise
        .then(function(result) {
          Entidad.save({tabla:'detalleconsumidor'}, data).$promise
            .then(function(data) {
              redireccionar("consumidores");
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        })
        .catch(function(error) {
          console.log("rejected " + JSON.stringify(error));
        });
      }

      $scope.cancelar = function(objeto){
        redireccionar("consumidores");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Administracion.eliminar($scope.tabla, 'con', objeto, function(result){
            cargar();
          });
        }
      };

      $scope.getConsumidores = function(term, done){
        getListado ('usuario', 'usr', function(resultados){
          console.log(resultados);
          var consumidores = [];
          angular.forEach(resultados, function(result){
            if(result.tpuid.tpuid == 4)
              consumidores.push(result);
          });
          done($filter('filter')(consumidores, {text: term}, 'text'));
        });
      };

      $scope.getProductores = function(term, done){
        getListado ('participante', 'paf', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      $scope.getProductos = function(term, done){
        getListado ('participadorproducto', 'pap', function(resultados){
          resultados.sort();
          var unique = {};
          var productos = [];
          angular.forEach(resultados, function(item){
            if($scope.objeto.pafid.pafid == item.pafid.pafid){
              if (!unique[item.uprid.prodid.prodid]) {
                productos.push(item);
                unique[item.uprid.prodid.prodid] = item;
              }
            }
          });
          console.log(resultados);
          done($filter('filter')(productos, {text: term}, 'text'));
        });
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          var objetosCopy = angular.copy(objetos);
          $scope.objetos = objetos;
          $scope.objetos.sort();
        });
      }

      function getListado (tabla, tipo, callback){
        var resultados = [];
        Entidad.query({tabla:tabla}, function(data){
          values = angular.copy(data);
          for(var i = 0; i < values.length; i++){
            if(values[i][tipo+'estado'] == 'A'){
              values[i].id = values[i][tipo+'id'];
              switch (tabla){
              case 'usuario':
                values[i].text = values[i][tipo+'nombrecompleto'];
                break;
              case 'participante':
                values[i].text = values[i].usrid.usrnombrecompleto;
                break;
              case 'participadorproducto':
                values[i].text = values[i].uprid.prodid.prodnombreproducto;
                break;
              default:
                values[i].text = values[i][tipo+'descripcion'];
                break;
              }
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
          tabla: 'consumidores',
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
        $location.path('formulario_usuario/0/true');
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
          objeto.id = objeto[tipo+'id'];
          if(tipo == "usr")
            objeto.text = objeto[tipo+'nombrecompleto'];
          else{
            if(tipo == "paf")
              objeto.text = objeto.usrid.usrnombrecompleto;
            else{
              console.log(objeto);
              objeto.text = objeto.uprid.prodid.prodnombreproducto;
            }
          }
        }
      }

      $scope.agregarDetalle = function(){
          if($scope.objeto && $scope.objeto.pafid){
            if(!$scope.detalles.length){
              $scope.isDetalle = true;
            }
            $scope.detalles.push({});
          }else{
            alert("Debe seleccionar un productor");
          }
      };

      $scope.eliminarDetalle = function(detalle){
        var index = $scope.detalles.indexOf(detalle);
        $scope.detalles.splice(index, 1);
        if(!$scope.detalles.length){
          $scope.isDetalle = false;
        }
      };

      $scope.seleccionProductor = function(){

      };
  }
]);
