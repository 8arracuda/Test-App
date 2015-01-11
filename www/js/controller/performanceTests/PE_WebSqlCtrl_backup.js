sdApp.controller('PE_WebSqlCtrl', function ($scope, $rootScope) {

    $rootScope.section = 'PE';

    var dbName = "performance_tests";
    var dbVersion = "1.0";

    $scope.databaseOpened = false;

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        $scope.db = window.openDatabase(dbName, dbVersion, dbName, 2 * 1024 * 1024);
        $scope.db.transaction($scope.createTableStrDaten, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.createTableStrDaten = function (tx) {
        console.log('createTableStrDaten start');
        // tx.executeSql('CREATE TABLE IF NOT EXISTS performance_tests(id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, street TEXT, zipcode TEXT, city TEXT, email TEXT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS performance_tests(id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, street TEXT, zipcode TEXT, city TEXT, email TEXT, randomNumber1 INTEGER, randomNumber2 INTEGER)');
        console.log('createTableStrDaten executed');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log('errorHandlerWebSQL start');
        //alert(e.message);
        console.log(e.message);
        console.log('errorHandlerWebSQL executed');
    };



    $scope.startPerformanceTest_save_onlyOne = function () {

        var timeStart = new Date().getTime();

        $scope.db.transaction(function (tx) {


//TODO needs to be changed - new dataset format
            //tx.executeSql("INSERT INTO performance_tests(keyName, value) VALUES(?,?)", [$scope.keyToSave, $scope.valueToSave]);
        }, function errorHandler(transaction, error) {
            alert("Error : " + transaction.message);
            //alert("Error : " + error.message);
        });




    };

});