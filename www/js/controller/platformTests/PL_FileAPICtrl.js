sdApp.controller('PL_FileAPICtrl', function ($scope, $rootScope, FileApiDeleteAllFilesFactory, testDataFactory, TestHelperFactory) {

    $rootScope.section = 'PL';

    $scope.result = '';
    $scope.isPrepared = false;
    $scope.testInProgress = false;

    $scope.prepare = function () {
        $scope.prepareInProgress = true;
        $scope.$apply();
        deleteAllFiles = FileApiDeleteAllFilesFactory.deleteAllFiles(function () {

            $scope.isPrepared = true;
            $scope.prepareInProgress = false;
            $scope.$apply();
        });

    };

    $scope.startPlatformTest = function() {

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                var i = 0;

                $scope.testInProgress = true;
                $scope.$apply();
                writeFile();
                var datasetStringToSave = testDataFactory.getDatasetForPlatformTest();
                function writeFile() {

                    //if (i < amountOfData) {
                        var filename = i + '.txt';
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

                                fileWriter.write(JSON.stringify(datasetStringToSave));

                            }, errorHandler);

                        }, errorHandler);

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
        alert('error!');

        console.log('Error: ' + msg);
    }
});