sdApp.controller('PE_SQLitePlugin_TestR1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, SQLDatabaseClearTable) {

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
    $scope.preparationText = 'Explain what the prepare function does...';
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
        SQLDatabaseClearTable.clearTable($scope.db, tableName, function () {
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

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < dataForPreparation.length; i++) {
                tx.executeSql("INSERT INTO " + tableName + "(id, address) VALUES(?,?)", [dataForPreparation[i][0] + '', JSON.stringify(dataForPreparation[i])]);
            }

        }, function errorHandler(transaction, error) {
            alert("Error : " + transaction.message);
            alert("Error : " + error.message);
        }, callback);

    }

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    }

    $scope.init= function () {
        console.log('init start');
        $scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        $scope.db.transaction($scope.createTable, $scope.errorHandler );
        console.log('init executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        console.log('createTable start');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id INTEGER PRIMARY KEY, address TEXT)');
        console.log('createTable executed');
    };

    $scope.errorHandler = function (e) {
        console.log('errorHandler start');
        console.log(e.message);
        console.log('errorHandler executed');
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