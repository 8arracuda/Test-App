sdApp.controller('DE_PG_FileAPI_strDataCtrl', function ($scope, $rootScope) {

    $scope.tableFromPGFileAPI = [];

    var filenameForMethod1 = 'table1';
    var filenameForMethod1NumberOfRows = 'table1_numberOfRows.txt';
    var filenameForMethod2 = 'table2.txt';

    $scope.saveTable1= function () {

        //TODO Problem with removing the old data
        //delete files before saving new ones
        //$scope.deleteTable1FromPGFileAPI();

        //writes numberOfRows first, then calls writeAddress
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                function writeAddress(i) {
                    if (i < $rootScope.numberOfRows) {
                        var filename = filenameForMethod1 + '_' + i + '.txt';
                        fs.root.getFile(filename, {create: true}, function (fileEntry) {

                            fileEntry.createWriter(function (fileWriter) {

                                fileWriter.onwriteend = function (e) {
                                    console.log(fileEntry.name + ' written successfully.');

                                    //calls the function again to write the next file
                                    writeAddress(i + 1);
                                };

                                fileWriter.onerror = function (e) {
                                    console.log('Write failed: ' + e.toString());
                                    console.dir(e);
                                };

                                //overwrites the file from the beginning
                                fileWriter.seek(0);
                                fileWriter.write(JSON.stringify($rootScope.data[i]));

                            }, errorHandler);
                        }, errorHandler);

                    } else {
                        alert($rootScope.numberOfRows + ' addressfiles has been written.');
                    }

                }

                //var filename = filenameForMethod1NumberOfRows;
                fs.root.getFile(filenameForMethod1NumberOfRows, {create: true}, function (fileEntry) {

                    fileEntry.createWriter(function (fileWriter) {

                        fileWriter.onwriteend = function (e) {
                            console.log(fileEntry.name + ' written successfully.');

                            //when numberOfRows is written, write the address-files
                            writeAddress(0);
                        };

                        fileWriter.onerror = function (e) {
                            console.log('Write failed: ' + e.toString());
                        };

                        //overwrites the file from the beginning
                        fileWriter.seek(0);
                        fileWriter.write(JSON.stringify($rootScope.numberOfRows));

                    }, errorHandler);

                }, errorHandler);

            },
            errorHandler
        );

    };

    //TODO Highlighting is missing

    $scope.loadTable1= function () {

        $scope.tableFromPGFileAPI = [];
        var numberOfRows;

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {

                //read NumberOfRows
                fs.root.getFile(filenameForMethod1NumberOfRows, {}, function (fileEntry) {

                    // Get a File object representing the file,
                    // then use FileReader to read its contents.
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function (e) {

                            numberOfRows = this.result;

                            alert('numberOfRows:' + numberOfRows + ' - starting loop');

                            //after reading numberOfRows the address-files get loaded
                            for (var i = 0; i < numberOfRows; i++) {

                                var filename = filenameForMethod1 + '_' + i + '.txt';

                                fs.root.getFile(filename, {}, function (fileEntry) {

                                    // Get a File object representing the file,
                                    // then use FileReader to read its contents.
                                    fileEntry.file(function (file) {
                                        var reader = new FileReader();

                                        reader.onloadend = function (e) {
                                            console.log('numberOfRows=' + numberOfRows);

                                            if (i == 0) {
                                                alert(this.result);
                                            }

                                            var address = JSON.parse(this.result);

                                            $scope.tableFromPGFileAPI.push(address);
                                            $scope.$apply();
                                        };

                                        reader.readAsText(file);
                                    }, errorHandler);

                                }, errorHandler);

                            }

                        };

                        reader.readAsText(file);
                    }, errorHandler);

                }, errorHandler2);
            },
            errorHandler
        );

    };

    $scope.deleteTable1= function () {
        var filename = filenameForMethod2;
        //$scope.inProgress = true;

        console.log('deleteTable1FromPGFileAPI');
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {

            var numberOfRows;

            window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {

                    function deleteFile(filename) {

                        fs.root.getFile(filename, {create: false}, function (fileEntry) {
                            fileEntry.remove(function () {
                                console.log(filename + ' has been removed.');
                            }, errorHandler);
                        }, errorHandler);

                    };

                    //read NumberOfRows
                    fs.root.getFile(filenameForMethod1NumberOfRows, {}, function (fileEntry) {

                        // Get a File object representing the file,
                        // then use FileReader to read its contents.
                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function (e) {

                                var numberOfRows = this.result;

                                //alert('numberOfRows:' + numberOfRows);
                                console.log('numberOfRows: ' + numberOfRows + '(from deleteTable1FromPGFileAPI)');

                                for (var i = 0; i < numberOfRows; i++) {
                                    var filename = filenameForMethod1 + '_' + i + '.txt';
                                    deleteFile(filename);
                                }

                                //delete numberOfRows file
                                deleteFile(filenameForMethod1NumberOfRows);

                            };

                            reader.readAsText(file);
                        }, errorHandler);


                    }, errorHandler2);
                },
                errorHandler
            );
        }, errorHandler);
    };


    $scope.saveTable2= function () {

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                var filename = filenameForMethod2;

                fs.root.getFile(filename, {create: true}, function (fileEntry) {

                    fileEntry.createWriter(function (fileWriter) {

                        fileWriter.onwriteend = function (e) {
                            console.log('Write completed.');
                            //alert('filename:' + fileEntry.name + " url:" + fileEntry.toURL());
                            console.log('filename:' + fileEntry.name + " url:" + fileEntry.toURL() + '(from saveTable2ToPGFileAPI)');
                            //$scope.inProgress = false;
                            //$scope.$apply();
                        };

                        fileWriter.onerror = function (e) {
                            console.log('Write failed: ' + e.toString());
                        };

                        //saves a subset of $rootScope.data to tableToSave
                        var tableToSave = [];
                        for (var i = 0; i < $rootScope.numberOfRows; i++) {

                            tableToSave.push($rootScope.data[i]);

                        }

                        //overwrites the file from the beginning
                        fileWriter.seek(0);
                        fileWriter.write(JSON.stringify(tableToSave));

                        alert('table with ' + $rootScope.numberOfRows + ' has been saved.');

                    }, errorHandler);

                }, errorHandler);

            },
            errorHandler
        );

    };


    $scope.loadTable2= function () {

        $scope.tableFromPGFileAPI = [];

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {


                var filename = filenameForMethod2;
                fs.root.getFile(filename, {}, function (fileEntry) {

                    // Get a File object representing the file,
                    // then use FileReader to read its contents.
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function (e) {

                            //alert(this.result);
                            console.log('this result: ' + this.result + '(from loadTable2FromPGFileAPI)');
                            //alert(JSON.parse(this.result));
                            $scope.tableFromPGFileAPI = [];
                            $scope.tableFromPGFileAPI = JSON.parse(this.result);

                            highlightDestinationTableTitle($scope);

                        };

                        reader.readAsText(file);
                    }, errorHandler);

                }, errorHandler2);
            },
            errorHandler
        )
        ;

    };

    $scope.deleteTable2= function () {
        var filename = filenameForMethod2;
        //$scope.inProgress = true;

        console.log('deleteTable2FromPGFileAPI');
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {

            fs.root.getFile(filename, {create: false}, function (fileEntry) {

                fileEntry.remove(function () {
                    console.log(filename + ' has been removed.');

                    //$scope.inProgress = false;
                    //$scope.$apply();
                }, errorHandler);

            }, errorHandler);
        }, errorHandler);

    };

    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                alert('QUOTA_EXCEEDED_ERR');
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
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

    function errorHandler2(e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                alert('QUOTA_EXCEEDED_ERR');

                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                $scope.tableFromPGFileAPI = [];

                highlightDestinationTableTitle($scope);

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