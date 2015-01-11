//sdApp.controller('PE_FileAPI_TestR3Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, FileApiDeleteAllFilesFactory) {
//    var iteration = 1;
//
//    $scope.testInProgress = false;
//
//    $scope.isPrepared = false;
//
//    var amountOfData;
//    var amountOfData_testR3a = PE_ParameterFactory.amountOfData_testR3a;
//    var amountOfData_testR3b = PE_ParameterFactory.amountOfData_testR3b;
//
//    $scope.selectedTestVariant = '';
//    $scope.preparationText = 'Explain what the prepare function does...';
//    $scope.mainTestDecription = 'In this test x simple key-value pairs are saved.';
//    $scope.testName1 = 'TestR3-6';
//    $scope.testDecription1 = 'Stores ' + amountOfData_testR3a + ' items';
//    $scope.testName2 = 'TestR3-24';
//    $scope.testDecription2 = 'Stores ' + amountOfData_testR3b + ' items';
//
//    $scope.results = [];
//
//    $scope.selectTestVariant = function (testVariant) {
//        $scope.selectedTestVariant = testVariant;
//
//        if (testVariant == 'TestR3a') {
//            amountOfData = amountOfData_testR3a;
//        } else {
//            amountOfData = amountOfData_testR3b;
//        }
//        console.log('selectedTestVariant= ' + $scope.selectedTestVariant + ' (amountOfData= ' + amountOfData + ')');
//
//    };
//
//    $scope.reset = function () {
//
//        var answer = confirm('Do you really want to reset this page. All test results will be removed!');
//
//        if (answer) {
//            iteration = 1;
//            $scope.isPrepared = false;
//            $scope.results = [];
//            $scope.selectedTestVariant = '';
//        }
//
//    };
//
//    $scope.prepare = function () {
//
//        $scope.prepareInProgress = true;
//        $scope.$apply();
//        deleteAllFiles = FileApiDeleteAllFilesFactory.deleteAllFiles(function () {
//            saveAddressData(function () {
//                $scope.isPrepared = true;
//                $scope.prepareInProgress = false;
//                console.log('prepare function finished');
//                $scope.$apply();
//            });
//
//        });
//
//    };
//
//
//    //Sequential requests for fetching the addresses
//    $scope.startPerformanceTest_variant2 = function () {
//        console.log('startPerformanceTest_variant2');
//        //var callbackNumber = 0;
//        $scope.testInProgress = true;
//        $scope.$apply();
//
//        var timeStart = new Date().getTime();
//        console.log('before');
//        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
//            function (fs) {
//
//                //var callbackNumber = 0;
//                function loadAddress(i) {
//                    console.log('loadAddress start (' + i + ')');
//                    //  if (i < addressIdsToLoad.length) {
//
//                    var filename = 'dataset_' + i + '.txt';
//                    console.log('trying to load ' + filename);
//                    fs.root.getFile(filename, {}, function (fileEntry) {
//
//                        // Get a File object representing the file,
//                        // then use FileReader to read its contents.
//                        fileEntry.file(function (file) {
//                            var reader = new FileReader();
//
//                            reader.onloadend = function (e) {
//
//                                //---Test-Output to check the returned values---
//                                  console.log('check Test R1:' + JSON.stringify(this.result.substr(1,50)));
//                                //loadAddress(i++);
//                                if (i == amountOfData - 1) {
//                                    var timeEnd = new Date().getTime();
//
//                                    var timeDiff = timeEnd - timeStart;
//                                    $scope.results.push({iteration: iteration, time: timeDiff});
//                                    $scope.testInProgress = false;
//                                    $scope.$apply();
//
//                                    iteration++;
//                                } else {
//                                    loadAddress(i + 1);
//                                }
//                            };
//
//                            reader.readAsText(file);
//                        }, errorHandler);
//                    }, errorHandler);
//                    //}
//                    //      console.log('loadAddress end (' + i + ')');
//                }
//
//                //              console.log('before(2)');
//                loadAddress(0);
////                console.log('after(2)');
//
//            },
//            errorHandler
//        )
//        ;
//        //console.log('after');
//
//        //function addOne() {
//        //    callbackNumber++;
//        //    if (callbackNumber == addressIdsToLoad.length) {
//        //        var timeEnd = new Date().getTime();
//        //
//        //        var timeDiff = timeEnd - timeStart;
//        //        $scope.results.push('Iteration ' + iteration + ': ' + timeDiff + ' ms');
//        //        $scope.testInProgress = false;
//        //        $scope.$apply();
//        //
//        //        iteration++;
//        //    }
//        //
//        //
//        //}
//
//    };
//
//
//    //asynchronous requests for fetching the addresses
//    $scope.startPerformanceTest_variant1 = function () {
//        var callbackNumber = 0;
//        $scope.testInProgress = true;
//        $scope.$apply();
//
//        var timeStart = new Date().getTime();
//
//        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
//            function (fs) {
//
//                for (var i = 0; i < amountOfData; i++) {
//
//                    var filename = 'dataset_' + i + '.txt';
//                    console.log('trying to load ' + filename);
//                    fs.root.getFile(filename, {}, function (fileEntry) {
//
//                        // Get a File object representing the file,
//                        // then use FileReader to read its contents.
//                        fileEntry.file(function (file) {
//                            var reader = new FileReader();
//
//                            reader.onloadend = function (e) {
//
//                                //---Test-Output to check the returned values---
//                                console.log('check Test R1:' + JSON.stringify(this.result.substr(1,50)));
//                                addResult();
//                            };
//
//                            reader.readAsText(file);
//                        }, errorHandler);
//                    }, errorHandler);
//                }
//            },
//            errorHandler
//        );
//
//        function addResult() {
//            callbackNumber++;
//            if (callbackNumber == amountOfData) {
//                var timeEnd = new Date().getTime();
//
//                var timeDiff = timeEnd - timeStart;
//                $scope.results.push({iteration: iteration, time: timeDiff});
//                $scope.testInProgress = false;
//                $scope.$apply();
//
//                iteration++;
//            }
//        }
//    };
//
//    function saveAddressData(callback) {
//
//        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
//            function (fs) {
//
//                function writeAddress(i) {
//
//                    if (i < amountOfData) {
//                        var filename = 'dataset_' + i + '.txt';
//                        fs.root.getFile(filename, {create: true}, function (fileEntry) {
//
//                            fileEntry.createWriter(function (fileWriter) {
//
//                                fileWriter.onwriteend = function (e) {
//
//                                    writeAddress(i + 1);
//
//                                };
//
//                                fileWriter.onerror = function (e) {
//                                    console.log('Write failed: ' + e.toString());
//                                    console.dir(e);
//                                };
//
//                                //overwrites the file from the beginning
//
//                                var datasetString = testDataFactory.getDatasetWithOffset(i);
//                                fileWriter.seek(0);
//                                fileWriter.write(JSON.stringify(datasetString));
//
//                            }, errorHandler);
//                        }, errorHandler);
//
//                    } else {
//                        callback();
//                    }
//                }
//
//                writeAddress(0);
//
//            },
//            errorHandler
//        );
//
//    };
//
//
//    function errorHandler(e) {
//        var msg = '';
//
//        switch (e.code) {
//            case FileError.QUOTA_EXCEEDED_ERR:
//                msg = 'QUOTA_EXCEEDED_ERR';
//                alert('QUOTA_EXCEEDED_ERR');
//                break;
//            case FileError.NOT_FOUND_ERR:
//                msg = 'NOT_FOUND_ERR(1)';
//                break;
//            case FileError.SECURITY_ERR:
//                msg = 'SECURITY_ERR';
//                break;
//            case FileError.INVALID_MODIFICATION_ERR:
//                msg = 'INVALID_MODIFICATION_ERR';
//                break;
//            case FileError.INVALID_STATE_ERR:
//                msg = 'INVALID_STATE_ERR';
//                break;
//            default:
//                msg = 'Unknown Error';
//                break;
//        }
//        ;
//
//        console.log('Error: ' + msg);
//    }
//
//});