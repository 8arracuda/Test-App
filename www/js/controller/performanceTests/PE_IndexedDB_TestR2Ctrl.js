sdApp.controller('PE_IndexedDB_TestR2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, IndexedDBClearObjectStore) {
    var iteration = 1;

    var dataForPreparation;

    var dbName = "PE_TestR2";
    var objStoreName = "PE_TestR2";

    $scope.databaseOpened = false;
    $scope.testInProgress = false;
    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testR2a = PE_ParameterFactory.amountOfData_testR2a;
    var amountOfData_testR2b = PE_ParameterFactory.amountOfData_testR2b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Prepare will clear all data stored in objectStore ' + objStoreName + ". Then it will save the data needed for the test.";
    $scope.mainTestDecription = 'In this test x simple key-value pairs are saved.';
    $scope.testName1 = 'Test R2-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR2a + ' items';
    $scope.testName2 = 'Test R2-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR2b + ' items';

    $scope.results = [];

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    };

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

    $scope.closeDatabase = function () {
        $scope.db.close();
        console.log('database closed');
        $scope.isPrepared = false;
        $scope.databaseOpened = null;
        $scope.$apply();
    };

    $scope.openDatabase = function () {
        console.log('openDatabase start');

        //Quelle: https://developer.mozilla.org/de/docs/IndexedDB/IndexedDB_verwenden
        if (!window.indexedDB) {
            window.alert("Ihr Browser unterstützt keine stabile Version von IndexedDB. Dieses und jenes Feature wird Ihnen nicht zur Verfügung stehen.");
        } else {

            var request = window.indexedDB.open(dbName, 2);

            request.onerror = function (event) {
                console.error('request.onerror');
                alert("Database error: " + event.target.errorCode);

            };
            request.onsuccess = function (event) {
                console.log('request.onsuccess (in openDatabase)');
                $scope.db = request.result;

                //for updating the "status-light" on the openDatabase button
                $scope.databaseOpened = true;
                $scope.$apply();
            };

            request.onupgradeneeded = function (event) {

                $scope.db = event.target.result;

                //on update: when objectStore existed
                //before it needs to be deleted, before it's created again with new keys.
                //$scope.db.deleteObjectStore(objStoreName);

                $scope.db.createObjectStore(objStoreName, {});


            }
        }
    };

    function saveAddressData(callback) {
        console.log('saveAddressData');

        var transaction = $scope.db.transaction([objStoreName], "readwrite");

        var objectStore = transaction.objectStore(objStoreName);

        for (var i = 0; i < dataForPreparation.length; i++) {

            var id = dataForPreparation[i][0];
            objectStore.add(dataForPreparation[i][0], id + '_id');
            objectStore.add(dataForPreparation[i][1], id + '_firstName');
            objectStore.add(dataForPreparation[i][2], id + '_lastName');
            objectStore.add(dataForPreparation[i][3], id + '_street');
            objectStore.add(dataForPreparation[i][4], id + '_zipcode');
            objectStore.add(dataForPreparation[i][5], id + '_city');
            objectStore.add(dataForPreparation[i][6], id + '_email');
            objectStore.add(dataForPreparation[i][7], id + '_randomNumber1');
            objectStore.add(dataForPreparation[i][8], id + '_randomNumber2');

        }

        transaction.oncomplete = function (event) {
            callback();

        };

        transaction.onerror = function (event) {
            console.error('transaction.onerror');
            $scope.testInProgress = false;
        };

    };

    function clearObjectStore() {

        var request = $scope.db.transaction([objStoreName], "readwrite").objectStore(objStoreName).clear();

        request.onsuccess = function (evt) {

            console.log('objectStore "' + objStoreName + '" has been cleared');
        };
        request.onerror = function (event) {
            console.error("clearObjectStore:", event.target.errorCode);
        };

    };

    $scope.prepare = function () {
        $scope.prepareInProgress = true;
        $scope.$apply();
        IndexedDBClearObjectStore.clearObjectStore($scope.db, objStoreName, function () {
            loadDataForPreparation();

            saveAddressData(function () {
                $scope.prepareInProgress = false;
                $scope.isPrepared = true;
                console.log('prepare function finished');
                $scope.$apply();
            });

        });
    };

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;

        var timeStart = new Date().getTime();
        var transaction = $scope.db.transaction([objStoreName], "readonly");
        var objectStore = transaction.objectStore(objStoreName);

        for (var i = 0; i < amountOfData; i++) {

            objectStore.get(i + "_id");
            objectStore.get(i + "_firstName");
            objectStore.get(i + "_lastName");
            objectStore.get(i + "_street");
            objectStore.get(i + "_zipcode");
            objectStore.get(i + "_city");
            objectStore.get(i + "_email");
            objectStore.get(i + "_randomNumber1");
            objectStore.get(i + "_randomNumber2");


             var idbRequest = objectStore.get(i + "_firstName");
             idbRequest.onsuccess = function (event) {
             /*
             console.dir(event.target.result);
             */
             };
        }
        ;

        transaction.oncomplete = function (event) {

            var timeEnd = new Date().getTime();
            var timeDiff = timeEnd - timeStart;

            $scope.results.push({iteration: iteration, time: timeDiff});
            iteration++;
            $scope.testInProgress = false;
            $scope.$apply();

        };

        transaction.onerror = function (event) {
            console.error('transaction.onerror (in startPerformanceTest_onlyOne)');
            $scope.testInProgress = false;
        };
    };

});