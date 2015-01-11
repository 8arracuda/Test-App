sdApp.controller('OverviewCtrl', function ($scope, techSupportFactory) {

        $scope.stringForTitle = 'Overview';
        $scope.stringForRightButton = 'OVV';

        $scope.techniques = techSupportFactory.techSupport();


        $scope.generateRandomNumbersArray = function () {

            var resultsArray = [];

            var limit = 1999;
            var i = 0;
            var resultString = '';
            //while (resultsArray.length < limit) {
            //    var randomNumber = Math.round(Math.random() * limit);
            //    i++;
            //    if (resultsArray.indexOf(randomNumber) == -1) {
            //        resultsArray.push(randomNumber);
            //     //   resultString = resultString + ',' + randomNumber;
            //    }
            //}

            while (resultsArray.length < limit + 1) {
                var randomNumber = Math.round(Math.random() * limit);
                i++;
                if (resultsArray.indexOf(randomNumber) == -1) {
                    resultsArray.push(randomNumber);
                }
            }

            console.log(resultsArray.toString());

            checkArray(resultsArray);

        };

        $scope.getTime = function () {
            alert(new Date().getTime());
        };

        function checkArray(array) {

            console.log('max:' + Math.max.apply(Math, array));
            console.log('min:' + Math.min.apply(Math, array));

            for (var i = 0; i < array.length; i++) {
                if (array.indexOf(i) == -1) {
                    console.log(i + ' is missing?');
                }
            }

        }

        //TODO remove at the end - Only a method to generate data - has nothing to do with the tests
        $scope.generate = function () {

            var resultString = '"';
            for (var i = 0; i < 5000; i++) {

                resultString = resultString + ',"' + $scope.fillWithZeroes(40, i) + '"';
                //resultString = resultString + ',"' + i + '"';

            }
            console.log(resultString);
        };


        //TODO remove at the end - Only a method to generate data - has nothing to do with the tests
        $scope.fillWithZeroes = function (fillToLength, number) {

            //for (var i = 0; i < 110; i++) {

            var len = number.toString().length;
            //console.log('i: ' + i + ' - ' + len);

            var number_new = '';
            if (len < fillToLength) {
                var zeroesToAdd = fillToLength - len;

                for (var k = 0; k < zeroesToAdd; k++) {
                    number_new = '0' + number_new;
                }
                //   i_new = i_new + i;
                //console.log(i_new);
            }
            return number_new + "" + number;

            //}

        };

    }
)
;