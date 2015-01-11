sdApp.controller('PE_WebSql_TestC1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {
    var iteration = 1;

    var dataForPreparation;
    var dbName = "PE_TestC1";
    var tableName = "PE_TestC1";
    var dbVersion = "1.0";

    var data;

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testC1a = PE_ParameterFactory.amountOfData_testC1a;
    var amountOfData_testC1b = PE_ParameterFactory.amountOfData_testC1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'The prepare function will clear all data stored in the table ' + tableName;
    $scope.mainTestDecription = 'The test stores each address into a table with two columns - id and address.';
    $scope.testName1 = 'Test C1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testC1a + ' items';
    $scope.testName2 = 'Test C1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testC1b + ' items';

    $scope.results = [];

    $scope.isPrepared = false;

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

        if (testVariant == 'TestC1a') {
            amountOfData = amountOfData_testC1a;
        } else {
            amountOfData = amountOfData_testC1b;
        }
        console.log('selectedTestVariant= ' + $scope.selectedTestVariant + ' (amountOfData= ' + amountOfData + ')');

    };

    function clearTable() {

        $scope.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM " + tableName, [], clearedTableCallback, $scope.errorHandlerWebSQL);
        });

        function clearedTableCallback(transaction, results) {
            console.log('Table ' + tableName + ' has been cleared');
            $scope.isPrepared = true;
            $scope.$apply();

        }

    };

    function loadData() {
        data = testDataFactory.testData();
    }

    $scope.prepare = function () {
        $scope.prepareInProgress = true;
        $scope.$apply();
        loadData();
        clearTable();
        $scope.prepareInProgress = false;
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();

    };

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;

        var timeStart = new Date().getTime();
        $scope.db.transaction(function (tx) {
                for (var i = 0; i < amountOfData; i++) {

                    //data[i][0] + '' converts the id to a string
                    tx.executeSql("INSERT INTO " + tableName + "(id, address) VALUES(?,?)", [data[i][0] + '', JSON.stringify(data[i])]);

                }
            }, function errorHandler(transaction, error) {
                console.log("Error : " + transaction.message);
                console.log("Error : " + error.message);
            }, function () {
                var timeEnd = new Date().getTime();

                var timeDiff = timeEnd - timeStart;
                $scope.results.push({iteration: iteration, time: timeDiff});
                $scope.testInProgress = false;
                $scope.isPrepared = false;
                iteration++;
                $scope.$apply();

                console.log(amountOfData + ' items added');
            }
        );


    };

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        $scope.db = window.openDatabase(dbName, dbVersion, dbName, 1024 * 1024);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {

        //Define the structure of the database
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id TEXT PRIMARY KEY, address TEXT)');

    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log('errorHandlerWebSQL start');
        alert(e.message);
        console.log(e.message);
        console.log('errorHandlerWebSQL executed');
    };

});


