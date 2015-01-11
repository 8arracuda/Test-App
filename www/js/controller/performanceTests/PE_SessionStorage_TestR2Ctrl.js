sdApp.controller('PE_SessionStorage_TestR2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var dataForPreparation;

    var iteration = 1;

    //prepare results-array
    $scope.results = [];

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testR2a = PE_ParameterFactory.amountOfData_testR2a;
    var amountOfData_testR2b = PE_ParameterFactory.amountOfData_testR2b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Prepare will clear all data stored in sessionStorage. After that it saves the data needed for the test.';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'TestR2-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR2a + ' items';
    $scope.testName2 = 'TestR2-2000';
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

        var addressIdsToLoad = testDataFactory.getRandomIndices();

        if (addressIdsToLoad.length<amountOfData) {
            alert('Warning: Too few address Ids defined. The test will produce wrong results!');
        }

        var timeStart = new Date().getTime();
        for (var i = 0; i < amountOfData; i++) {

            var addressId =  addressIdsToLoad[i];
            sessionStorage.getItem(addressId + '_id');
            sessionStorage.getItem(addressId + '_firstname');
            sessionStorage.getItem(addressId + '_lastname');
            sessionStorage.getItem(addressId + '_zipcode');
            sessionStorage.getItem(addressId + 'city');
            sessionStorage.getItem(addressId + '_email');
            sessionStorage.getItem(addressId + '_randomNumber1');
            sessionStorage.getItem(addressId + '_randomNumber2');

            //---Test-Output to check the returned values---
            /*
                console.log('check Test R2 [1/3]: ' + sessionStorage.getItem(addressId + '_id'));
                console.log('check Test R2 [2/3]: ' + sessionStorage.getItem(addressId + '_firstname'));
                console.log('check Test R2 [3/3]: ' + sessionStorage.getItem(addressId + '_lastname'));
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
            sessionStorage.setItem(currentAddress[0] + '_id', currentAddress[0]);
            sessionStorage.setItem(currentAddress[0] + '_firstname', currentAddress[1]);
            sessionStorage.setItem(currentAddress[0] + '_lastname', currentAddress[2]);
            sessionStorage.setItem(currentAddress[0] + '_zipcode', currentAddress[4]);
            sessionStorage.setItem(currentAddress[0] + '_city', currentAddress[5]);
            sessionStorage.setItem(currentAddress[0] + '_email', currentAddress[6]);
            sessionStorage.setItem(currentAddress[0] + '_randomNumber1', currentAddress[7]);
            sessionStorage.setItem(currentAddress[0] + '_randomNumber2', currentAddress[8]);

        }
    };

    function clearSessionStorage() {

        sessionStorage.clear();

    }

    $scope.prepare = function () {

        clearSessionStorage();
        loadDataForPreparation();
        saveAddressData();
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();

    };

});