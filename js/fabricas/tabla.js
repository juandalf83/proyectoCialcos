'use strict';

angular.module('cialcosApp')
.factory('tablaDinamica', function(ngTableParams, $timeout, DataTabla){

	return function(count, counts, tabla, idUsuario, tipo, tipoPadre, scope)  {
		var filter = '';
		var tableParams = new ngTableParams({
			page: 0,
			count: count,
		}, {
			counts: counts,
			paginationMaxBlocks: 9,
			total: 0,

			getData: function ($defer, params) {
				var req = params.url();
				// req.data.filter = filter;
				DataTabla.query({tabla:tabla, from:req.page, to:req.count}).$promise
					.then(function(data) {
						var registros = [];
						for(var i = 0; i < data.length; i++){
							if(data[i][tipoPadre+'id']){
								if(data[i][tipoPadre+'id'][tipoPadre+'id'] == idUsuario && data[i][tipo+'estado'] == 'A'){
									registros.push(data[i]);
								}
							}
						}
						$timeout(function() {
								// update table params
								params.total(data.total);
								// set new data
								$defer.resolve(registros);
							}, 500);
					});
			},
			$scope: scope

		});

		tableParams.search = function(filterData) {
			filter = filterData;
			tableParams.reload();
		}
		return tableParams;
	};

});
