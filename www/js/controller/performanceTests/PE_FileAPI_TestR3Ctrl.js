sdApp.controller('PE_FileAPI_TestR3Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, FileApiDeleteAllFilesFactory) {
    var iteration = 1;

    $scope.testInProgress = false;

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testR3a = PE_ParameterFactory.amountOfData_testR3a;
    var amountOfData_testR3b = PE_ParameterFactory.amountOfData_testR3b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.preparationText = 'The prepare function will delete all files. After that it saves the files needed for the test';
    $scope.testName1 = 'Test R3-6';
    $scope.testDecription1 = 'Stores ' + amountOfData_testR3a + ' items';
    $scope.testName2 = 'Test R3-24';
    $scope.testDecription2 = 'Stores ' + amountOfData_testR3b + ' items';

    $scope.results = [];

    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestR3a') {
            amountOfData = amountOfData_testR3a;
        } else {
            amountOfData = amountOfData_testR3b;
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

    $scope.prepare = function () {

        $scope.prepareInProgress = true;
        $scope.$apply();
        deleteAllFiles = FileApiDeleteAllFilesFactory.deleteAllFiles(function () {
            saveAddressData(function () {
                $scope.isPrepared = true;
                $scope.prepareInProgress = false;
                console.log('prepare function finished');
                $scope.$apply();
            });

        });

    };


    $scope.startPerformanceTest = function () {
        console.log('startPerformanceTest_variant2');
        //var callbackNumber = 0;
        $scope.testInProgress = true;
        $scope.$apply();


        var timeStart = new Date().getTime();
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                function loadAddress(i) {

                    var filename = 'dataset_' + i + '.txt';
                    fs.root.getFile(filename, {}, function (fileEntry) {

                        // Get a File object representing the file,
                        // then use FileReader to read its contents.
                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function (e) {

                                //---Test-Output to check the returned values---
                                //  console.log('check Test R1:' + JSON.stringify(this.result));

                                if (i == amountOfData - 1) {

                                    var timeEnd = new Date().getTime();

                                    var timeDiff = timeEnd - timeStart;
                                    $scope.results.push({iteration: iteration, time: timeDiff});
                                    $scope.testInProgress = false;
                                    $scope.$apply();

                                    iteration++;
                                } else {
                                    loadAddress(i + 1);
                                }
                            };

                            reader.readAsText(file);
                        }, errorHandler);
                    }, errorHandler);
                }

                loadAddress(0);

            },
            errorHandler
        );

    };

    function saveAddressData(callback) {


        var timeStart = new Date().getTime();
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                var i = 0;

                $scope.prepareInProgress = true;
                $scope.$apply();
                writeFile();

                function writeFile() {

                    if (i < amountOfData) {
                        //address-id is filename
                        var filename = 'dataset_' + i + '.txt';
                        console.log('fs.root in writeFile');
                        fs.root.getFile(filename, {create: true}, function (fileEntry) {

                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function (e) {

                                    //after one file has been successfully written the next file can be written
                                    i++;
                                    writeFile();
                                };

                                fileWriter.onerror = function (e) {
                                    console.log('Write failed: ' + e.toString());
                                    console.dir(e);
                                };

                                //overwrites the file from the beginning
                                fileWriter.seek(0);
                                fileWriter.write(JSON.stringify(testDataFactory.getDatasetWithOffset(i)));

                            }, errorHandler);

                        }, errorHandler);
                    } else {
                        console.error('end of loop');

                        callback();

                    }
                }
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