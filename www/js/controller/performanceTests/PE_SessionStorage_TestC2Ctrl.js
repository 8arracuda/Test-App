sdApp.controller('PE_SessionStorage_TestC2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {
        var iteration = 1;

        //prepare results-array
        var data;
        $scope.results = [];

        $scope.isPrepared = false;

        var amountOfData;
        var amountOfData_testC2a = PE_ParameterFactory.amountOfData_testC2a;
        var amountOfData_testC2b = PE_ParameterFactory.amountOfData_testC2b;

        $scope.selectedTestVariant = '';
        $scope.preparationText = 'The prepare function will clear all data stored with sessionStorage';
        $scope.mainTestDecription = 'The test stores every address-field in a single key-value pair.';
        $scope.testName1 = 'TestC2-500';
        $scope.testDecription1 = 'StoresStores ' + amountOfData_testC2a + ' items';
        $scope.testName2 = 'TestC2-2000';
        $scope.testDecription2 = 'Stores ' + amountOfData_testC2b + ' items';


        $scope.selectTestVariant = function (testVariant) {
            $scope.selectedTestVariant = testVariant;

            if (testVariant == 'TestC2a') {
                amountOfData = amountOfData_testC2a;
            } else {
                amountOfData = amountOfData_testC2b;
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

                    var currentAddress = data[i];
                    sessionStorage.setItem(currentAddress[0] + '_id', currentAddress[0]);
                    sessionStorage.setItem(currentAddress[0] + '_firstname', currentAddress[1]);
                    sessionStorage.setItem(currentAddress[0] + '_lastname', currentAddress[2]);
                    sessionStorage.setItem(currentAddress[0] + '_zipcode', currentAddress[4]);
                    sessionStorage.setItem(currentAddress[0] + '_city', currentAddress[5]);
                    sessionStorage.setItem(currentAddress[0] + '_email', currentAddress[6]);
                    sessionStorage.setItem(currentAddress[0] + '_randomNumber1', currentAddress[7]);
                    sessionStorage.setItem(currentAddress[0] + '_randomNumber2', currentAddress[8]);

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