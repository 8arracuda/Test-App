sdApp.controller('DE_PGSQLite_singleValuesCtrl', function ($scope) {

    $scope.databaseOpened =  false;
    $scope.keyToLoad = "a";
    $scope.keyToSave = "a";
    $scope.valueToSave = "b";
    $scope.keyToRemove = "";

    $scope.save= function () {

        if (dbWebSQL == null) {
            alert('Database needs to be opened first.');
        }

        console.log('addRow start');
//        dbWebSQL.transaction(function (tx) {
//            var msg = $scope.inputString;
//            var d = new Date();
//            tx.executeSql("INSERT INTO einzelwerte(log, created) VALUES(?,?)", [$scope.keyToSave, $scope.valueToSave]);
//        }, $scope.errorHandlerWebSQL, function () {
//            console.log('error occured in addRow')
//        });

        dbWebSQL.transaction(function (tx) {

            tx.executeSql("INSERT INTO einzelwerte(keyName, value) VALUES(?,?)", [$scope.keyToSave, $scope.valueToSave]);
        }, function errorHandler(transaction, error) {
            alert("Error : " + transaction.message);
            alert("Error : " + error.message);
        });

        console.log('addRow executed');
    };

    var dbWebSQL;
    $scope.inputString = "";

    $scope.getTablesList = function () {

        $scope.tablesInDatabase = [];

        dbWebSQL.transaction(function (tx) {

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

    $scope.getAllValues = function () {

        console.log('getAllValues start');
        $scope.data = [];
        tables = [];

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('SELECT * FROM einzelwerte', [], function (transaction, results) {

                for (var j = 0; j < results.rows.length; j++) {
                    var row = results.rows.item(j);
                    $scope.data.push(row);
                    //alert(row['keyName']);
                }
                $scope.$apply();

            }, function (t, e) {
                // couldn't read database

                alert("couldn't read database");
            });


        });

        //$scope.$apply();
    };

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        //dbWebSQL = window.openDatabase("test", "1.0", "test", 2 * 1024 * 1024);
        dbWebSQL = window.sqlitePlugin.openDatabase({name: "my.db"});
        //dbWebSQL.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL, $scope.dbReadyWebSQL);
        dbWebSQL.transaction($scope.createTableEinzelwerte, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.createTableEinzelwerte = function (tx) {
        console.log('createTableEinzelwerte start');
        tx.executeSql('CREATE TABLE IF NOT EXISTS einzelwerte(id INTEGER PRIMARY KEY AUTOINCREMENT, keyName TEXT, value TEXT)');
        console.log('createTableEinzelwerte executed');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log('errorHandlerWebSQL start');
        alert(e.message);
        console.log(e.message);
        console.log('errorHandlerWebSQL executed');
    };

    $scope.dbReadyWebSQL = function () {
        console.log('dbReadyWebSQL start');
        dbWebSQL.transaction(function (tx) {

            tx.executeSql("INSERT INTO einzelwerte(keyName, value) VALUES(?, ?)", [$scope.keyToSave, $scope.valueToSave]);
            console.log('dbReadyWebSQL executed');
        }, $scope.errorHandlerWebSQL, function () {
            console.log('error occured in dbReadyWebSQL')
        });
    };

    $scope.deleteWebSQL = function () {
        console.log('deleteWebSQL start');
        dbWebSQL.transaction(function (tx) {
            tx.executeSql("DELETE FROM einzelwerte");
            console.log('deleteWebSQL executed');
        }, $scope.errorHandlerWebSQL, function () {
            console.log('error occured in db.deleteWebSQL')
        });
    };

    $scope.testWebSQL = function () {
        console.log('testWebSQL start');
        dbWebSQL.transaction(function (tx) {
            tx.executeSql("SELECT * FROM einzelwerte ORDER BY created DESC", [], $scope.gotResults, $scope.errorHandlerWebSQL);

        });
        console.log('testWebSQL executed');
    };


    $scope.check = function () {

        dbWebSQL.transaction(function (tx) {
            tx.executeSql("SELECT * FROM einzelwerte", [], $scope.gotResults, $scope.errorHandlerWebSQL);
        });
    };

    $scope.wipeDatabase = function () {

        var answer = confirm('Do you really want to remove all entries from the database -einzelwerte-?');

        if (answer) {
            alert('will delete');

            dbWebSQL.transaction(function (tx) {
                tx.executeSql("DELETE FROM einzelwerte", [], $scope.gotResults_Check, $scope.errorHandlerWebSQL);
            });
            // $scope.$apply();

        } else {
            alert('will not delete');
        }
    };

    $scope.deleteTableEinzelwerte = function () {

        dbWebSQL.transaction(function (tx) {
            tx.executeSql('DROP TABLE einzelwerte', [], $scope.gotResults_Check, $scope.errorHandlerWebSQL);
        });

    };

    $scope.gotResults_Check = function (tx, results) {
        console.log('gotResults_Check started');
        if (results.rows.length == 0) {
            $scope.databaseIsEmpty = true;
        } else {
            $scope.databaseIsEmpty = false;
        }
        console.log('gotResults_Check executed');

    };

    $scope.gotResults = function (tx, results) {

        console.log('gotResults start');

        var resultArray = [];

        var len = results.rows.length, i;
        for (i = 0; i < len; i++) {

            resultArray.push(results.rows.item(i));
            if (i == 1) {
                alert(JSON.stringify(results.rows.item(i)));
            }
        }

        $scope.resultArray = resultArray;

        //triggers AngularJS to reload
        $scope.$apply();

        console.log('gotResults executed');
    };

    $scope.updateEinzelwerteView = function () {

        $scope.keyLoaded = $scope.keyToLoad;

        dbWebSQL.transaction(function (tx) {

            tx.executeSql("SELECT * FROM einzelwerte WHERE keyName = ?", [$scope.keyToLoad], function (transaction, results) {


                $scope.valuesLoadedFromWebSQL = [];

                for (var j = 0; j < results.rows.length; j++) {
                    $scope.valuesLoadedFromWebSQL.push(results.rows.item(j));

                }

                $scope.$apply();

            }, function (t, e) {
                // couldn't read database
                alert("couldn't read database (" + e.message + ")");
            });

        });

    };

    $scope.removeKeyFromWebSQL = function () {

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('DELETE FROM einzelwerte WHERE keyName = ?', [$scope.keyToLoad], function (transaction, results) {

                console.log('deleted rows with key: ' + $scope.keyToLoad);

            }, function (t, e) {
                // couldn't read database
                alert("couldn't read database (" + e.message + ")");
            });

        });


    };

});