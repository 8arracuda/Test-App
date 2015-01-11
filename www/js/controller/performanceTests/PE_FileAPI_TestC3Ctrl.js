sdApp.controller('PE_FileAPI_TestC3Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, FileApiDeleteAllFilesFactory) {
    var iteration = 1;

    var fs;
    var data;
    $scope.filelist = [];

    $scope.testInProgress = false;

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testC3a = PE_ParameterFactory.amountOfData_testC3a;
    var amountOfData_testC3b = PE_ParameterFactory.amountOfData_testC3b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'The test stores datasets, with 4000 addresses each, into one file';
    $scope.testName1 = 'Test C3-6';
    $scope.testDecription1 = 'Stores ' + amountOfData_testC3a + ' items';
    $scope.testName2 = 'Test C3-24';
    $scope.testDecription2 = 'Stores ' + amountOfData_testC3b + ' items';

    $scope.results = [];

    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestC3a') {
            amountOfData = amountOfData_testC3a;
        } else {
            amountOfData = amountOfData_testC3b;
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

    function loadData() {

        data = testDataFactory.testData();

    }

    $scope.prepare = function () {

        $scope.prepareInProgress=true;
        $scope.$apply();
        deleteAllFiles = FileApiDeleteAllFilesFactory.deleteAllFiles(function () {
            loadData();
            $scope.isPrepared = true;
            $scope.prepareInProgress=false;
            console.log('prepare function finished');
            $scope.$apply();
        });


    };

    //$scope.startPerformanceTest = function () {
    //
    //    $scope.inProgress = true;
    //
    //    var timeStart = new Date().getTime();
    //    //TODO Try changing the size of it check if there is an effect on performance
    //    window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
    //        function (fs) {
    //
    //            var i = 0;
    //
    //            $scope.testInProgress = true;
    //            $scope.$apply();
    //            writeNextFile();
    //
    //            function writeNextFile() {
    //
    //                if (i < amountOfData) {
    //                    //address-id is filename
    //                    //var filename = 'dataset_' + data[i][0] + '.txt';
    //                    var filename = 'dataset_' + i + '.txt';
    //                    console.log('fs.root in writeFile');
    //                    fs.root.getFile(filename, {create: true}, function (fileEntry) {
    //
    //                        fileEntry.createWriter(function (fileWriter) {
    //
    //                            fileWriter.onwriteend = function (e) {
    //
    //                                i++;
    //
    //                                if (i < amountOfData) {
    //                                    writeNextFile();
    //                                } else {
    //                                    console.error('end of loop');
    //
    //                                    var timeEnd = new Date().getTime();
    //
    //                                    var timeDiff = timeEnd - timeStart;
    //
    //                                    $scope.results.push({iteration:  iteration,  time: timeDiff});
    //                                    $scope.testInProgress = false;
    //                                    $scope.isPrepared = false;
    //                                    $scope.$apply();
    //                                    iteration++;
    //                                }
    //                                //after one file has been successfully written the next file can be written
    //                                i++;
    //                                //timeDiffSum += new Date().getTime() - timeStart;
    //                                writeNextFile();
    //                            };
    //
    //                            fileWriter.onerror = function (e) {
    //                                console.log('Write failed: ' + e.toString());
    //                                console.dir(e);
    //                            };
    //
    //                            //overwrites the file from the beginning
    //                            fileWriter.seek(0);
    //
    //                            var datasetString = testDataFactory.getStringFromFile(datasetFiles[i]);
    //                            fileWriter.write(datasetString);
    //                            //fileWriter.write('' + k);
    //
    //                        }, errorHandler);
    //
    //                    }, errorHandler);
    //                } else {
    //                    //console.error('end of loop');
    //                    //
    //                    ////var timeEnd = new Date().getTime();
    //                    //
    //                    ////var timeDiff = timeEnd - timeStart;
    //                    //
    //                    //$scope.results.push({iteration:  iteration,  time: timeDiff});
    //                    //$scope.testInProgress = false;
    //                    //$scope.isPrepared = false;
    //                    //$scope.$apply();
    //                    //iteration++;
    //                }
    //
    //            }
    //
    //        },
    //        errorHandler
    //    );
    //
    //};

    $scope.startPerformanceTest = function () {

        $scope.inProgress = true;

        var datasetArray = [];
        for (var i=0; i<amountOfData; i++) {
            datasetArray.push(testDataFactory.getDatasetWithOffset(i));
        }

        var timeStart = new Date().getTime();
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                var i = 0;

                $scope.testInProgress = true;
                $scope.$apply();
                writeFile();

                function writeFile() {

                    if (i < amountOfData) {
                        //address-id is filename
                        var filename = 'dataset_' + i +  '.txt';
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
                                fileWriter.write(JSON.stringify(datasetArray[i]));

                            }, errorHandler);

                        }, errorHandler);
                    } else {
                        console.error('end of loop');

                        var timeEnd = new Date().getTime();

                        var timeDiff = timeEnd - timeStart;

                        $scope.results.push({iteration: iteration, time: timeDiff});
                        $scope.testInProgress = false;
                        $scope.isPrepared = false;
                        $scope.$apply();
                        iteration++;
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


    //function showFiles() {
    //
    //    console.log('showfiles started');
    //    $scope.filelist = [];
    //    $scope.loadingInProgress = true;
    //    $scope.$apply();
    //
    //    function toArray(list) {
    //        return Array.prototype.slice.call(list || [], 0);
    //    }
    //
    //    function listResults(entries) {
    //
    //        $scope.loadingInProgress = true;
    //        $scope.$apply();
    //
    //        entries.forEach(function (entry, i) {
    //
    //            if (entry.isDirectory) {
    //                var fileListEntry = {name: entry.name + ' [DIR]', value: ""};
    //            } else {
    //                var fileListEntry = {name: entry.name, value: ""};
    //            }
    //
    //            $scope.filelist.push(fileListEntry);
    //
    //        });
    //        $scope.loadingInProgress = false;
    //        $scope.$apply();
    //
    //    }
    //
    //
    //    console.log('before');
    //    window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
    //        function (fs) {
    //
    //            var dirReader = fs.root.createReader();
    //            var entries = [];
    //
    //            // Call the reader.readEntries() until no more results are returned.
    //            var readEntries = function () {
    //                dirReader.readEntries(function (results) {
    //                    if (!results.length) {
    //                        listResults(entries.sort());
    //                    } else {
    //                        entries = entries.concat(toArray(results));
    //                        readEntries();
    //                    }
    //                }, errorHandler);
    //            };
    //
    //            readEntries(); // Start reading dirs.
    //
    //        }, errorHandler);
    //    console.log('after');
    //
    //};

});