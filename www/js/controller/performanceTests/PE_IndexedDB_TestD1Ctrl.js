sdApp.controller('PE_IndexedDB_TestD1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, IndexedDBClearObjectStore) {

    var iteration = 1;
    var dbName = "PE_TestD1";
    var objStoreName = "PE_TestD1";

    var dataForPreparation;

    $scope.databaseOpened = false;
    $scope.testInProgress = false;
    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testD1a = PE_ParameterFactory.amountOfData_testD1a;
    var amountOfData_testD1b = PE_ParameterFactory.amountOfData_testD1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Prepare will clear all data stored in objectStore ' + objStoreName + ". Then it will save the data needed for the test.";
    $scope.mainTestDecription = 'The test deletes addresses by their key.';
    $scope.testName1 = 'Test D1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testD1a + ' items';
    $scope.testName2 = 'Test D1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testD1b + ' items';

    $scope.results = [];


    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestD1a') {
            amountOfData = amountOfData_testD1a;
        } else {
            amountOfData = amountOfData_testD1b;
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

            var request = window.indexedDB.open(dbName, 5);

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
                console.log('request.onupgradeneeded (in openDatabase)');
                $scope.db = event.target.result;

                //removes the existing objectStore - this is ok for tests
                //$scope.db.deleteObjectStore(objStoreName);

                //create a new objectStore
                var objectStore = $scope.db.createObjectStore(objStoreName, {});

                //Column key is defined as index for the objectStore "einzelwerte"
                objectStore.createIndex("id", "id", {unique: true});

            }
        }
    };

    function saveAddressData(callback) {

        $scope.prepareInProgress = true;
        $scope.$apply();

        var transaction = $scope.db.transaction([objStoreName], "readwrite");

        var objectStore = transaction.objectStore(objStoreName);

        for (var i = 0; i < dataForPreparation.length; i++) {

            var addressToSave = dataForPreparation[i];
            objectStore.put(addressToSave, addressToSave[0]);

        }

        transaction.oncomplete = function (event) {

            callback();

        };

        transaction.onerror = function (event) {
            console.error('transaction.onerror (in startPerformanceTest_onlyOne)');
        };
    };

    $scope.prepare = function () {

            $scope.prepareInProgress = true;
            $scope.$apply();
            IndexedDBClearObjectStore.clearObjectStore($scope.db, objStoreName, function () {
                loadDataForPreparation();
                saveAddressData(function() {
                    $scope.prepareInProgress = false;
                    $scope.isPrepared = true;
                    $scope.$apply();
                });

            });
    };

    function loadDataForPreparation() {
        dataForPreparation = testDataFactory.testData();
    }

    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;

        var timeStart = new Date().getTime();
        var transaction = $scope.db.transaction([objStoreName], "readwrite");

        var objectStore = transaction.objectStore(objStoreName);

        for (var i = 0; i < amountOfData; i++) {

            objectStore.delete(i);

        }

        transaction.oncomplete = function (event) {
            var timeEnd = new Date().getTime();

            var timeDiff = timeEnd - timeStart;

            $scope.results.push({iteration:  iteration,  time: timeDiff});
            iteration++;
            $scope.testInProgress = false;
            $scope.isPrepared = false;
            $scope.$apply();

        };

        transaction.onerror = function (event) {
            console.dir(event);
            console.error('transaction.onerror (in startPerformanceTest)');
            $scope.testInProgress = false;
        };

    };

});