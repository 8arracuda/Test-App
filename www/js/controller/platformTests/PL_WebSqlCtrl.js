sdApp.controller('PL_WebSqlCtrl', function ($scope, $rootScope, testDataFactory, TestHelperFactory) {

    $rootScope.section = 'PL';

    var tableName = 'PL_WebSQL';
    var dbName = 'PL_WebSQL';
    var dbVersion = '1.0';

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


    //$scope.startPlatformTest = function () {
    //    console.log('startPlatformTest');
    //    //localStorage.setItem(keyPrefix + '' + fillWithZeroes(10,i), value);
    //    $scope.loop = 0;
    //
    //    var i;
    //    function nextLoop() {
    //
    //
    //        $scope.db.transaction(function (tx) {
    //                //var limit = 50000;
    //                var limit = 100000;
    //                i = $scope.currentIteration;
    //                //for (var i = 0; i < limit; i++) {
    //                for (; i < ($scope.currentIteration + limit); i++) {
    //
    //                    tx.executeSql("INSERT INTO " + tableName + "(keyName, Value) VALUES(?,?)", [keyPrefix + '' + fillWithZeroes(10, i), value]);
    //
    //                }
    //                $scope.currentIteration = (parseInt($scope.currentIteration) + limit);
    //
    //            }, function errorHandler(transaction, error) {
    //
    //                if (transaction.code == transaction.QUOTA_ERR) {
    //                    alert('quota error at ' + i);
    //                }
    //                    alert('some error...');
    //                console.log('is there a .code that contains QUOTA_ERR?');
    //                console.dir(transaction);
    //                console.log("Error : " + transaction.message);
    //                console.log("Error : " + error.message);
    //            }, function onSuccessHandler() {
    //                $scope.loop = $scope.loop + 1;
    //                //if ($scope.loop < 10) {
    //                //  nextLoop();
    //                //}
    //
    //                setTimeout(
    //                    function () {
    //                        //to update the UI - gives the user an update about the progress as the test progresses
    //                        $scope.$apply();
    //                        setTimeout(
    //                            nextLoop(parseInt($scope.currentIteration)), 500);
    //                    }, 1000);
    //
    //                console.log('added some more things - i:' + i);
    //            }
    //        );
    //
    //    }
    //
    //    //start the test
    //    $scope.currentIteration = 0;
    //    nextLoop();
    //
    //
    //};

    //$scope.startPlatformTest = function () {
    //
    //    $scope.testInProgress = true;
    //
    //    var datasetArray = [];
    //    for (var i=0; i<100; i++) {
    //        datasetArray.push(testDataFactory.getDatasetWithOffset(i));
    //    }
    //
    //    var timeStart = new Date().getTime();
    //    $scope.db.transaction(function (tx) {
    //            for (var i = 0; i < amountOfData; i++) {
    //                //
    //                //var timeStart = new Date().getTime();
    //                //timeDiffSum += new Date().getTime() - timeStart;
    //                tx.executeSql("INSERT INTO " + tableName + "(keyName, value) VALUES(?,?)", ['dataset_' + i, datasetArray[i]]);
    //
    //            }
    //        }, function errorHandler(transaction, error) {
    //            console.log("Error : " + transaction.message);
    //            console.log("Error : " + error.message);
    //        }, function () {
    //            console.log('success callback');
    //            //timeDiffSum += new Date().getTime() - timeStart;
    //            var timeEnd = new Date().getTime();
    //            var timeDiff = timeEnd - timeStart;
    //            $scope.results.push({iteration:  iteration,  time: timeDiff });
    //            $scope.testInProgress = false;
    //            $scope.isPrepared = false;
    //            iteration++;
    //            $scope.$apply();
    //        }
    //    );
    //
    //};

    $scope.startPlatformTest = function () {
        console.log('startPlatformTest');

        var errorAlreadyShown = false;

        $scope.currentIteration = 0;

        //var datasetStringToSave = testDataFactory.getDatasetWithOffset(0);
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

                    //if (transaction.code == transaction.QUOTA_ERR) {
                    if (transaction.code == "4") { //Quota Error
                        if (errorAlreadyShown == false) {
                                $scope.result = { description: 'QuotaExceededError', exceptionInIteration: $scope.currentIteration};
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
                    //continue if there was no error
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

    };

    $scope.initWebSQL= function () {
        console.log('initWebSQL');
        $scope.db = window.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        //$scope.db = sqlitePlugin.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        //$scope.db.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL, $scope.dbReadyWebSQL);
        $scope.db.transaction($scope.createTable, $scope.errorHandlerWebSQL);
        $scope.databaseOpened = true;
    };

    $scope.createTable = function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(id TEXT PRIMARY KEY, dataset TEXT)');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log(e.message);
    };

});