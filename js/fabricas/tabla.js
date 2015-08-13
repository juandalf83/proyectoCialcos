'use strict';

angular.module('cialcosApp')
.factory('tablaDinamica', function(ngTableParams, $timeout, DataTabla, Administracion){

	return function(count, counts, tabla, idUsuario, tipo, tipoPadre, scope)  {
		var tableParams = new ngTableParams({
			page: 1,
			count: count,
		}, {
			counts: counts,
			paginationMaxBlocks: 9,
			total: 0,

			getData: function ($defer, params) {
				var req = params.url();
				console.log(idUsuario);
				Administracion.cargar(tabla, function(data) {
						var registros = [];
						for(var i = 0; i < data.length; i++){
								if(data[i][tipoPadre+'id']){
									if(data[i][tipoPadre+'id'][tipoPadre+'id'] == idUsuario){
										registros.push(data[i]);
									}
								}
						}
						var maximo = (req.count * req.page);
						var minimo = maximo - req.count;
						var arrayVista = [];
						for(i = minimo; i < maximo; i++){
							if(i < registros.length)
								arrayVista.push(registros[i]);
						}

						$timeout(function() {
							params.total(registros.length);
							$defer.resolve(arrayVista);
						}, 500);
					});
			},
			$scope: scope

		});

		tableParams.search = function(filterData) {
			tableParams.reload();
		};

		tableParams.reloadTable = function(filterData) {
			idUsuario = filterData;
			tableParams.reload();
		};

		return tableParams;
	};

});
