sdApp.controller('PE_SessionStorage_TestC3Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var iteration = 1;

    $scope.results = [];

    $scope.isPrepared = false;

    var amountOfData_testC3a = PE_ParameterFactory.amountOfData_testC3a;
    var amountOfData = amountOfData_testC3a;

    $scope.selectedTestVariant = 'TestC3a';
    $scope.preparationText = 'The prepare function will clear all data stored with sessionStorage';
    $scope.mainTestDecription = 'The test stores datasets, with 4000 addresses each, into one key-value pair';
    $scope.testName1 = 'TestC3-6';
    $scope.testDecription1 = 'Stores ' + amountOfData_testC3a + ' times 4,000 addresses in a single key/value pair.';


    $scope.reset = function () {

        var answer = confirm('Do you really want to reset this page. All test results will be removed!');

        if (answer) {
            iteration = 1;
            $scope.isPrepared = false;
            $scope.results = [];
        }

    };

    $scope.prepare = function () {

        sessionStorage.clear();
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();
    };

    $scope.startPerformanceTest = function () {

        console.log('startPerformanceTest');

        //The 7th dataset can't be saved on Safari (iOS 8) due to exceeded quota
        //Error: QuotaExceededError: DOM Exception 22

        for (var i = 0; i < amountOfData; i++) {

            var datasetString = JSON.stringify(testDataFactory.getBigDataset());
            console.log(datasetString.length);

            var timeStart = new Date().getTime();
            try {
                sessionStorage.setItem('dataset_' + i, datasetString);

            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('quota exceeded when writing dataset_' + i + '. The results for this test cannot be used!');
                    break;
                }
            }

        }

        var timeEnd = new Date().getTime();
        var timeDiff = timeEnd - timeStart;

        $scope.results.push({iteration:  iteration,  time: timeDiff});
        $scope.testInProgress = false;
        $scope.isPrepared = false;
        $scope.$apply();
        iteration++;

    }
});