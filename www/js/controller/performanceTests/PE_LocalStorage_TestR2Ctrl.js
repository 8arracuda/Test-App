sdApp.controller('PE_LocalStorage_TestR2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var dataForPreparation;

    var iteration = 1;

    //prepare results-array
    $scope.results = [];

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testR2a = PE_ParameterFactory.amountOfData_testR2a;
    var amountOfData_testR2b = PE_ParameterFactory.amountOfData_testR2b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Prepare will clear all data stored in localStorage. After that it saves the data needed for the test.';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'Test R2-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR2a + ' items';
    $scope.testName2 = 'Test R2-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR2b + ' items';


    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestR2a') {
            amountOfData = amountOfData_testR2a;
        } else {
            amountOfData = amountOfData_testR2b;
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

            localStorage.getItem(i + '_id');
            localStorage.getItem(i + '_firstname');
            localStorage.getItem(i + '_lastname');
            localStorage.getItem(i + '_zipcode');
            localStorage.getItem(i + 'city');
            localStorage.getItem(i + '_email');
            localStorage.getItem(i + '_randomNumber1');
            localStorage.getItem(i + '_randomNumber2');

            //---Test-Output to check the returned values---
            /*
                console.log('check Test R2 [1/3]: ' + localStorage.getItem(i + '_id'));
                console.log('check Test R2 [2/3]: ' + localStorage.getItem(i + '_firstname'));
                console.log('check Test R2 [3/3]: ' + localStorage.getItem(i + '_lastname'));
            */
        }

        var timeEnd = new Date().getTime();

        var timeDiff = timeEnd - timeStart;
        $scope.results.push({iteration:  iteration,  time: timeDiff});
        $scope.testInProgress = false;
        $scope.$apply();

        iteration++;

    };

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    };

    function saveAddressData() {
        console.log('saveAddressData');

            for (var i = 0; i < dataForPreparation.length; ++i) {

                var currentAddress = dataForPreparation[i];
                localStorage.setItem(currentAddress[0] + '_id', currentAddress[0]);
                localStorage.setItem(currentAddress[0] + '_firstname', currentAddress[1]);
                localStorage.setItem(currentAddress[0] + '_lastname', currentAddress[2]);
                localStorage.setItem(currentAddress[0] + '_zipcode', currentAddress[4]);
                localStorage.setItem(currentAddress[0] + '_city', currentAddress[5]);
                localStorage.setItem(currentAddress[0] + '_email', currentAddress[6]);
                localStorage.setItem(currentAddress[0] + '_randomNumber1', currentAddress[7]);
                localStorage.setItem(currentAddress[0] + '_randomNumber2', currentAddress[8]);

            }
    };

    function clearLocalStorage() {

        localStorage.clear();

    }

    $scope.prepare = function () {
        $scope.prepareInProgress = true;
        $scope.$apply();
        setTimeout(function() {
            clearLocalStorage();
            loadDataForPreparation();
            saveAddressData();
            $scope.prepareInProgress = false;
            $scope.isPrepared = true;
            console.log('prepare function finished');
            $scope.$apply();
        }, 1000);



    };

});