sdApp.controller('PL_IndexedDBCtrl', function ($scope, $rootScope, testDataFactory, IndexedDBClearObjectStore, TestHelperFactory) {

    $rootScope.section = 'PL';

    var data;

    var dbName = "PL_Test1";
    var objStoreName = "PL_Test1";

    $scope.databaseOpened = false;

    $scope.currentIteration = 0;

    $scope.result = '';
    $scope.isPrepared = false;
    $scope.testInProgress = false;

    var keyPrefix;
    var value;

    $scope.prepare = function () {
        clearObjectStore();
        $scope.isPrepared = true;
        $scope.currentIteration = '';
        $scope.$apply();
    };


    $scope.prepare = function () {
        $scope.prepareInProgress = true;
        $scope.$apply();
        IndexedDBClearObjectStore.clearObjectStore($scope.db, objStoreName, function () {
            $scope.prepareInProgress = false;
            $scope.isPrepared = true;
            $scope.$apply();
            console.log('prepare function finished');
        });
    };

    //function clearObjectStore() {
    //
    //    var transaction = $scope.db.transaction([objStoreName], "readwrite");
    //    var objectStore = transaction.objectStore(objStoreName);
    //
    //    objectStore.clear();
    //    objectStore.onsuccess = function (evt) {
    //        console.log('onSuccess');
    //
    //    };
    //    objectStore.onerror = function (event) {
    //        console.error("clearObjectStore:", event.target.errorCode);
    //
    //    };
    //
    //    transaction.oncomplete = function (event) {
    //        console.log('onComplete');
    //        $scope.isPrepared = true;
    //        $scope.testInProgress = false;
    //        $scope.$apply();
    //
    //    };
    //
    //};

    //$scope.startPlatformTest = function () {
    //
    //    $scope.testInProgress = true;
    //    var datasetStringToSave = testDataFactory.getDatasetWithOffset(0);
    //
    //    var transaction = $scope.db.transaction([objStoreName], "readwrite");
    //
    //    console.dir(data);
    //    var objectStore = transaction.objectStore(objStoreName);
    //
    //    for (var i = 0; i < 100; i++) {
    //
    //        //localStorage.setItem(keyPrefix + '' + fillWithZeroes(10, i), value);
    //        //var objectToStore = {keyName: keyPrefix + '' + fillWithZeroes(10,i), value: value};
    //
    //        objectStore.add(i, datasetStringToSave);
    //
    //    }
    //
    //    transaction.oncomplete = function (event) {
    //
    //        $scope.testInProgress = false;
    //        $scope.isPrepared = false;
    //        $scope.$apply();
    //
    //    };
    //
    //    transaction.onerror = function (event) {
    //        console.error('transaction.onerror (in startPerformanceTest_onlyOne)');
    //        $scope.testInProgress = false;
    //    };
    //
    //};

    $scope.openDatabase = function () {
        console.log('openDatabase start');

        //Quelle: https://developer.mozilla.org/de/docs/IndexedDB/IndexedDB_verwenden
        if (!window.indexedDB) {
            window.alert("Ihr Browser unterstützt keine stabile Version von IndexedDB. Dieses und jenes Feature wird Ihnen nicht zur Verfügung stehen.");
        } else {

            var request = window.indexedDB.open(dbName, 1);

            request.onerror = function (event) {
                console.error('request.onerror');
                alert("Database error: " + event.target.errorCode);

            };
            request.onsuccess = function (event) {
                console.log('request.onsuccess (in openDatabase)');
                $scope.db = request.result;

                //TODO status light sounds not very professional....maybe change this....
                //for updating the "status-light" on the openDatabase button
                $scope.databaseOpened = true;
                $scope.$apply();
            };

            request.onupgradeneeded = function (event) {
                console.log('request.onupgradeneeded (in openDatabase)');
                $scope.db = event.target.result;


                //TODO Dieser Code funktioniert nicht! Change or delete!
                //remove old objectStores if there were any
                //if (event.oldVersion < 1) {
                //$scope.db.deleteObjectStore(objStoreName);
                //}

                //create a new objectStore
                var objectStore = $scope.db.createObjectStore(objStoreName, {});

            }
        }
    };

    ////TODO extract this to a factory or service
    //function fillWithZeroes(fillToLength, number) {
    //
    //    var len = number.toString().length;
    //
    //    var number_new = '';
    //    if (len < fillToLength) {
    //        var zeroesToAdd = fillToLength - len;
    //
    //        for (var k = 0; k < zeroesToAdd; k++) {
    //            number_new = '0' + number_new;
    //        }
    //    }
    //    return number_new + "" + number;
    //
    //};

    $scope.startPlatformTest = function () {

        $scope.currentIteration = 0;

        var errorAlreadyShown = false;

        //var datasetStringToSave = testDataFactory.getDatasetWithOffset(0);
        //var datasetStringToSave = JSON.stringify(testDataFactory.getDatasetForPlatformTest());
        var datasetStringToSave = JSON.stringify(testDataFactory.getDatasetForPlatformTest());

        var transaction;

        function writeNext() {

            //console.log('nextLoop' + $scope.currentIteration);
            transaction = $scope.db.transaction([objStoreName], "readwrite");
            //console.log('nextLoop-1');
            var objectStore = transaction.objectStore(objStoreName);
            //console.log('nextLoop-2');
            objectStore.add(datasetStringToSave, 'dataset_' + $scope.currentIteration);
            //console.log('nextLoop-3');
            //$scope.currentIteration = $scope.currentIteration + 1;
            $scope.currentIteration += 1;
            //console.log('nextLoop-4');

            transaction.oncomplete = function (event) {
                console.log('nextLoop-5');
                transaction = null;
                console.log('onComplete ' + $scope.currentIteration);

                if (errorAlreadyShown == false) {
                    console.log('nextLoop-6');
                    console.log('calling nextLoop');
                    if ((parseInt($scope.currentIteration) % 100) == 0) {
                        $scope.$apply();
                        setTimeout(function () {
                            writeNext();
                        }, 1000);
                    } else {
                        writeNext();
                    }
                }
            };

            transaction.onerror = function (event) {
                console.log('onerror');
                console.error('onerror');
                console.dir(event);
                errorAlreadyShown = true;

                console.error('transaction.onerror');
            };
        };

        writeNext();

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

                var objectStore = $scope.db.createObjectStore(objStoreName, {});

            }
        }
    };


});