'use strict';

angular.module('cialcosApp')
.factory('tablaDinamicaNormal', function(ngTableParams, $timeout, DataTabla, Administracion){
	function compare(a,b) {
	  if (a.bitfecha < b.bitfecha)
	    return 1;
	  // if (a.bitfecha > b.bitfecha)
	  //   return 1;
	  return 0;
	}

	return function(count, counts, tabla, idUsuario, tipo, tipoPadre, scope)  {
		var filter = '';
		var tableParams = new ngTableParams({
			page: 1,
			count: count,
		}, {
			counts: counts,
			paginationMaxBlocks: 9,
			total: 0,

			getData: function ($defer, params) {
				var req = params.url();

				Administracion.countData(tabla, function(contador){
					DataTabla.query({tabla:tabla, from:req.page, to:req.count}).$promise
						.then(function(data) {
							var registros = [];
							for(var i = 0; i < data.length; i++){
									if(data[i][tipo+'estado'] == 'A'){
										registros.push(data[i]);
									}
							}
							if(tabla == 'bitacora'){
								registros.sort(compare);
							}
							$timeout(function() {
									params.total(contador);
									$defer.resolve(registros);
								}, 500);
						});
				});
			},
			$scope: scope

		});

		tableParams.search = function(filterData) {
			filter = filterData;
			tableParams.reload();
		};

		return tableParams;
	};
});
