sdApp.controller('DE_WebSqlCtrl', function ($scope, $rootScope) {

    $rootScope.section = 'DE';

    //<für alle Tabs>
    $scope.stringForRightButton = 'show keys';
    //$scope.functionForRightButton = function () {
    //    $rootScope.toggle('myOverlay', 'on');
    //};
    $scope.stringForTitle = 'WebSQL';
    //</für alle Tabs>

    $scope.enableTab_singleValues= function () {
        $scope.tab = 1;
        $scope.functionForRightButton = function () {
            $rootScope.toggle('Overlay_WebSQL_Einzelwerte', 'on');
        };
    };

    $scope.enableTab_strData = function () {
        $scope.tab = 2;
        $scope.functionForRightButton = function () {
            $rootScope.toggle('Overlay_WebSQL_strData', 'on');
        };
    };

    $scope.enableTab_mediaData = function () {
        $scope.tab = 3;
        $scope.functionForRightButton = function () {
            $rootScope.toggle('Overlay_WebSQL_Mediendaten', 'on');
        };
    };

    //$scope.databases = [];
    //$scope.initWebSQL();
    //
    //
    //
    //
    //$scope.initWebSQL = function () {
    //    console.log('initWebSQL start');
    //    dbWebSQL = window.openDatabase("test", "1.0", "test", 2 * 1024 * 1024);
    //    //dbWebSQL.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL, $scope.dbReadyWebSQL);
    //    dbWebSQL.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL);
    //    console.log('initWebSQL executed');
    //}

    $scope.enableTab_singleValues();

    //Functions for the Overlay

    $scope.initWebSQL = function () {
        console.log('initWebSQL start');
        dbWebSQL = window.openDatabase("test", "1.0", "test", 2 * 1024 * 1024);
        //dbWebSQL.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL, $scope.dbReadyWebSQL);
        dbWebSQL.transaction($scope.setupWebSQL, $scope.errorHandlerWebSQL);
        console.log('initWebSQL executed');
        $scope.databaseOpened = true;
    };

    $scope.setupWebSQL = function (tx) {
        console.log('setupWebSQL start');
        tx.executeSql('CREATE TABLE IF NOT EXISTS strDaten(id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, street TEXT, city TEXT, zipcode TEXT, email TEXT)');
        console.log('setupWebSQL executed');
    };

    $scope.errorHandlerWebSQL = function (e) {
        console.log('errorHandlerWebSQL start');
        alert(e.message);
        console.log(e.message);
        console.log('errorHandlerWebSQL executed');
    };


    //for Einzelwerte
    $scope.showContentOfTableEinzelwerte = function () {

        console.log('showContentOfTableEinzelwerte start');
        $scope.data = [];
        tables = [];

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('SELECT * FROM einzelwerte', [], function (transaction, results) {

                $scope.dataForOverlayEinzelwerte = [];
                for (var j = 0; j < results.rows.length; j++) {
                    var row = results.rows.item(j);
                    $scope.dataForOverlayEinzelwerte.push(row);
                }

                //alert(JSON.stringify($scope.dataForOverlay));

                $scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database");
            });

        });

    };

    $scope.deleteContentOfTableEinzelwerte = function () {

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('DELETE FROM einzelwerte', [], function (transaction, results) {

                //$scope.dataForOverlay = [];
                //for (var j = 0; j < results.rows.length; j++) {
                //    var row = results.rows.item(j);
                //    $scope.dataForOverlay.push(row);
                //}

                //alert(JSON.stringify($scope.dataForOverlay));
                alert('all deleted from table -einzelwerte-');

                //$scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database");
            });

        });

    };


    //for StrDaten
    $scope.showContentOfTableStrData = function () {

        console.log('showContentOfTableStrDaten start');
        $scope.data = [];
        tables = [];

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('SELECT * FROM strDaten', [], function (transaction, results) {

                $scope.dataForOverlayStrData = [];
                for (var j = 0; j < results.rows.length; j++) {
                    var row = results.rows.item(j);
                    $scope.dataForOverlayStrData.push(row);
                }

                //alert(JSON.stringify($scope.dataForOverlayStrDaten));

                $scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database (" + e.message + ')');
            });

        });

    };

    $scope.deleteContentOfTableStrData = function () {

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('DELETE FROM strDaten', [], function (transaction, results) {

                //$scope.dataForOverlay = [];
                //for (var j = 0; j < results.rows.length; j++) {
                //    var row = results.rows.item(j);
                //    $scope.dataForOverlay.push(row);
                //}

                //alert(JSON.stringify($scope.dataForOverlay));
                alert('all deleted from table -strDaten-');

                //$scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database");
            });

        });

    };


    //for Mediendaten
    $scope.showContentOfTableMediendata = function () {

        console.log('showContentOfTableMediendaten start');
        $scope.data = [];
        tables = [];

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('SELECT * FROM mediendaten', [], function (transaction, results) {

                $scope.dataForOverlayMediendata = [];
                for (var j = 0; j < results.rows.length; j++) {
                    var row = results.rows.item(j);
                    $scope.dataForOverlayMediendata.push(row);
                }

                //alert(JSON.stringify($scope.dataForOverlay));

                $scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database");
            });

        });

    };

    $scope.deleteContentOfTableMediendata = function () {

        dbWebSQL.transaction(function (tx) {

            tx.executeSql('DELETE FROM mediendaten', [], function (transaction, results) {

                //$scope.dataForOverlay = [];
                //for (var j = 0; j < results.rows.length; j++) {
                //    var row = results.rows.item(j);
                //    $scope.dataForOverlay.push(row);
                //}

                //alert(JSON.stringify($scope.dataForOverlay));
                alert('all deleted from table -mediendaten-');

                //$scope.$apply();

            }, function (t, e) {
                // couldn't read database
                //span.textContent = '(unknown: ' + e.message + ')';
                alert("couldn't read database");
            });

        });

    };

});