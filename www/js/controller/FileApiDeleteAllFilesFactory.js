//angular.module('FileApiDeleteAllFilesFactory', [])
//    .factory('FileApiDeleteAllFilesFactory', function () {
//        return {
//            deleteAllFiles: function (callback) {
//
//                function errorHandler(e) {
//                    var msg = '';
//
//                    switch (e.code) {
//                        case FileError.QUOTA_EXCEEDED_ERR:
//                            msg = 'QUOTA_EXCEEDED_ERR';
//                            alert('QUOTA_EXCEEDED_ERR');
//                            break;
//                        case FileError.NOT_FOUND_ERR:
//                            msg = 'NOT_FOUND_ERR(1)';
//                            break;
//                        case FileError.SECURITY_ERR:
//                            msg = 'SECURITY_ERR';
//                            break;
//                        case FileError.INVALID_MODIFICATION_ERR:
//                            msg = 'INVALID_MODIFICATION_ERR';
//                            break;
//                        case FileError.INVALID_STATE_ERR:
//                            msg = 'INVALID_STATE_ERR';
//                            break;
//                        default:
//                            msg = 'Unknown Error';
//                            break;
//                    }
//
//
//                    console.log('Error: ' + msg);
//                }
//
//                function toArray(list) {
//                    return Array.prototype.slice.call(list || [], 0);
//                }
//
//                function listResults(entries, fs) {
//
//                    entries.forEach(function (entry, i) {
//
//                        if (!entry.isDirectory) {
//                            //console.log('entry.name:' + entry.name);
//
//                            var filename = entry.name;
//
//                            if (filename != '.DS_Store') {
//
//                                fs.root.getFile(filename, {create: false}, function (fileEntry) {
//
//                                    fileEntry.remove(function () {
//                                        //console.log(filename + ' has been removed.');
//
//                                    }, errorHandler);
//
//                                }, errorHandler);
//
//                            }
//                        }
//
//                    });
//
//
//                }
//
//                window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {
//                    var dirReader = fs.root.createReader();
//                    var entries = [];
//
//                    // Call the reader.readEntries() until no more results are returned.
//                    var readEntries = function () {
//                        dirReader.readEntries(function (results) {
//                            if (!results.length) {
//                                listResults(entries.sort(), fs);
//                                console.log('deleteAllFiles finished');
//                                callback();
//                            } else {
//                                entries = entries.concat(toArray(results));
//                                readEntries();
//                            }
//                        }, errorHandler);
//                    };
//
//                    readEntries();
//
//                }, errorHandler);
//
//            }
//
//        };
//    });


angular.module('FileApiDeleteAllFilesFactory', [])
    .factory('FileApiDeleteAllFilesFactory', function () {
        return {
            deleteAllFiles: function (callback) {

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


                    console.log('Error: ' + msg);
                }

                function toArray(list) {
                    return Array.prototype.slice.call(list || [], 0);
                }

                function listResults(entries, fs, callback) {

                    entries.forEach(function (entry, i) {

                        if (!entry.isDirectory) {
                            //console.log('entry.name:' + entry.name);

                            var filename = entry.name;

                            if (filename != '.DS_Store') {

                                fs.root.getFile(filename, {create: false}, function (fileEntry) {

                                    fileEntry.remove(function () {
                                        if (i==entries.length-1) {
                                            callback();
                                        }
                                        //console.log(filename + ' has been removed.');

                                    }, errorHandler);

                                }, errorHandler);

                            }
                        }

                    });
                    callback();


                }

                window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {
                    var dirReader = fs.root.createReader();
                    var entries = [];

                    // Call the reader.readEntries() until no more results are returned.
                    var readEntries = function () {
                        dirReader.readEntries(function (results) {
                            if (!results.length) {
                                listResults(entries.sort(), fs, callback);
                                console.log('deleteAllFiles finished');
                                //callback();
                            } else {
                                entries = entries.concat(toArray(results));
                                readEntries();
                            }
                        }, errorHandler);
                    };

                    readEntries();

                }, errorHandler);

            }

        };
    });