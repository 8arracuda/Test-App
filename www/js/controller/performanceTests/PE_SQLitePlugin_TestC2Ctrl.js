sdApp.controller('PE_SQLitePlugin_TestC2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {
    var iteration = 1;

    var dataForPreparation;
    var dbName = "PE_TestC2";
    var tableName = "PE_TestC2";
    var dbVersion = "1.0";

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testC2a = PE_ParameterFactory.amountOfData_testC2a;
    var amountOfData_testC2b = PE_ParameterFactory.amountOfData_testC2b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'In this test x simple key-value pairs are saved.';
    $scope.testName1 = 'Test C2-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testC2a + ' items';
    $scope.testName2 = 'Test C2-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testC2b + ' items';

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

        if (testVariant == 'TestC2a') {
            amountOfData = amountOfData_testC2a;
        } else {
            amountOfData = amountOfData_testC2b;
        }
        console.log('selectedTestVariant= ' + $scope.selectedTestVariant + ' (amountOfData= ' + amountOfData + ')');

    };

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

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    }

    $scope.prepare = function () {
        $scope.prepareInProgress=true;
        $scope.$apply();
        loadDataForPreparation();
        clearTable();
        $scope.prepareInProgress=false;
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();

    };

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;


        var timeStart = new Date().getTime();
        $scope.db.transaction(function (tx) {
                for (var i = 0; i < amountOfData; i++) {

                    var currentAddress = dataForPreparation[i];
                    tx.executeSql("INSERT INTO " + tableName + "(id, firstName, lastName, street, zipcode, city, email, randomNumber1, randomNumber2) VALUES(?,?,?,?,?,?,?,?,?)", [currentAddress[0], currentAddress[1], currentAddress[2], currentAddress[3], currentAddress[4], currentAddress[5], currentAddress[6], currentAddress[7], currentAddress[8]]);

                }
            }, function errorHandler(transaction, error) {
                console.log("Error : " + transaction.message);
                console.log("Error : " + error.message);
            }, function () {
                var timeEnd = new Date().getTime();

                var timeDiff = timeEnd - timeStart;
                $scope.results.push({iteration:  iteration,  time: timeDiff});
                $scope.testInProgress = false;
                $scope.isPrepared = false;
                iteration++;
                $scope.$apply();

                console.log(amountOfData + ' items added');
            }
        );



    };

    $scope.initSQLitePlugin = function () {
        console.log('initSQLitePlugin start');
        $scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerSQLitePlugin);
        console.log('initSQLitePlugin executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {

        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, street TEXT, zipcode TEXT, city TEXT, email TEXT, randomNumber1 INTEGER, randomNumber2 INTEGER)');

    };

    $scope.errorHandlerSQLitePlugin = function (e) {
        console.log('errorHandlerSQLitePlugin start');
        alert(e.message);
        console.log(e.message);
        console.log('errorHandlerSQLitePlugin executed');
    };

});