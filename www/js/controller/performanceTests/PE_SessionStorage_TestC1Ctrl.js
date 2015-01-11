sdApp.controller('PE_SessionStorage_TestC1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {
        var iteration = 1;

        //prepare results-array
        var data;
        $scope.results = [];

        $scope.isPrepared = false;

        var amountOfData;
        var amountOfData_testC1a = PE_ParameterFactory.amountOfData_testC1a;
        var amountOfData_testC1b = PE_ParameterFactory.amountOfData_testC1b;

        $scope.selectedTestVariant = '';
        $scope.preparationText = 'The prepare function will clear all data stored with sessionStorage';
        $scope.mainTestDecription = 'The test stores each address in a single key-value pair.';
        $scope.testName1 = 'TestC1-500';
        $scope.testDecription1 = 'Stores ' + amountOfData_testC1a + ' items';
        $scope.testName2 = 'TestC1-2000';
        $scope.testDecription2 = 'Stores ' + amountOfData_testC1b + ' items';


        $scope.selectTestVariant = function (testVariant) {
            $scope.selectedTestVariant = testVariant;

            if (testVariant == 'TestC1a') {
                amountOfData = amountOfData_testC1a;
            } else {
                amountOfData = amountOfData_testC1b;
            }
            console.log('selectedTestVariant= ' + $scope.selectedTestVariant + ' (amountOfData= ' + amountOfData + ')');

        };

        $scope.reset = function () {

            var answer = confirm('Do you really want to reset this page. All test results will be removed!');

            if (answer) {
                iteration = 1;
                $scope.isPrepared = false;
                $scope.results = [];
                $scope.selectedTestVariant = '';
            }

        };

        $scope.startPerformanceTest = function() {

            $scope.testInProgress = true;
            $scope.$apply();


            setTimeout(function () {

                var timeStart = new Date().getTime();

                for (var i = 0; i < amountOfData; ++i) {
                    var addressToSave = data[i];
                    sessionStorage.setItem(addressToSave[0], JSON.stringify(addressToSave));
                }

                var timeEnd = new Date().getTime();

                var timeDiff = timeEnd - timeStart;

                $scope.results.push({iteration:  iteration,  time: timeDiff});

                $scope.isPrepared = false;
                $scope.testInProgress = false;
                $scope.$apply();
                iteration++;
            }, 2000);


        };

        function clearSessionStorage() {

            sessionStorage.clear();

        }

        function loadData() {

            data = testDataFactory.testData();

        }

        $scope.prepare = function () {

            clearSessionStorage();
            loadData();
            $scope.isPrepared = true;
            console.log('prepare function finished');
            $scope.$apply();

        };

    }
)
;