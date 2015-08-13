angular.module('cialcosApp')
.controller('PerfilesMenuCtrl', ['$scope', '$window', '$location', 'ngTableParams', '$filter', 'Entidad', '$routeParams', '$rootScope','$cookieStore', 'Administracion', '$localStorage',
  function($scope, $window, $location, ngTableParams, $filter, Entidad, $routeParams, $rootScope, $cookieStore, Administracion, $localStorage) {

      $scope.tabla = "perfilmenu";
      $scope.objetos = [];
      $scope.arrayMenu = [];

      $scope.guardar = function(){
        var data = [];
        angular.forEach($scope.arrayMenu, function(menu){
          data.push(getData(menu));
          angular.forEach(menu.submenu, function(submenu){
            data.push(getData(submenu));
            angular.forEach(submenu.submenu1, function(item){
            data.push(getData(item));
            });
          });
        });

        Entidad.delete({tabla:$scope.tabla, id:$scope.arrayMenu[0].perid.perid}).$promise
        .then(function(result) {
          Entidad.save({tabla:$scope.tabla}, data).$promise
            .then(function(data) {
              alert("Registros guardados correctamente");
              $scope.arrayMenu = [];
              $scope.objeto.perid = '';
            })
            .catch(function(error) {
              console.log("rejected " + JSON.stringify(error));
            });
        })
        .catch(function(error) {
          console.log("rejected " + JSON.stringify(error));
        });
      };

      function getData(item){
        return {
          perid: item.perid,
          menid: item.menid,
          pemfechacreacion:item.pemfechacreacion,
          pemestado: item.pemestado,
          pemusuariocreacion: item.pemusuariocreacion,
        };
      }

      $scope.cancelar = function(){
        $scope.arrayMenu = [];
        $scope.objeto.perid = '';
        $location.path("perfilmenu");
      };

      $scope.getPerfiles = function(term, done){
        getListado ('perfil', 'per', function(resultados){
          done($filter('filter')(resultados, {text: term}, 'text'));
        });
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

      $scope.getMenuPerfil = function(perfil){
        Administracion.getMenuPerfil(perfil.perid,function(datos){
          getDatosMenu (perfil, datos);
        });
      };

      function getDatosMenu (perfil, perfilMenu){
        var usr = $cookieStore.get('usuario');
        var fecha = new Date();
        $scope.arrayMenu = [];
        Entidad.query({tabla:'menu'}, function(data){
          angular.forEach(data, function(menu){
            if(!menu.menpadre){
              $scope.arrayMenu.push({
                perid: perfil,
                menid: menu,
                pemfechacreacion:fecha,
                pemestado: 'I',
                pemusuariocreacion: usr.usrid,
                submenu: []
              });
            }
          });
          angular.forEach(data, function(menu){
            angular.forEach($scope.arrayMenu, function(item){
              if(menu.menpadre == item.menid.menid){
                item.submenu.push({
                  perid: perfil,
                  menid: menu,
                  pemfechacreacion:fecha,
                  pemestado: 'I',
                  pemusuariocreacion: usr.usrid,
                  submenu1: []
                });
              }
            });
          });
          angular.forEach(data, function(menu){
            angular.forEach($scope.arrayMenu, function(item){
              angular.forEach(item.submenu, function(subitem){
                if(menu.menpadre == subitem.menid.menid){
                  subitem.submenu1.push({
                    perid: perfil,
                    menid: menu,
                    pemfechacreacion:fecha,
                    pemestado: 'I',
                    pemusuariocreacion: usr.usrid,
                  });
                }
              });
            });
          });
          validarPerfil(perfilMenu);
        });
      }

      function validarPerfil(perfilMenu){
        angular.forEach($scope.arrayMenu, function(menu){
          angular.forEach(perfilMenu, function(perfil){
            if(menu.menid.menid == perfil.menid.menid && perfil.pemestado){
              menu.pemestado = perfil.pemestado;
            }else{
              angular.forEach(menu.submenu, function(submenu){
                if(submenu.menid.menid == perfil.menid.menid){
                  submenu.pemestado = perfil.pemestado;
                }else{
                  angular.forEach(submenu.submenu1, function(submenu1){
                    if(submenu1.menid.menid == perfil.menid.menid){
                      submenu1.pemestado = perfil.pemestado;
                    }
                  });
                }
              });
            }
          });
        });
      }

      $scope.seleccionar = function(menu){
        if(menu.submenu){
          marcarSubitems(menu, menu.pemestado);
        }else{
          if(menu.submenu1){
            marcarSubitems1(menu, menu.pemestado);
          }else{
            marcarItem(menu, menu.pemestado);
          }
        }
      };

      function marcarSubitems(menu, estado){
        angular.forEach(menu.submenu, function(submenu){
            submenu.pemestado = estado;
            angular.forEach(submenu.submenu1, function(submenu1){
              submenu1.pemestado = estado;
            });
        });
      }

      function marcarSubitems1(submenu, estado){
        var contador = 0;
        angular.forEach(submenu.submenu1, function(submenu1){
          submenu1.pemestado = estado;
        });
        angular.forEach($scope.arrayMenu, function(menu){
          if(menu.menid.menid == submenu.menid.menpadre){
            angular.forEach(menu.submenu, function(subitem){
              if(subitem.pemestado == 'A' && subitem.menid.menid !== submenu.menid.menid)
                contador++;
            });
            if(contador === 0){
              menu.pemestado = estado;
            }
          }
        });
      }
      function marcarItem(item, estado){
        var contador = 0;
        angular.forEach($scope.arrayMenu, function(menu){
          angular.forEach(menu.submenu, function(submenu){
            if(submenu.menid.menid == item.menid.menpadre){
              angular.forEach(submenu.submenu1, function(submenu1){
                if(submenu1.pemestado == 'A' && submenu1.menid.menid !== item.menid.menid)
                  contador++;
              });
              if(contador === 0){
                submenu.pemestado = estado;
                menu.pemestado = estado;
              }
            }
          });
        });
      }
  }
]);
