$(document).on("focusin", ".datepicker", function () {
  $(this).datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
  });
});

angular.module('cialcosApp')
.controller('UsuariosPerfilesCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope', '$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "usuarioperfil";
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
                if($localStorage.dataRedireccion[usr.usrid].tabla == 'usuarioperfil'){
                  reg = redireccion.respaldoUsuario;
                  delete $localStorage.dataRedireccion[usr.usrid];
                }
              }
            }
          }
          if(registro.upeid === undefined){
            $scope.titulo = "Ingreso de";
          }else{
            $scope.titulo = "Edicion de";
            $scope.objeto = registro;
            $scope.objeto.upefechacaducidad = moment($scope.objeto.upefechacaducidad).format('YYYY-MM-DD');
            agregarCampos('usr', $scope.objeto.usrid);
            agregarCampos('per', $scope.objeto.perid);
          }
        });
      }

      $scope.open = function(editable, id){
        $rootScope.guardarBitacoraCRUD(editable, id, false);
        $location.path("formulario_usuario_perfil/"+id+"/"+editable);
      };

      $scope.guardar = function(objeto){
        objeto.upefechacaducidad = new Date(objeto.upefechacaducidad);
        Administracion.guardar($scope.tabla, 'upe', objeto, function(id){
          if($.isNumeric(id)){
            $location.path("usuarioperfil");
          }
        });
      };

      $scope.cancelar = function(objeto){
        $location.path("usuarioperfil");
      };

      $scope.eliminar = function(objeto){
        if(confirm("Esta seguro de eliminar este registro?")){
          $rootScope.guardarBitacoraCRUD(false, objeto.upeid, true);
          Administracion.eliminar($scope.tabla, 'upe', objeto, function(result){
            cargar();
          });
        }
      };

      $scope.getPerfiles = function(term, done){
        getListado ('perfil', 'per', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };
      $scope.getUsuarios = function(term, done){
        getListado ('usuario', 'usr', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
      };

      function cargar(){
        Administracion.cargar($scope.tabla,function(objetos){
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
              if(tabla == 'usuario'){
                values[i].text = values[i][tipo+'nombrecompleto'];
              }else{
                values[i].text = values[i][tipo+'descripcion'];
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
          objeto.text = objeto[tipo+'descripcion'];
          if(tipo == 'usr'){
            objeto.text = objeto[tipo+'nombrecompleto'];
          }
          console.log(objeto);
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
          tabla: 'usuarioperfil',
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
        if(tabla == 'usuario'){
          $location.path('formulario_usuario/0/true');
        }else{
          $location.path('formulario_perfiles/0/true');
        }
      };
  }
]);
