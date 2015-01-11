sdApp.controller('PE_SQLitePlugin_TestU1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory) {

    var iteration = 1;

    var dataForPreparation;
    var dataForUpdate;

    var dbName = "PE_TestU1";
    var tableName = "PE_TestU1";
    var dbVersion = "1.0";

    $scope.testInProgress = false;

    var amountOfData;
    var amountOfData_testU1a = PE_ParameterFactory.amountOfData_testU1a;
    var amountOfData_testU1b = PE_ParameterFactory.amountOfData_testU1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'In this test x simple key-value pairs are saved.';
    $scope.testName1 = 'Test U1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testU1a + ' items';
    $scope.testName2 = 'Test U1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testU1b + ' items';

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

        if (testVariant == 'TestU1a') {
            amountOfData = amountOfData_testU1a;
        } else {
            amountOfData = amountOfData_testU1b;
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

    $scope.initSQLitePlugin = function () {
        console.log('initSQLitePlugin start');
        $scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        //$scope.db.transaction($scope.setupSQLitePlugin, $scope.errorHandlerSQLitePlugin, $scope.dbReadySQLitePlugin);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerSQLitePlugin);
        //TODO rename all CreateTableEinzelwerte / CreateTableMediendaten method names to createTable!
        console.log('initSQLitePlugin executed');
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        console.log('createTable start');

        //Define the structure of the database
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id TEXT PRIMARY KEY, address TEXT)');
        console.log('createTable executed');
    };

    $scope.errorHandlerSQLitePlugin = function (e) {
        console.log('errorHandlerSQLitePlugin start');
        alert(e.message);
        console.log(e.message);
        console.log('errorHandlerSQLitePlugin executed');
    };

    //$scope.prepare = function () {
    //    clearTable();
    //
    //};

    function saveAddressData() {
        $scope.db.transaction(function (tx) {
                for (var i = 0; i < dataForPreparation.length; i++) {

                    //data[i][0] + '' because otherwise id's like 1.0, 2.0 are stored
                    tx.executeSql("INSERT INTO " + tableName + "(id, address) VALUES(?,?)", [dataForPreparation[i][0] + '', JSON.stringify(dataForPreparation[i])]);

                }
            }, function errorHandler(transaction, error) {
                console.log("Error : " + transaction.message);
                //console.log("Error : " + error.message);
            }
        );

    }

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;

        onSuccessCounter = 0;
        var timeStart = new Date().getTime();
        $scope.db.transaction(function (tx) {
                for (var i = 0; i < amountOfData; i++) {

                    tx.executeSql("UPDATE " + tableName + " SET address = ? WHERE id = ?", [JSON.stringify(dataForUpdate[i]), dataForUpdate[i][0] + '']);

                    onSuccessCounter = onSuccessCounter + 1;

                    if (onSuccessCounter == amountOfData) {
                        var timeEnd = new Date().getTime();

                        var timeDiff = timeEnd - timeStart;
                        $scope.results.push({iteration:  iteration,  time: timeDiff});
                        $scope.testInProgress = false;
                        $scope.isPrepared = false;
                        iteration++;
                        $scope.$apply();
                    }

                }
            }, function errorHandler(transaction, error) {
                console.log("Error : " + transaction.message);
                console.log("Error : " + error.message);
            }
        );



        console.log(amountOfData + ' items updated');

    };


    $scope.prepare = function () {
        $scope.prepareInProgress=true;
        $scope.$apply();
        clearTable();
        loadDataForPreparation();
        console.dir(dataForPreparation);
        saveAddressData();
        loadDataForUpdate();
        $scope.prepareInProgress=false;
        $scope.isPrepared = true;
        console.log('prepare function finished');
        $scope.$apply();
    };

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    }

    function loadDataForUpdate() {
        dataForUpdate = testDataFactory.testDataForUpdateTests();
    }


});