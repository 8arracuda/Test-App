sdApp.controller('PE_LocalStorage_TestR3Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var data;

    var iteration = 1;

    //prepare results-array
    $scope.results = [];

    $scope.isPrepared = false;

    var amountOfData_testR3a = PE_ParameterFactory.amountOfData_testR3a;
    var amountOfData = amountOfData_testR3a;

    $scope.selectedTestVariant = 'TestR3a';
    $scope.preparationText = 'Prepare will clear all data stored in localStorage. After that it saves the data needed for the test.';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'TestR3-6';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR3a + ' items';


    $scope.reset = function () {

        var answer = confirm('Do you really want to reset this page. All test results will be removed!');

        if (answer) {
            iteration = 1;
            $scope.isPrepared = false;
            $scope.results = [];
        }

    };

    $scope.startPerformanceTest = function () {
        $scope.testInProgress = true;
        $scope.$apply();

        var timeStart = new Date().getTime();
        for (var i = 0; i < amountOfData; i++) {

            localStorage.getItem('dataset_' + i);
            //---Test-Output to check the returned values---
            //console.log(localStorage.getItem('dataset_' + i));

        }

        var timeEnd = new Date().getTime();

        var timeDiff = timeEnd - timeStart;
        $scope.results.push({iteration: iteration, time: timeDiff});
        $scope.testInProgress = false;
        $scope.$apply();

        iteration++;

    };

    function saveAddressData() {

        for (var i = 0; i < amountOfData; i++) {
            var datasetString = testDataFactory.getDatasetWithOffset(i);
            try {
                localStorage.setItem('dataset_' + i, datasetString);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('quota exceeded when writing dataset_' + i + '. The results for this test cannot be used!');
                    break;
                }
            }
        }
    };

    function clearLocalStorage() {

        localStorage.clear();

    }

    $scope.prepare = function () {

        clearLocalStorage();
        saveAddressData();
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();

    };

});