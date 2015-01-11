sdApp.controller('PE_FileAPI_TestR2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, FileApiDeleteAllFilesFactory) {
        var iteration = 1;

        var dataForPreparation;

        $scope.testInProgress = false;

        $scope.isPrepared = false;

        var amountOfData;
        var amountOfData_testR2a = PE_ParameterFactory.amountOfData_testR2a;
        var amountOfData_testR2b = PE_ParameterFactory.amountOfData_testR2b;

        $scope.selectedTestVariant = '';
        $scope.preparationText = 'Explain what the prepare function does...';
        $scope.preparationText = 'The prepare function will delete all files. After that it saves the files needed for the test';
        $scope.testName1 = 'Test R2-500';
        $scope.testDecription1 = 'Stores ' + amountOfData_testR2a + ' items';
        $scope.testName2 = 'Test R2-2000';
        $scope.testDecription2 = 'Stores ' + amountOfData_testR2b + ' items';

        $scope.results = [];

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

        $scope.prepare = function () {
            $scope.prepareInProgress = true;
            $scope.$apply();

            //otherwise the -prepare in progress- is not shown correctly
            setTimeout(function () {

                deleteAllFiles = FileApiDeleteAllFilesFactory.deleteAllFiles(function () {
                    //continue when all files are deleted
                    loadForPreparationData();

                    saveAddressData(function () {
                        //continue when all files are written
                        $scope.isPrepared = true;
                        $scope.prepareInProgress = false;
                        console.log('prepare function finished');
                        $scope.$apply();
                    });
                })
            }, 1000);


        };

        //sequential requests for fetching the addresses
        //$scope.startPerformanceTest_sequential = function () {
        $scope.startPerformanceTest = function () {


            $scope.testInProgress = true;
            $scope.$apply();

            var timeStart = new Date().getTime();
            window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
                function (fs) {

                    var i = 0;

                    function readNextFile() {

                        var currentAddressId = parseInt(i / 9);
                        console.log(id);
                        switch (i % 9) {
                            case 0:
                                filename = currentAddressId + '_id.txt';
                                break;
                            case 1:
                                filename = currentAddressId + '_firstName.txt';
                                break;
                            case 2:
                                filename = currentAddressId + '_lastName.txt';
                                break;
                            case 3:
                                filename = currentAddressId + '_street.txt';
                                break;
                            case 4:
                                filename = currentAddressId + '_zipcode.txt';
                                break;
                            case 5:
                                filename = currentAddressId + '_city.txt';
                                break;
                            case 6:
                                filename = currentAddressId + '_email.txt';
                                break;
                            case 7:
                                filename = currentAddressId + '_randomNumber1.txt';
                                break;
                            default:
                                filename = currentAddressId + '_randomNumber2.txt';
                        }

                        fs.root.getFile(filename, {}, function (fileEntry) {

                            fileEntry.file(function (file) {
                                var reader = new FileReader();

                                reader.onloadend = function (e) {
                                    i += 1;
                                    //---Test-Output to check the returned values---
                                    /*
                                     console.log('check Test R1:' + JSON.stringify(this.result));
                                     */

                                    if (i == amountOfData * 9) {

                                        var timeEnd = new Date().getTime();

                                        var timeDiff = timeEnd - timeStart;
                                        $scope.results.push({iteration: iteration, time: timeDiff});
                                        $scope.testInProgress = false;
                                        $scope.$apply();

                                        iteration++;
                                    } else {
                                        readNextFile(i + 1);
                                    }
                                };

                                reader.readAsText(file);
                            }, errorHandler);
                        }, errorHandler);

                    }

                    readNextFile(0);

                },
                errorHandler
            );


        };

        function loadForPreparationData() {

            dataForPreparation = testDataFactory.testData();

        };

        function saveAddressData(callback) {

            if (dataForPreparation == null) {
                alert('error: no data loaded');
                console.error('no data loaded (in saveAddressData)');
            } else {

                window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
                    function (fs) {

                        var filename;
                        var dataToWrite;
                        var i = 0;

                        function writeNextFile() {

                            var currentAddress = parseInt(i / 9);

                            var id = dataForPreparation[currentAddress][0];
                            switch (i % 9) {
                                case 0:
                                    filename = +id + '_id.txt';
                                    dataToWrite = dataForPreparation[currentAddress][0] + '';
                                    break;
                                case 1:
                                    filename = id + '_firstName.txt';
                                    dataToWrite = dataForPreparation[currentAddress][1];
                                    break;
                                case 2:
                                    filename = id + '_lastName.txt';
                                    dataToWrite = dataForPreparation[currentAddress][2];
                                    break;
                                case 3:
                                    filename = id + '_street.txt';
                                    dataToWrite = dataForPreparation[currentAddress][3];
                                    break;
                                case 4:
                                    filename = id + '_zipcode.txt';
                                    dataToWrite = dataForPreparation[currentAddress][4];
                                    break;
                                case 5:
                                    filename = id + '_city.txt';
                                    dataToWrite = dataForPreparation[currentAddress][5];
                                    break;
                                case 6:
                                    filename = id + '_email.txt';
                                    dataToWrite = dataForPreparation[currentAddress][6];
                                    break;
                                case 7:
                                    filename = id + '_randomNumber1.txt';
                                    dataToWrite = dataForPreparation[currentAddress][7] + '';
                                    break;
                                default:
                                    filename = id + '_randomNumber2.txt';
                                    dataToWrite = dataForPreparation[currentAddress][8] + '';
                            }

                            fs.root.getFile(filename, {create: true}, function (fileEntry) {

                                fileEntry.createWriter(function (fileWriter) {

                                    fileWriter.onwriteend = function (e) {
                                        i++;

                                        if (i < amountOfData * 9) {
                                            writeNextFile();
                                        } else {

                                            //notify the calling function...
                                            callback();
                                        }
                                    };

                                    fileWriter.onerror = function (e) {
                                        console.dir(e);
                                    };

                                    fileWriter.seek(0);
                                    fileWriter.write(dataToWrite);

                                }, errorHandler);

                            }, errorHandler);
                        }

                        writeNextFile();

                    }
                );
            }

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

    }
)
;