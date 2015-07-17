angular.module('cialcosApp', [
  'ngResource',
  'ngRoute',
  'ngTable',
  'ngCookies',
  'ngStorage',
  'ui.bootstrap',
  'EntidadFactory',
  'MagapFactory'
])

.run(function($rootScope, $location, $cookieStore) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if ($cookieStore.get('estaConectado') == false || $cookieStore.get('estaConectado') == null) {
        $location.path('/');
      }else {
        var formulario = new RegExp("formulario");
        if(!formulario.test(next.originalPath)){
          $location.path(next.originalPath);
        }
        var ubicacion = new RegExp("ubicacion");
        if(ubicacion.test(next.originalPath) && !formulario.test(next.originalPath)){
          $location.path('/listado/'+next.params.ubicacion);
        }
      }
    });
  })
.config(['$routeProvider','$httpProvider', function ($routeProvider, $httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $routeProvider
  .when('/', {
    templateUrl: 'html/inicio.html',
    controller: 'InicioCtrl'
  })
  .when('/bienvenida', {
    templateUrl: 'html/bienvenida.html'
  })
  .when('/listado/:ubicacion', {
    templateUrl: 'html/parametrizacion/listado.html',
    controller: 'ParametrizacionCtrl'
  })
  .when('/formulario/:id/:ubicacion/:editable', {
    templateUrl: 'html/parametrizacion/formulario.html',
    controller: 'ParametrizacionCtrl'
  })
  .when('/usuarios', {
    templateUrl: 'html/usuarios/usuarios.html',
    controller: 'UsuariosCtrl'
  })
  .when('/formulario_usuario/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_usuario.html',
    controller: 'FormularioUsuariosCtrl'
  })
  .when('/organizaciones', {
    templateUrl: 'html/cialcos/organizaciones.html',
    controller: 'OrganizacionesCtrl'
  })
  .when('/formulario_organizacion/:id/:editable', {
    templateUrl: 'html/cialcos/formulario_organizacion.html',
    controller: 'FormularioOrganizacionCtrl'
  })
  .when('/cialcos', {
    templateUrl: 'html/cialcos/cialcos.html',
    controller: 'CialcosCtrl'
  })
  .when('/formulario_cialcos/:id/:editable', {
    templateUrl: 'html/cialcos/formulario_cialcos.html',
    controller: 'FormularioCialcosCtrl'
  })
  .when('/territorios', {
    templateUrl: 'html/parametrizacion/territorios.html',
    controller: 'TerritoriosCtrl'
  })
  .when('/perfiles', {
    templateUrl: 'html/usuarios/perfiles.html',
    controller: 'PerfilesCtrl'
  })
  .when('/formulario_perfiles/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_perfiles.html',
    controller: 'PerfilesCtrl'
  })
  .when('/usuarioperfil', {
    templateUrl: 'html/usuarios/usuarios_perfiles.html',
    controller: 'UsuariosPerfilesCtrl'
  })
  .when('/formulario_usuario_perfil/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_usuarios_perfiles.html',
    controller: 'UsuariosPerfilesCtrl'
  })
  .when('/pantallas', {
    templateUrl: 'html/usuarios/pantallas.html',
    controller: 'PantallasCtrl'
  })
  .when('/formulario_pantalla/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_pantallas.html',
    controller: 'PantallasCtrl'
  })
  .when('/ingresomenu', {
    templateUrl: 'html/usuarios/ingreso_menu.html',
    controller: 'IngresoMenuCtrl'
  })
  .when('/formulario_ingreso_menu/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_ingreso_menu.html',
    controller: 'IngresoMenuCtrl'
  })
  .when('/perfilmenu', {
    templateUrl: 'html/usuarios/perfiles_menu.html',
    controller: 'PerfilesMenuCtrl'
  })
  .when('/formulario_perfil_menu/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_perfiles_menu.html',
    controller: 'PerfilesMenuCtrl'
  })
  .when('/accesos', {
    templateUrl: 'html/usuarios/accesos.html',
    controller: 'AccesosCtrl'
  })
  .when('/formulario_accesos/:id/:editable', {
    templateUrl: 'html/usuarios/formulario_accesos.html',
    controller: 'AccesosCtrl'
  })
  .when('/producto', {
    templateUrl: 'html/cialcos/productos.html',
    controller: 'ProductosCtrl'
  })
  .when('/formulario_producto/:id/:editable', {
    templateUrl: 'html/cialcos/formulario_productos.html',
    controller: 'ProductosCtrl'
  })
  .when('/formulario_adicional_cialco/:id/:editable', {
    templateUrl: 'html/adicionales/formulario_adicional_cialco.html',
    controller: 'FormularioCialcosCtrl'
  })
  .when('/formulario_adicional_usuario/:id/:editable', {
    templateUrl: 'html/adicionales/formulario_adicional_usuario.html',
    controller: 'FormularioUsuariosCtrl'
  })
  .when('/formulario_adicional_organizacion/:id/:editable', {
    templateUrl: 'html/adicionales/formulario_adicional_organizacion.html',
    controller: 'FormularioOrganizacionCtrl'
  })
  .when('/participadorproducto', {
    templateUrl: 'html/cialcos/participador_producto.html',
    controller: 'ParticipadorProductoCtrl'
  })
  .when('/formulario_participador_producto/:id/:editable', {
    templateUrl: 'html/cialcos/formulario_participador_producto.html',
    controller: 'FormularioParticipadorCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
