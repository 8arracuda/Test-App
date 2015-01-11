angular.module('TestHelperFactory', [])
    .factory('TestHelperFactory', function () {

        return {

            fillWithZeroes: function (fillToLength, number) {

                var len = number.toString().length;

                var number_new = '';
                if (len < fillToLength) {
                    var zeroesToAdd = fillToLength - len;

                    for (var k = 0; k < zeroesToAdd; k++) {
                        number_new = '0' + number_new;
                    }
                }
                return number_new + "" + number;

            }
        }
    });