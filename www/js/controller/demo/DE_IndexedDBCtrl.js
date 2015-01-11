sdApp.controller('DE_IndexedDBCtrl', function ($scope, $rootScope) {

    $rootScope.section = 'DE';

    //<für alle Tabs>
    $scope.stringForRightButton = 'show keys';
    $scope.stringForTitle = 'IndexedDB';
    $scope.functionForRightButton = function () {
        $rootScope.toggle('myOverlay', 'on');
    };
    //</für alle Tabs>

    $scope.enableTab_singleValues = function () {
        $scope.tab = 1;
    };

    $scope.enableTab_strData = function () {
        $scope.tab = 2;
    };

    $scope.enableTab_mediaData = function () {
        $scope.tab = 3;
    };

    $scope.enableTab_singleValues();

    //Functions for the Overlay

    //$scope.dbName = "PG12xp";
    //$scope.dbVersion = "2";

    $scope.dbName = "TestAppDatabase";
    $scope.dbVersion = "1";

    $scope.listObjectStores = function () {

        console.log('function listObjectStores() called');
        var request = window.indexedDB.open($scope.dbName, $scope.dbVersion);

        request.onerror = function (event) {
            console.error('request.onerror');
            alert("Database error: " + event.target.errorCode);

        };
        request.onsuccess = function (event) {
            console.log('request.onsuccess');
            db = request.result;

            $scope.objectStores = db.objectStoreNames;

            $scope.$apply();

        };

    };

});