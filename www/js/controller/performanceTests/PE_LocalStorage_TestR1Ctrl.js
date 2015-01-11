sdApp.controller('PE_LocalStorage_TestR1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var dataForPreparation;

    var iteration = 1;

    //prepare results-array
    $scope.results = [];

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testR1a = PE_ParameterFactory.amountOfData_testR1a;
    var amountOfData_testR1b = PE_ParameterFactory.amountOfData_testR1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Prepare will clear all data stored in localStorage. After that it saves the data needed for the test.';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'Test R1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR1a + ' items';
    $scope.testName2 = 'Test R1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR1b + ' items';


    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestR1a') {
            amountOfData = amountOfData_testR1a;
        } else {
            amountOfData = amountOfData_testR1b;
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

    $scope.startPerformanceTest = function () {
        $scope.testInProgress = true;
        $scope.$apply();

        var timeStart = new Date().getTime();
        for (var i = 0; i < amountOfData; i++) {

            localStorage.getItem(i);

            //---Test-Output to check the returned values---
            /*
             console.log('check Test R1:' + localStorage.getItem(i));
            */

        }

        var timeEnd = new Date().getTime();

        var timeDiff = timeEnd - timeStart;
        $scope.results.push({iteration: iteration, time: timeDiff});
        $scope.testInProgress = false;
        $scope.$apply();

        iteration++;

    };

    function loadDataForPreparation() {
        dataForPreparation = testDataFactory.testData();

    };

    function saveAddressData() {

        if (dataForPreparation == null) {
            alert('error: no data loaded');
            console.error('no data loaded (in saveAddressData)');
        } else {

            for (var i = 0; i < dataForPreparation.length; i++) {

                //Set the Id as key
                //Address with key 42 is saved with key -address42-
                localStorage.setItem(dataForPreparation[i][0], JSON.stringify(dataForPreparation[i]));

            }

            localStorage.setItem('numberOfAddresses', dataForPreparation.length);

            console.log('saved ' + dataForPreparation.length + ' addresses.');

        }

    };

    function clearLocalStorage() {
        localStorage.clear();
    }

    $scope.prepare = function () {

        $scope.prepareInProgress = true;
        $scope.$apply();
        clearLocalStorage();
        loadDataForPreparation();
        saveAddressData();
        $scope.prepareInProgress = false;
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();

    };

});