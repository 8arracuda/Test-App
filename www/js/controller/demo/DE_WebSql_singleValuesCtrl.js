sdApp.controller('DE_WebSql_singleValuesCtrl', function ($scope) {

    //bool value used for the status-light in the "open database" section
    $scope.databaseOpened = false;

    $scope.keyToLoad = "a";
    $scope.keyToSave = "a";
    $scope.valueToSave = "b";
    $scope.keyToRemove = "";

    var dbName = "singleValues";
    var dbVersion = "1.0";


    $scope.save= function () {

        console.log('addRow start');
//        $scope.db.transaction(function (tx) {
//            var msg = $scope.inputString;
//            var d = new Date();
//            tx.executeSql("INSERT INTO einzelwerte(log, created) VALUES(?,?)", [$scope.keyToSave, $scope.valueToSave]);
//        }, $scope.errorHandlerWebSQL, function () {
//            console.log('error occured in addRow')
//        });

        $scope.db.transaction(function (tx) {

            tx.executeSql("INSERT INTO einzelwerte(keyName, value) VALUES(?,?)", [$scope.keyToSave, $scope.valueToSave]);
        }, function errorHandler(transaction, error) {
            alert("Error : " + transaction.message);
            //alert("Error : " + error.message);
        });

        console.log('addRow executed');
    };



    $scope.inputString = "";

    $scope.getTablesList = function () {

        $scope.tablesInDatabase = [];

        $scope.db.transaction(function (tx) {

            tx.executeSql('SELECT * FROM sqlite_master WHERE type="table"', [], function (transaction, results) {

                for (var j = 0; j < results.rows.length; j++) {
                    var row = results.rows.item(j);
                    $scope.tablesInDatabase.push(row);
                }
                $scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database");
            });

            //alert('tables:' + JSON.stringify(tables));
        });

    };

    //$scope.getAllValues = function () {
    //
    //    console.log('getAllValues start');
    //    $scope.data = [];
    //    tables = [];
    //
    //    $scope.db.transaction(function (tx) {
    //
    //        tx.executeSql('SELECT * FROM einzelwerte', [], function (transaction, results) {
    //
    //$scope.$apply();
    //
    //        }, function (t, e) {
    //            // couldn't read database
    //
    //            alert("couldn't read database");
    //        });
    //
    //
    //    });
    //
    //    //$scope.$apply();
    //};

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        $scope.db = window.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        //$scope.db.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL, $scope.dbReadyWebSQL);
        $scope.db.transaction($scope.createTableEinzelwerte, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.createTableEinzelwerte = function (tx) {
        console.log('createTableEinzelwerte start');

        //Define the structure of the database
        tx.executeSql('CREATE TABLE IF NOT EXISTS einzelwerte(keyName TEXT PRIMARY KEY, value TEXT)');
        console.log('createTableEinzelwerte executed');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log('errorHandlerWebSQL start');
        alert(e.message);
        console.log(e.message);
        console.log('errorHandlerWebSQL executed');
    };

/*    $scope.dbReadyWebSQL = function () {
        console.log('dbReadyWebSQL start');
        $scope.db.transaction(function (tx) {

            tx.executeSql("INSERT INTO einzelwerte(keyName, value) VALUES(?, ?)", [$scope.keyToSave, $scope.valueToSave]);
            console.log('dbReadyWebSQL executed');
        }, $scope.errorHandlerWebSQL, function () {
            console.log('error occured in dbReadyWebSQL')
        });
    };*/

    //$scope.deleteWebSQL = function () {
    //    console.log('deleteWebSQL start');
    //    $scope.db.transaction(function (tx) {
    //        tx.executeSql("DELETE FROM einzelwerte");
    //        console.log('deleteWebSQL executed');
    //    }, $scope.errorHandlerWebSQL, function () {
    //        console.log('error occured in db.deleteWebSQL')
    //    });
    //};

    //$scope.testWebSQL = function () {
    //    console.log('testWebSQL start');
    //    $scope.db.transaction(function (tx) {
    //        tx.executeSql("SELECT * FROM einzelwerte ORDER BY created DESC", [], $scope.gotResults, $scope.errorHandlerWebSQL);
    //
    //    });
    //    console.log('testWebSQL executed');
    //};


    //$scope.check = function () {
    //
    //    $scope.db.transaction(function (tx) {
    //        tx.executeSql("SELECT * FROM einzelwerte", [], $scope.gotResults, $scope.errorHandlerWebSQL);
    //    });
    //};

    //$scope.wipeDatabase = function () {
    //
    //    var answer = confirm('Do you really want to remove all entries from the database -einzelwerte-?');
    //
    //    if (answer) {
    //        alert('will delete');
    //
    //        $scope.db.transaction(function (tx) {
    //            tx.executeSql("DELETE FROM einzelwerte", [], $scope.gotResults_Check, $scope.errorHandlerWebSQL);
    //        });
    //        // $scope.$apply();
    //
    //    } else {
    //        alert('will not delete');
    //    }
    //};

    $scope.deleteTableEinzelwerte = function () {

        $scope.db.transaction(function (tx) {
            tx.executeSql('DROP TABLE einzelwerte', [], $scope.gotResults_Check, $scope.errorHandlerWebSQL);
        });

    };

    //$scope.gotResults_Check = function (tx, results) {
    //    console.log('gotResults_Check started');
    //    if (results.rows.length == 0) {
    //        $scope.databaseIsEmpty = true;
    //    } else {
    //        $scope.databaseIsEmpty = false;
    //    }
    //    console.log('gotResults_Check executed');
    //
    //};

    //$scope.gotResults = function (tx, results) {
    //
    //    console.log('gotResults start');
    //
    //    var resultArray = [];
    //
    //    var len = results.rows.length, i;
    //    for (i = 0; i < len; i++) {
    //
    //        resultArray.push(results.rows.item(i));
    //        if (i == 1) {
    //            alert(JSON.stringify(results.rows.item(i)));
    //        }
    //    }
    //
    //    $scope.resultArray = resultArray;
    //
    //    //triggers AngularJS to reload
    //    $scope.$apply();
    //
    //    console.log('gotResults executed');
    //};

    $scope.updateView = function () {

        $scope.keyLoaded = $scope.keyToLoad;

        $scope.db.transaction(function (tx) {

            console.log('SELECT * FROM einzelwerte WHERE keyName = ' +  $scope.keyToLoad);

            tx.executeSql("SELECT * FROM einzelwerte WHERE keyName = ?", [$scope.keyToLoad], function (transaction, results) {

                if (results.rows.length == 0) {
                    $scope.valueLoadedFromWebSQL = 'does not exist';
                } else {
                    $scope.valueLoadedFromWebSQL = 'has value "' + results.rows.item(0).value + '"';
                }

                $scope.$apply();

            }, function (t, e) {
                // couldn't read database
                alert("couldn't read database (" + e.message + ")");
            });

        });

    };

    $scope.removeKeyFromWebSQL = function () {

        $scope.db.transaction(function (tx) {

            tx.executeSql('DELETE FROM einzelwerte WHERE keyName = ?', [$scope.keyToLoad], function (transaction, results) {

                console.log('deleted rows with key: ' + $scope.keyToLoad);

            }, function (t, e) {
                alert("couldn't read database (" + e.message + ")");
            });

        });

    };

});