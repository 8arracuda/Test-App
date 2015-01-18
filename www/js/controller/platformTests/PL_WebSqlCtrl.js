sdApp.controller('PL_WebSqlCtrl', function ($scope, $rootScope, testDataFactory, TestHelperFactory) {

    $rootScope.section = 'PL';

    var tableName;
    var dbName;
    var dbVersion;
    var dbSize;


    $scope.result = '';
    $scope.isPrepared = false;
    $scope.testInProgress = false;

    var keyPrefix;
    var value;

    $scope.prepare = function () {
        clearTable();
        $scope.isPrepared = true;
        $scope.currentIteration = '';
        $scope.$apply();
    };


    $scope.startPlatformTest = function () {
        console.log('startPlatformTest');

        var errorAlreadyShown = false;

        $scope.currentIteration = 0;

        var datasetStringToSave = JSON.stringify(testDataFactory.getDatasetForPlatformTest());

        function nextTransactions() {

            $scope.db.transaction(function (tx) {

                    for (var i = 0; i < 5; i++) {


                        var datasetName = 'dataset_' + $scope.currentIteration;

                        tx.executeSql("INSERT INTO " + tableName + "(id, dataset) VALUES(?,?)", [datasetName, datasetStringToSave]);

                        $scope.currentIteration += 1;
                    }

                },
                function errorHandler(transaction) {

                    if (transaction.code == "4") { //Quota Error
                        if (errorAlreadyShown == false) {
                            $scope.result = {
                                description: 'QuotaExceededError',
                                exceptionInIteration: $scope.currentIteration
                            };
                            $scope.testInProgress = false;
                            $scope.$apply();
                            errorAlreadyShown = true;
                        }
                    }

                    console.log("Error : " + transaction.message);
                    console.log("Error : " + transaction.code);
                }, function onSuccessHandler() {
                    console.log('onSuccess ' + $scope.currentIteration);
                    $scope.$apply();
                    if (errorAlreadyShown == false) {
                        nextTransactions();
                    }
                });
        }

        errorAlreadyShown = false;
        $scope.testInProgress = true;
        $scope.$apply();

        //start the test a bit later, to allow the UI to update
        setTimeout(function () {
            nextTransactions();
        }, 500);
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
    }

    $scope.initWebSQL = function (variant) {

        if (variant == "A") {

            dbName = 'PL_WebSQL_VariantA';
            tableName = 'PL_WebSQL_VariantA';
            dbVersion = '1.0';
            dbSize = 1024*1024;
        } else {
            dbName = 'PL_WebSQL_VariantB';
            tableName = 'PL_WebSQL_VariantB';
            dbVersion = '1.0';
            dbSize = 4*1024*1024;
        }

        $scope.db = window.openDatabase(dbName, dbVersion, dbName, dbSize);
        $scope.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id TEXT PRIMARY KEY, dataset TEXT)');
        }, $scope.errorHandlerWebSQL);
        $scope.databaseOpened = true;
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log(e.message);
    };

});