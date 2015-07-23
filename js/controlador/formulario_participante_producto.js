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
              console.log($scope.objeto.pafid.usrid.usrid, item.usrid.usrid);
              if($scope.objeto.pafid.usrid.usrid == item.usrid.usrid){
                if (!unique[item.usrid.usrid]) {
                  console.log(item);
                  $scope.productos.push(item);
                  unique[item.usrid.usrid] = item;
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

      // Entidad.query({tabla:'participante'}).$promise
      //   .then(function(data) {
      //     $scope.participantes = data;
      //     Entidad.query({tabla:'usuarioproducto'}).$promise
      //       .then(function(data) {
      //         $scope.productos = [];
      //         angular.forEach($scope.participantes, function(participante){
      //           angular.forEach(data, function(item){
      //             if(participante.usrid.usrid == item.usrid.usrid){
      //               if (!unique[item.usrid.usrid]) {
      //                 $scope.productos.push(item);
      //                 unique[item.usrid.usrid] = item;
      //               }
      //             }
      //           });
      //         });
      //       });
      //   });
      // $scope.unidadesMedida = Entidad.query({tabla:'unidadmedida'});

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
        // var fecha = new Date();
        // var usr = '';
        // if(objeto.papid === undefined){
        //   objeto.papid = $scope.getMaximoId();
        //   objeto.papestado = 'A';
        //   objeto.papfechacreacion = fecha;
        //   usr = $cookieStore.get('usuario');
        //   objeto.papusuariocreacion = usr.usrid;
        //   console.log(objeto);
        //   Entidad.save({tabla:"participadorproducto"}, objeto).$promise
        //     .then(function(data) {
        //       $location.path("participadorproducto");
        //     })
        //     .catch(function(error) {
        //       console.log("rejected " + JSON.stringify(error));
        //     });
        // }else{
        //   objeto.papestado = 'A';
        //   objeto.papfechacreacion = fecha;
        //   usr = $cookieStore.get('usuario');
        //   objeto.papusuariocreacion = usr.usrid;
        //   Entidad.update({tabla:"participadorproducto", id:objeto.papid}, objeto).$promise
        //     .then(function(data) {
        //       $location.path("participadorproducto");
        //     })
        //     .catch(function(error) {
        //       console.log("rejected " + JSON.stringify(error));
        //     });
        // }
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
              if(tabla == 'organizacion'){
                values[i].text = values[i][tipo+'nombre'];
              }else{

                if(tabla == 'usuario'){
                  values[i].text = values[i][tipo+'nombrecompleto'];
                }
                if(tabla == 'participante'){
                  console.log(values[i].usrid.usrnombrecompleto);
                  values[i].text = values[i].usrid.usrnombrecompleto;
                }
                if(tabla == 'usuarioproducto'){
                  values[i].text = values[i].prodid.prodnombreproducto;
                }else{
                  values[i].text = values[i][tipo+'descripcion'];
                }
              }
              resultados.push(values[i]);
            }
          }
          callback(resultados);
        });
      }
  }
]);
