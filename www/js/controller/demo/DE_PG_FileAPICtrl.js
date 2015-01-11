sdApp.controller('DE_PG_FileAPICtrl', function ($scope, $rootScope) {

    //var fs;

    $rootScope.section = 'DE';
    $scope.loadingInProgress = false;
    $scope.filelist = [];

    //<für alle Tabs>
    $scope.stringForRightButton = 'show files';
    $scope.stringForTitle = 'File API-Plugin';
    $scope.functionForRightButton = function () {
        $rootScope.toggle('myOverlay', 'on');
        showFiles();
    };
    //</für alle Tabs>

    $scope.enableTab_singleValues = function () {
        $scope.tab = 1;
    };

    $scope.enableTab_strData = function () {
        $scope.tab = 2;
    };

    $scope.enableTab_mediaData = function () {
        $scope.tab = 3;
    };

    $scope.enableTab_singleValues();

    //Functions for the Overlay

    //TODO For debugging in Chrome (remove at the end)
    if (!navigator.userAgent == userAgentForDesktopDevelopment1 || !navigator.userAgent == userAgentForDesktopDevelopment2) {
        $scope.documentsDirectory = cordova.file.documentsDirectory;
    }

    $scope.reloadFileList = function () {
        showFiles();
    };

    function showFiles() {

        console.log('showfiles started');
        $scope.filelist = [];
        $scope.loadingInProgress = true;
        $scope.$apply();

        function toArray(list) {
            return Array.prototype.slice.call(list || [], 0);
        }

        function listResults(entries) {

            $scope.loadingInProgress = true;
            $scope.$apply();

            entries.forEach(function (entry, i) {

                if (entry.isDirectory) {
                    var fileListEntry = {name: entry.name + ' [DIR]', value: ""};
                } else {
                    var fileListEntry = {name: entry.name, value: ""};
                }

                $scope.filelist.push(fileListEntry);

            });
            $scope.loadingInProgress = false;
            $scope.$apply();

        }


        console.log('before');
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                var dirReader = fs.root.createReader();
                var entries = [];

                // Call the reader.readEntries() until no more results are returned.
                var readEntries = function () {
                    dirReader.readEntries(function (results) {
                        if (!results.length) {
                            listResults(entries.sort());
                        } else {
                            entries = entries.concat(toArray(results));
                            readEntries();
                        }
                    }, errorHandler);
                };

                readEntries(); // Start reading dirs.

            }, errorHandler);
        console.log('after');

    };

    $scope.loadFileContent = function (index) {
        var filename = $scope.filelist[index].name;

        function getFileContent(fs) {

            fs.root.getFile(filename, {}, function (fileEntry) {

                // Get a File object representing the file,
                // then use FileReader to read its contents.
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (e) {

                        $scope.filelist[index].value = this.result;
                        $scope.$apply();
                    };

                    reader.readAsText(file);
                }, errorHandler);

            }, errorHandler);
        };

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, getFileContent, errorHandler);


    };

    $scope.deleteOneFile = function (filename) {

        if (filename.indexOf('[DIR]') != -1) {
            alert('Deletion of directories is not implemented.');
        } else {

            answer = confirm('do you really want to delete key "' + filename + '"?');

            if (answer == true) {
                window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {

                    fs.root.getFile(filename, {create: false}, function (fileEntry) {

                        fileEntry.remove(function () {
                            console.log(filename + ' has been removed.');

                            $scope.inProgress = false;
                            $scope.$apply();
                            $scope.reloadFileList();
                        }, errorHandler);

                    }, errorHandler);
                }, errorHandler);
            }
        }
    };

    $scope.deleteAllFiles = function () {

        var answer = confirm('do you really want to delete all files? (Note that directories will not be deleted.)');

        if (answer == true) {
            window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {

                    for (var i = 0; i < $scope.filelist.length; i++) {

                        //continue if it's not a directory
                        var filename = $scope.filelist[i].name;
                        if (filename.indexOf('[DIR]') == -1) {

                            fs.root.getFile(filename, {create: false}, function (fileEntry) {

                                fileEntry.remove(function () {
                                    console.log(filename + ' has been removed.');

                                }, errorHandler);

                            }, errorHandler);
                        }
                    }
                    $scope.inProgress = false;
                    $scope.$apply();
                    $scope.reloadFileList();

                },
                errorHandler
            )
            ;
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

})
;