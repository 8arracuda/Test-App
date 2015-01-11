sdApp.controller('PE_SQLitePlugin_TestR2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var iteration = 1;

    var dataForPreparation;

    //TODO const was replaced with var - make these variables to CAPITAL LETTERS
    var dbName = "PE_TestR2";
    var tableName = "PE_TestR2";
    var dbVersion = "1.0";

    //bool value used for the status-light in the "open database" section
    $scope.databaseOpened = false;

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testR2a = PE_ParameterFactory.amountOfData_testR2a;
    var amountOfData_testR2b = PE_ParameterFactory.amountOfData_testR2b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'Read test - random addresses will be loaded';
    $scope.testName1 = 'Test R2-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR2a + ' items';
    $scope.testName2 = 'Test R2-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR2b + ' items';

    $scope.results = [];

    $scope.isPrepared = false;


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

    $scope.prepare = function () {
        $scope.prepareInProgress=false;
        $scope.$apply();
        clearTable();
        loadDataForPreparation();
        saveAddressData();
        $scope.prepareInProgress=false;
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();

    };

    function saveAddressData() {

        console.log('saveTable1ToSQLitePlugin start');

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < dataForPreparation.length; i++) {
                tx.executeSql("INSERT INTO " + tableName + "(id, firstName, lastName, street, zipcode, city, email, randomNumber1, randomNumber2) VALUES(?,?,?,?,?,?,?,?,?)", [dataForPreparation[i][0], dataForPreparation[i][1], dataForPreparation[i][2], dataForPreparation[i][3], dataForPreparation[i][4], dataForPreparation[i][5], dataForPreparation[i][6], dataForPreparation[i][7], dataForPreparation[i][8]]);
            }

            console.log(dataForPreparation.length + ' addresses saved in SQLitePlugin database  -' + tableName + '-?');

        }, function errorHandler(transaction, error) {
            alert("Error : " + transaction.message);
            alert("Error : " + error.message);
        });

        console.log('saveTable1ToSQLitePlugin executed');

    }

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

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

    $scope.initSQLitePlugin = function () {
        console.log('initSQLitePlugin start');
        $scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerSQLitePlugin);
        console.log('initSQLitePlugin executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        console.log('createTable start');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, street TEXT, zipcode TEXT, city TEXT, email TEXT, randomNumber1 INTEGER, randomNumber2 INTEGER)');
        console.log('createTable executed');
    };

    $scope.errorHandlerSQLitePlugin = function (e) {
        console.log('errorHandlerSQLitePlugin start');
        console.log(e.message);
        console.log('errorHandlerSQLitePlugin executed');
    };


    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;
        $scope.$apply();

        var addressIdsToLoad = testDataFactory.getRandomIndices();

        if (addressIdsToLoad.length < amountOfData) {
            alert('Warning: Too few address Ids defined. The test will produce wrong results!');
        }

        var timeStart = new Date().getTime();
        var onSuccessCounter = 0;

        $scope.db.transaction(function (tx) {

            for (var i = 0; i < amountOfData; i++) {

                tx.executeSql("SELECT * FROM " + tableName + " WHERE id = ?", [addressIdsToLoad[i]], function (transaction, results) {

                    //---Test-Output to check the returned values---
                    //console.log('check Test R2:' + JSON.stringify(results.rows.item(0)));

                    onSuccessCounter = onSuccessCounter + 1;

                    if (onSuccessCounter == amountOfData) {
                        var timeEnd = new Date().getTime();

                        var timeDiff = timeEnd - timeStart;
                        $scope.testInProgress = false;
                        $scope.results.push({iteration:  iteration,  time: timeDiff});
                        iteration++;
                        $scope.$apply();
                    }

                }, function (t, e) {
                    alert("couldn't read database (" + e.message + ")");
                });
            }

        });

    }

});