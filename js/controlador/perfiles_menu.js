angular.module('cialcosApp')
.controller('PerfilesMenuCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "perfilmenu";
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
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'perfilmenu'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(registro.pemid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
            agregarCampos('per', $scope.objeto.perid);
            agregarCampos('men', $scope.objeto.menid);
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_perfil_menu/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        Administracion.guardar($scope.tabla, 'pem', objeto, function(id){
          if($.isNumeric(id)){
            $location.path("accesos");
          }
        });
      };

      $scope.cancelar = function(objeto){
        $location.path("perfilmenu");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, id, true);
          Administracion.eliminar($scope.tabla, 'pem', objeto, function(result){
            cargar();
          });
        }
      };

      $scope.getPerfiles = function(term, done){
        getListado ('perfil', 'per', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };
      $scope.getMenus = function(term, done){
        getListado ('menu', 'men', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
          $scope.objetos = objetos;
          $scope.objetos.sort();
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
          tabla: 'perfilmenu',
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
        if(tabla == 'perfil'){
          $location.path('formulario_perfiles/0/true');
        }else{
          $location.path('formulario_ingreso_menu/0/true');
        }
      };

      function getListado (tabla, tipo, callback){
        var resultados = [];
        Entidad.query({tabla:tabla}, function(data){
          values = angular.copy(data);
          for(var i = 0; i < values.length; i++){
            if(values[i][tipo+'estado'] == 'A'){
              values[i].id = values[i][tipo+'id'];
              values[i].text = values[i][tipo+'descripcion'];
              resultados.push(values[i]);
            }
          }
          callback(resultados);
        });
      }

      function agregarCampos (tipo, objeto){
        if(objeto){
          console.log(objeto);
          objeto.id = objeto[tipo+'id'];
          objeto.text = objeto[tipo+'descripcion'];
        }
      }
  }
]);
