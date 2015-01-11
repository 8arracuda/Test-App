sdApp.controller('PE_SessionStorage_TestD1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {
    var iteration = 1;

    var dataForPreparation;

    //prepare results-array
    $scope.results = [];

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testD1a = PE_ParameterFactory.amountOfData_testD1a;
    var amountOfData_testD1b = PE_ParameterFactory.amountOfData_testD1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Prepare will clear all data stored in sessionStorage. After that it saves the data needed for the test.';
    $scope.mainTestDecription = 'The test deletes addresses by their key.';
    $scope.testName1 = 'TestD1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testD1a + ' items';
    $scope.testName2 = 'TestD1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testD1b + ' items';


    $scope.reset = function () {

        var answer = confirm('Do you really want to reset this page. All test results will be removed!');

        if (answer) {
            iteration = 1;
            $scope.isPrepared = false;
            $scope.results = [];
            $scope.selectedTestVariant = '';
        }

    };

    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestD1a') {
            amountOfData = amountOfData_testD1a;
        } else {
            amountOfData = amountOfData_testD1b;
        }
        console.log('selectedTestVariant= ' + $scope.selectedTestVariant + ' (amountOfData= ' + amountOfData + ')');

    };

    $scope.startPerformanceTest = function () {
        $scope.testInProgress = true;
        $scope.$apply();

        var addressIdsToDelete = testDataFactory.getRandomIndices();

        if (addressIdsToDelete.length < amountOfData) {
            alert('Warning: Too few address Ids defined. The test will produce wrong results!');
        }

        var timeStart = new Date().getTime();
        //for (var i = 0; i < addressIdsToLoad.length; i++) {
        for (var i = 0; i < amountOfData; i++) {

            sessionStorage.removeItem(addressIdsToDelete[i]);

        }

        var timeEnd = new Date().getTime();

        var timeDiff = timeEnd - timeStart;
        $scope.results.push({iteration:  iteration,  time: timeDiff});
        $scope.testInProgress = false;
        $scope.isPrepared = false;
        $scope.$apply();

        iteration++;


    };

    function loadData() {

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
                sessionStorage.setItem(dataForPreparation[i][0], JSON.stringify(dataForPreparation[i]));

            }

            sessionStorage.setItem('numberOfAddresses', dataForPreparation.length);

            console.log('saved ' + dataForPreparation.length + ' addresses.');

        }

    };

    function clearSessionStorage() {

        sessionStorage.clear();


    }

    $scope.prepare = function () {

        clearSessionStorage();
        loadData();
        saveAddressData();
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();
    };

})
;