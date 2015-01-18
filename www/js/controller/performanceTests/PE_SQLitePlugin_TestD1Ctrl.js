sdApp.controller('PE_SQLitePlugin_TestD1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var iteration = 1;

    var dataForPreparation;

    var dbName = "PE_TestD1";
    var tableName = "PE_TestD1";
    var dbVersion = "1.0";

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testD1a = PE_ParameterFactory.amountOfData_testD1a;
    var amountOfData_testD1b = PE_ParameterFactory.amountOfData_testD1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'In this test x simple key-value pairs are saved.';
    $scope.testName1 = 'Test D1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testD1a + ' items';
    $scope.testName2 = 'Test D1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testD1b + ' items';

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

        if (testVariant == 'TestD1a') {
            amountOfData = amountOfData_testD1a;
        } else {
            amountOfData = amountOfData_testD1b;
        }
        console.log('selectedTestVariant= ' + $scope.selectedTestVariant + ' (amountOfData= ' + amountOfData + ')');

    };

    function clearTable(callback) {

        $scope.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM " + tableName, [], $scope.errorHandlerWebSQL);
        }, $scope.errorHandlerWebSQL, callback);

    }

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        $scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        console.log('createTable start');
        //Define the structure of the database
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id TEXT PRIMARY KEY, address TEXT)');
        console.log('createTable executed');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log(e.message);
    };

    function saveAddressData(callback) {

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < dataForPreparation.length; i++) {
                tx.executeSql("INSERT INTO " + tableName + "(id, address) VALUES(?,?)", [dataForPreparation[i][0] + '', JSON.stringify(dataForPreparation[i])]);
            }

        }, function errorHandler(transaction, error) {
            console.dir(transaction);
            console.dir(error);
        }, callback);

    }

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;

        var timeStart = new Date().getTime();
        $scope.db.transaction(function (tx) {
                for (var i = 0; i < amountOfData; i++) {

                    tx.executeSql("DELETE FROM PE_TestD1 WHERE id = ?", [i + '']);

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

            }
        );

    };

    $scope.prepare = function () {
        $scope.prepareInProgress = true;
        $scope.$apply();
        setTimeout(function () {
            clearTable(function () {
                loadDataForPreparation();
                saveAddressData(function () {
                    $scope.prepareInProgress = false;
                    $scope.isPrepared = true;
                    $scope.$apply();
                });

            });

        }, 1000);

    };

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    }


});