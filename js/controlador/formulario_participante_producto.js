angular.module('cialcosApp')
.controller('FormularioParticipadorCtrl', ['$scope', '$window', '$modal', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$log', '$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $modal, $location, ngTableParams, $filter, Entidad, $routeParams, $log, $cookieStore, Administracion, $localStorage) {
      $scope.pantalla = "PARTICIPADOR PRODUCTO";
      $scope.objetos = Entidad.query({tabla:'participadorproducto'});


      $scope.getUsuarios = function(term, done){
        getListado ('participante', 'paf', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };
      $scope.getProductos = function(term, done){
        if($scope.objeto.pafid){
          $scope.productos = [];
          var unique = {};
          getListado ('usuarioproducto', 'upr', function(resultados){
            angular.forEach(resultados, function(item){
              if($scope.objeto.pafid.usrid.usrid == item.usrid.usrid){
                if (!unique[item.prodid.prodid]) {
                  $scope.productos.push(item);
                  unique[item.prodid.prodid] = item;
                }
              }
            });
            done($filter('filter')($scope.productos, {text: term}, 'text'));
          });
        }else{
          alert("Debe seleccionar un participante");
        }
      };

      $scope.getUnidadesMedida = function(term, done){
        getListado ('unidadmedida', 'ume', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      if($routeParams.id){
        $scope.editable = $routeParams.editable;
        Entidad.get({tabla:'participadorproducto', id:$routeParams.id}, function(item) {
          reg = angular.copy(item);
          var usr = $cookieStore.get('usuario');
          if($localStorage.dataRedireccion){
            var redireccion = $localStorage.dataRedireccion[usr.usrid];
            if(redireccion){
              if(redireccion.irPantalla && usr.usrid == redireccion.usuarioConectado.usrid){
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'participanteproducto'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(reg.papid === undefined){
            $scope.titulo = "INGRESO DE ";
            $scope.objeto = reg;
          }else{
            $scope.titulo = "EDICION DE ";
            $scope.objeto = reg;
            agregarCampos('paf', $scope.objeto.pafid);
            agregarCampos('upr', $scope.objeto.uprid);
            agregarCampos('ume', $scope.objeto.umeid);
          }
        });
      }

      $scope.guardar = function(objeto){
        objeto.papprecio = parseFloat(objeto.papprecio);
        objeto.papcantidad = parseFloat(objeto.papcantidad);
        objeto.papventacantidad = parseFloat(objeto.papventacantidad);
        objeto.papventatotal = parseFloat(objeto.papventatotal);
        Administracion.guardar('participadorproducto', 'pap', objeto, function(id){
          if($.isNumeric(id)){
            $location.path("participadorproducto");
          }
        });
      };

      $scope.cancelar = function(objeto){
        $location.path("participadorproducto");
      };

      function agregarCampos (tipo, objeto){
        if(objeto){
          if(tipo == 'org'){
            objeto.text = objeto[tipo+'nombre'];
          }else{
            if(tipo == 'usr'){
              objeto.text = objeto[tipo+'nombrecompleto'];
            }else{
              objeto.text = objeto[tipo+'descripcion'];
            }
          }
          objeto.id = objeto[tipo+'id'];
        }
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
              case 'usuarioproducto':
                values[i].text = values[i].prodid.prodnombreproducto;
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

      $scope.agregarNuevo = function (tabla){
        var usr = $cookieStore.get('usuario');
        var data = {};
        registros = {
          respaldoUsuario: $scope.objeto,
          usuarioConectado: usr,
          irPantalla: true,
          tabla: 'usuario',
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
        $location.path('formulario/0/'+tabla+'/true');
      };
  }
]);
