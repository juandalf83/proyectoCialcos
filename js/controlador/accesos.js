angular.module('cialcosApp')
.controller('AccesosCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "acceso";
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
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'acceso'){
                  registro = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(registro.accid === undefined){
            $scope.objeto = {};
            $scope.titulo = "Ingreso de";
            $scope.objeto.accactualizar = '0';
            $scope.objeto.acceditar = '0';
            $scope.objeto.accconsultar = '0';
            $scope.objeto.acceliminar = '0';
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
            agregarCampos('usr', $scope.objeto.usrid);
            agregarCampos('pan', $scope.objeto.panid);
            console.log($scope.objeto);
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_accesos/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        Administracion.guardar($scope.tabla, 'acc', objeto, function(id){
          if($.isNumeric(id)){
            $location.path("accesos");
          }
        });
      };

      $scope.cancelar = function(objeto){
        $location.path("accesos");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.accid, true);
          Administracion.eliminar($scope.tabla, 'acc', objeto, function(result){
            cargar();
          });
        }
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
        });
      }

      $scope.getUsuarios = function(term, done){
        getListado ('usuario', 'usr', function(resultados){
          var usuarios = [];
          angular.forEach(resultados, function(result){
            if(result.tpuid.tpuid == 1 || result.tpuid.tpuid == 3)
              usuarios.push(result);
          });
          done($filter('filter')(usuarios, {text: term}, 'text'));
        });
      };
      $scope.getPantallas = function(term, done){
        var pantallas = [];
        if($scope.objeto.usrid){
          Administracion.getPerfilesUsuario($scope.objeto.usrid.usrid, function(perfiles){
            var perfil = perfiles[perfiles.length-1];
            Administracion.getMenuExtra(perfil.perid.perid, function(perfilesMenu){
              menus = angular.copy(perfilesMenu);
              angular.forEach(menus, function(item){
                if(item.menid.panid){
                  var pantalla = item.menid.panid;
                  pantalla.id = pantalla.panid;
                  pantalla.text = item.menid.mendescripcion;
                  pantallas.push(pantalla);
                }
              });
              done($filter('filter')(pantallas, {text: term}, 'text'));
            });
          });
        }else{
          alert("DEBE SELECCIONAR UN USUARIO");
        }
      };

      function getListado (tabla, tipo, callback){
        var resultados = [];
        Entidad.query({tabla:tabla}, function(data){
          values = angular.copy(data);
          for(var i = 0; i < values.length; i++){
            if(values[i][tipo+'estado'] == 'A'){
              values[i].id = values[i][tipo+'id'];
              if(tabla == 'usuario'){
                values[i].text = values[i][tipo+'nombrecompleto'];
              }else{
                values[i].text = values[i][tipo+'url'];
              }
              resultados.push(values[i]);
            }
          }
          callback(resultados);
        });
      }

      function agregarCampos (tipo, objeto){
        if(objeto){
          objeto.id = objeto[tipo+'id'];
          objeto.text = objeto[tipo+'url'];
          if(tipo == 'usr'){
            objeto.text = objeto[tipo+'nombrecompleto'];
          }
        }
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
          tabla: 'acceso',
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
        console.log($localStorage.dataRedireccion);
        if(tabla == 'usuario'){
          $location.path('formulario_usuario/0/true');
        }else{
          $location.path('formulario_pantalla/0/true');
        }
      };
  }
]);
