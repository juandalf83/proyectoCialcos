'use strict';

angular.module('MagapFactory', ['angularSoap'])

.factory("MagapService", ['$soap',function($soap){
    var base_url = "http://sinagap.magap.gob.ec/enlaces/Service.asmx";

    return {
        validarCedula: function(cedula){
            return $soap.post(base_url,"WBConsultaCed", {cadena: cedula});
        }
    };
}]);
