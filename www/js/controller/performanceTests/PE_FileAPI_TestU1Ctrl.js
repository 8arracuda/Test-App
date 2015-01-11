sdApp.controller('PE_FileAPI_TestU1Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, FileApiDeleteAllFilesFactory) {

    var dataForUpdate;
    var dataForPreparation;

    var iteration = 1;

    $scope.testInProgress = false;

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testU1a = PE_ParameterFactory.amountOfData_testU1a;
    var amountOfData_testU1b = PE_ParameterFactory.amountOfData_testU1b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'The prepare function will delete all files. After that it saves the files needed for the test';
    $scope.mainTestDecription = 'The test replaces addresses by their key.';
    $scope.testName1 = 'Test U1-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testU1a + ' items';
    $scope.testName2 = 'Test U1-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testU1b + ' items';

    $scope.results = [];

    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestU1a') {
            amountOfData = amountOfData_testU1a;
        } else {
            amountOfData = amountOfData_testU1b;
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

    function loadDataForPreparation() {

        dataForPreparation = testDataFactory.testData();

    }

    function loadDataForUpdate() {

        dataForUpdate = testDataFactory.testDataForUpdateTests();

    }

    $scope.prepare = function () {
        $scope.prepareInProgress=true;
        $scope.$apply();
        deleteAllFiles = FileApiDeleteAllFilesFactory.deleteAllFiles(function() {
            loadDataForPreparation();
            saveAddressData(function() {
                loadDataForUpdate();
                $scope.isPrepared = true;
                $scope.prepareInProgress=false;
                console.log('prepare function finished');
                $scope.$apply();
            });

        });

    };

    function saveAddressData(callback) {

        if (dataForPreparation == null) {
            alert('error: no data loaded');
            console.error('no data loaded (in saveAddressData)');
        } else {

            window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
                function (fs) {

                    function writeAddress(i) {

                        if (i < dataForPreparation.length) {
                            var id = dataForPreparation[i][0];
                            var filename = id + '.txt';
                            fs.root.getFile(filename, {create: true}, function (fileEntry) {

                                fileEntry.createWriter(function (fileWriter) {

                                    fileWriter.onwriteend = function (e) {

                                        writeAddress(i + 1);

                                    };

                                    fileWriter.onerror = function (e) {
                                        console.log('Write failed: ' + e.toString());
                                        console.dir(e);
                                    };

                                    //overwrites the file from the beginning
                                    fileWriter.seek(0);
                                    fileWriter.write(JSON.stringify(dataForPreparation[i]));

                                }, errorHandler);
                            }, errorHandler);

                        } else {
                            callback();
                        }
                    }

                    writeAddress(0);

                },
                errorHandler
            );

        }

    };

    $scope.startPerformanceTest = function () {

        var timeStart= new Date().getTime();
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                function writeAddress(i) {
                    var filename = i + '.txt';
                        fs.root.getFile(filename, {create: true}, function (fileEntry) {

                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function (e) {
                                    //console.log(fileEntry.name + ' written successfully.');

                                    //calls the function again to write the next file
                                    if (i < amountOfData) {
                                    writeAddress(i + 1);
                                        } else {

                                            var timeEnd = new Date().getTime();
                                            var timeDiff = timeEnd - timeStart;
                                            $scope.results.push({iteration:  iteration,  time: timeDiff});
                                            $scope.testInProgress = false;
                                            $scope.isPrepared = false;
                                            $scope.$apply();
                                            iteration++;
                                    }
                                };

                                fileWriter.onerror = function (e) {
                                    console.log('Write failed: ' + e.toString());
                                    console.dir(e);
                                };

                                //overwrites the file from the beginning
                                fileWriter.seek(0);
                                fileWriter.write(JSON.stringify(dataForUpdate[i]));

                            }, errorHandler);
                        }, errorHandler);

                }

                writeAddress(0);

            },
            errorHandler
        );

    };

    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                alert('QUOTA_EXCEEDED_ERR');
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR(1)';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        }
        ;

        console.log('Error: ' + msg);
    }

});