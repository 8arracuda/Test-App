sdApp.controller('PE_FileAPI_TestC2Ctrl', function ($scope, $rootScope, testDataFactory, PE_ParameterFactory, FileApiDeleteAllFilesFactory) {
    var iteration = 1;

    var fs;
    var data;
    $scope.filelist = [];

    $scope.testInProgress = false;

    $scope.isPrepared = false;

    var amountOfData;
    var amountOfData_testC2a = PE_ParameterFactory.amountOfData_testC2a;
    var amountOfData_testC2b = PE_ParameterFactory.amountOfData_testC2b;

    $scope.selectedTestVariant = '';
    $scope.preparationText = 'Explain what the prepare function does...';
    $scope.mainTestDecription = 'The test stores every address-field in a single file.';
    $scope.testName1 = 'Test C2-500';
    $scope.testDecription1 = 'Stores ' + amountOfData_testC2a + ' items';
    $scope.testName2 = 'Test C2-2000';
    $scope.testDecription2 = 'Stores ' + amountOfData_testC2b + ' items';

    $scope.results = [];

    $scope.selectTestVariant = function (testVariant) {
        $scope.selectedTestVariant = testVariant;

        if (testVariant == 'TestC2a') {
            amountOfData = amountOfData_testC2a;
        } else {
            amountOfData = amountOfData_testC2b;
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


    //This function writes the files sequentially
    $scope.startPerformanceTest = function () {

        $scope.testInProgress = true;
        $scope.$apply();

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                var filename;
                var dataToWrite;
                var i = 0;

                function writeNextFile() {

                    var currentAddress = parseInt(i / 9);
                    var id = data[currentAddress][0];
                    switch (i % 9) {
                        case 0:
                            filename = + id + '_id.txt';
                            dataToWrite = data[currentAddress][0] + '';
                            break;
                        case 1:
                            filename = id + '_firstName.txt';
                            dataToWrite = data[currentAddress][1];
                            break;
                        case 2:
                            filename = id + '_lastName.txt';
                            dataToWrite = data[currentAddress][2];
                            break;
                        case 3:
                            filename = id + '_street.txt';
                            dataToWrite = data[currentAddress][3];
                            break;
                        case 4:
                            filename = id + '_zipcode.txt';
                            dataToWrite = data[currentAddress][4];
                            break;
                        case 5:
                            filename = id + '_city.txt';
                            dataToWrite = data[currentAddress][5];
                            break;
                        case 6:
                            filename = id + '_email.txt';
                            dataToWrite = data[currentAddress][6];
                            break;
                        case 7:
                            filename = id + '_randomNumber1.txt';
                            dataToWrite = data[currentAddress][7] + '';
                            break;
                        default:
                            filename = id + '_randomNumber2.txt';
                            dataToWrite = data[currentAddress][8] + '';

                    }

                    fs.root.getFile(filename, {create: true}, function (fileEntry) {

                        fileEntry.createWriter(function (fileWriter) {

                            fileWriter.onwriteend = function (e) {
                                i++;

                                if (i < amountOfData * 9) {
                                    writeNextFile();
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
                                console.log('onerror');
                                console.dir(e);
                            };

                            fileWriter.seek(0);
                            fileWriter.write(dataToWrite);

                        }, errorHandler);

                    }, errorHandler);

                }


                var timeStart = new Date().getTime();
                writeNextFile();

            });
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


})
;