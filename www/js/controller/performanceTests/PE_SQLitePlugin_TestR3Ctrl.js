sdApp.controller('PE_SQLitePlugin_TestR3Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var iteration = 1;

    var dbName = "PE_TestR3";
    var tableName = "PE_TestR3";
    var dbVersion = "1.0";

    //bool value used for the status-light in the "open database" section
    $scope.databaseOpened = false;

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testR3a = PE_ParameterFactory.amountOfData_testR3a;
    var amountOfData_testR3b = PE_ParameterFactory.amountOfData_testR3b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'Test R3-6';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR3a + ' items';
    $scope.testName2 = 'Test R3-24';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR3b + ' items';

    $scope.results = [];

    $scope.isPrepared = false;


    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestR3a') {
            amountOfData = amountOfData_testR3a;
        } else {
            amountOfData = amountOfData_testR3b;
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
        clearTable();
        saveAddressData();

    };

    function saveAddressData() {

        $scope.db.transaction(function (tx) {
                for (var i = 0; i < amountOfData; i++) {
                    var datasetString = testDataFactory.getDatasetWithOffset(i);
                    tx.executeSql("INSERT INTO " + tableName + "(id, dataset) VALUES(?,?)", ['dataset_' + i, JSON.stringify(datasetString)]);

                }
            }, function errorHandler(transaction, error) {
                console.log("Error : " + transaction.message);
                console.log("Error : " + error.message);
            }
        );

        $scope.isPrepared = false;
        $scope.$apply();

    }


    function clearTable() {

        $scope.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM " + tableName, [], clearedTableCallback, $scope.errorHandlerSQLitePlugin);
        });

        function clearedTableCallback(transaction, results) {
            console.log('Table ' + tableName + ' has been cleared');
            $scope.isPrepared = true;
            $scope.$apply();

        }

    };

    $scope.initSQLitePlugin = function () {
        console.log('initSQLitePlugin start');
        $scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        //$scope.db.transaction($scope.setupSQLitePlugin, $scope.errorHandlerSQLitePlugin, $scope.dbReadySQLitePlugin);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerSQLitePlugin);
        console.log('initSQLitePlugin executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        console.log('createTableStrDaten start');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id TEXT PRIMARY KEY, dataset TEXT)');
        console.log('createTableStrDaten executed');
    };

    $scope.errorHandlerSQLitePlugin = function (e) {
        console.log('errorHandlerSQLitePlugin start');
        console.log(e.message);
        console.log('errorHandlerSQLitePlugin executed');
    };

    //$scope.startPerformanceTest = function () {
    //
    //    $scope.testInProgress = true;
    //    $scope.$apply();
    //
    //    var timeStart = new Date().getTime();
    //
    //    $scope.db.transaction(function (tx) {
    //
    //        for (var i = 0; i < amountOfData; i++) {
    //
    //            tx.executeSql("SELECT * FROM " + tableName + " WHERE id = ?", ['dataset_' + i], function (transaction, results) {
    //
    //                //---Test-Output to check the returned values---
    //                //console.log('check Test R3:' + JSON.stringify(results.rows.item(0)).substr(1,100));
    //            });
    //
    //        }
    //        onSuccessCounter = onSuccessCounter + 1;
    //
    //    }, function errorHandler(transaction, error) {
    //        console.log("Error : " + transaction.message);
    //        console.log("Error : " + error.message);
    //    }, function () {
    //        var timeEnd = new Date().getTime();
    //
    //        var timeDiff = timeEnd - timeStart;
    //        $scope.results.push({iteration: iteration, time: timeDiff});
    //        $scope.testInProgress = false;
    //        iteration++;
    //        $scope.$apply();
    //
    //    });
    //
    //};

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;
        $scope.$apply();

        var timeStart = new Date().getTime();

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < amountOfData; i++) {

                tx.executeSql("SELECT * FROM " + tableName + " WHERE id = ?", ['dataset_' + i], function (transaction, results) {

                    //---Test-Output to check the returned values---
                    console.log('check Test R3:' + JSON.stringify(results.rows.item(0)).substr(1,100));
                });

            }


        }, function errorHandler(transaction, error) {
            console.log("Error : " + transaction.message);
            console.log("Error : " + error.message);
        }, function () {
            var timeEnd = new Date().getTime();

            var timeDiff = timeEnd - timeStart;
            $scope.results.push({iteration: iteration, time: timeDiff});
            $scope.testInProgress = false;
            iteration++;
            $scope.$apply();

        });

    };

});