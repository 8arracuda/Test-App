sdApp.controller('PE_WebSql_TestR1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var iteration = 1;

    var dataForPreparation;

    var dbName = "PE_TestR1";
    var tableName = "PE_TestR1";
    var dbVersion = "1.0";

    //bool value used for the status-light in the "open database" section
    $scope.databaseOpened = false;

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testR1a = PE_ParameterFactory.amountOfData_testR1a;
    var amountOfData_testR1b = PE_ParameterFactory.amountOfData_testR1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'The prepare function will clear the table ' + tableName + '. After that it saves the files needed for the test';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'Test R1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR1a + ' items';
    $scope.testName2 = 'Test R1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR1b + ' items';

    $scope.results = [];

    $scope.isPrepared = false;


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

    $scope.prepare = function () {

        $scope.prepareInProgress = true;
        $scope.$apply();
        clearTable(function() {
            loadDataForPreparation();
            saveAddressData(function () {
                $scope.prepareInProgress = false;
                $scope.isPrepared = true;
                console.log('prepare function finished');
                $scope.$apply();
            });

        });


    };

    function saveAddressData(callback) {

        console.log('saveTable1ToWebSQL start');

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < dataForPreparation.length; i++) {
                tx.executeSql("INSERT INTO " + tableName + "(id, address) VALUES(?,?)", [dataForPreparation[i][0] + '', JSON.stringify(dataForPreparation[i])]);
            }

            console.log(dataForPreparation.length + ' addresses saved in WebSQL database  -' + tableName + '-?');

        }, function errorHandler(transaction, error) {
            alert("Error : " + transaction.message);
            alert("Error : " + error.message);
        }, callback);

        console.log('saveTable1ToWebSQL executed');

    }

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    };

    function clearTable(callback) {

        $scope.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM " + tableName, [], $scope.errorHandlerWebSQL);
        }, $scope.errorHandlerWebSQL, callback);

    };

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        $scope.db = window.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        console.log('createTable start');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id INTEGER PRIMARY KEY, address TEXT)');
        console.log('createTable executed');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log('errorHandlerWebSQL start');
        console.log(e.message);
        console.log('errorHandlerWebSQL executed');
    };

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;
        $scope.$apply();

        var timeStart = new Date().getTime();

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < amountOfData; i++) {

                tx.executeSql("SELECT * FROM PE_TestR1 WHERE id = ?", [i], function (transaction, results) {
                    //---Test-Output to check the returned values---
                    //console.log('check Test R1:' + JSON.stringify(results.rows.item(0)));
                });

            }

        }, function errorHandler(transaction, error) {
            console.log("Error : " + transaction.message);
        }, function () {
            var timeEnd = new Date().getTime();

            var timeDiff = timeEnd - timeStart;
            $scope.results.push({iteration: iteration, time: timeDiff});
            $scope.testInProgress = false;
            iteration++;
            $scope.$apply();

        });

    }

});