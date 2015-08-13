'use strict';

angular.module('cialcosApp')
    .directive('decimal', function() {
        var key;
        var current_value;
        var char_position;
        var is_delete_key;
        var _scope;

        var max_decimals = function() {return 2;};
        var max = function() {return '9999999999';};

        var key_number = {
            48:0,
            49:1,
            50:2,
            51:3,
            52:4,
            53:5,
            54:6,
            55:7,
            56:8,
            57:9
        };

        var allwoed_keys = [8, 9, 13, 37, 38, 39, 40]; //backspace, tab, intro, arrows
        var denied_keys = [0, 222, 192, 229]; // single cuotes and accents, dont generate keypress so must be intervented on keydown.

        var is_number = function() {
            return ((key >= 48 && key <= 57));
        };

        var allowed_key = function() {
            return allwoed_keys.indexOf(key) !== -1;
        };

        var is_backspace = function() {
            return key === 8;
        };

        var has_dot = function(){
            return current_value.indexOf('.') !== -1;
        };

        var is_dot = function(){
            return key === 46;
        };

        var is_coma = function(){
            return key === 44;
        };

        var lower_decimals_than_max_decimals = function(){
            return current_value.split('.')[1].length < max_decimals();
        };

        var input_is_max_number_or_lower = function () {
            var input_number = current_value.slice(0, char_position) + key_number[key] + current_value.slice(char_position);
            return parseFloat(input_number) <= parseFloat(max());
        };

        var backspace_result_is_max_or_lower = function() {
            var first_part = current_value.slice(0, char_position-1);
            var second_part = current_value.slice(char_position);
            var input_number = first_part + second_part;

            if(input_number === ''){
                input_number = 0;
            }

            return parseFloat(input_number) <= max();
        };

        var delete_result_is_max_or_lower = function() {
            var first_part = current_value.slice(0, char_position);
            var second_part = current_value.slice(char_position+1);
            var input_number = first_part + second_part;

            if(input_number === ''){
                input_number = 0;
            }

            return parseFloat(input_number) <= max();
        };

        var dot_position = function() {
            return current_value.indexOf('.');
        };

        var current_value_is_lower_than_max_same_part = function() {
            return current_value < max().slice(0, current_value.length);
        };

        var decimal_position = function () {
            return char_position > dot_position() && char_position <= max_decimals() + max().length;
        };

        var lower_integers_than_max = function () {
            return (current_value.split('.')[0].length < max().length);
        };

        var is_integer_position = function() {
            return char_position >= 0 && char_position <= (max().length-1);
        };

        var selection_substitution_validation = function(input, value) {
            current_value = $(input).val();
            var selection_start = $(input)[0].selectionStart;
            var selection_end = $(input)[0].selectionEnd;

            var paste_number = current_value.slice(0, selection_start) + value + current_value.slice(selection_end, current_value.length);
            paste_number = paste_number.replace(',', '.');

            var number_of_integers = paste_number.split('.')[0].length;

            var number_of_decimals = 0;
            if(paste_number.split('.')[1]){
                number_of_decimals = paste_number.split('.')[1].length;
            }

            var lower_or_equals_to_max = parseFloat(paste_number) <= parseFloat(max());
            var is_valid = (!isNaN(paste_number) || paste_number === '.');

            if(is_valid && lower_or_equals_to_max && number_of_integers <= max().length && number_of_decimals <= max_decimals()){
                return true;
            }

            return false;
        };

        var link = function(scope, element) {
            _scope = scope;

            $(element).attr('autocomplete', 'off');

            $(element).on('keydown', function(e){
                key = e.charCode || e.keyCode || 0;
                current_value = $(element).val();
                char_position = element[0].selectionStart;

                is_delete_key = (key === 46);
                if(is_delete_key && !delete_result_is_max_or_lower()){
                    return false;
                }

                if(is_backspace() && !backspace_result_is_max_or_lower()){
                    return false;
                }

                return denied_keys.indexOf(key) === -1;
            });

            $(element).on('paste', function(e){
                var paste_value = (e.originalEvent.clipboardData.getData('Text'));
                return selection_substitution_validation(e.target, paste_value);
            });

            $(element).on('keypress', function(e){

                key = e.charCode || e.keyCode || 0;
                current_value = $(element).val();
                char_position = element[0].selectionStart;

                if(allowed_key() || is_delete_key){
                    return true;
                }

                if(e.shiftKey || e.ctrlKey || e.altKey) {
                    return false;
                }

                if(is_number() && is_integer_position() && lower_integers_than_max() && input_is_max_number_or_lower()) {
                    return true;
                }

                if(is_number() && decimal_position() && has_dot() && lower_decimals_than_max_decimals()) {
                    return true;
                }

                if(element[0].selectionStart !== element[0].selectionEnd && (is_number())){
                    var paste_value = key_number[key] || '.';
                    return selection_substitution_validation(e.target, paste_value);
                }

                var not_last_coma_position_possible =  char_position > 0 && char_position < max().length;
                var max_integers_but_no_max_number = char_position === max().length && current_value_is_lower_than_max_same_part();

                return false;
            });
        };

        return {
            restrict: 'A',
            link: link
        };
    });
