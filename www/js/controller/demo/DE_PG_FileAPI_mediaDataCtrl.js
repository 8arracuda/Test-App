sdApp.controller('DE_PG_FileAPI_mediaDataCtrl', function ($scope, $rootScope) {

    $scope.loadImageToCanvas = function () {

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        //  img = $scope.images[$scope.currentImage];
        img = document.getElementById("sourceImage");
        ctx.drawImage(img,10,10,150,180);
        //var dataURL = canvas.toDataURL('image/jpeg;base64');
        var dataURL = canvas.toDataURL('image/jpeg');
        //alert('dataURL' + dataURL);

        var image64 = dataURL.replace(/data:image\/jpeg;base64,/, '');

        mimeString = 'image/jpeg';
        var myBlob = new Blob([image64], {type:mimeString});

        //alert('myBlob.type ' + myBlob.type); // image/jpeg
        //alert('myBlob.length ' + myBlob.length); // undefinded
        //alert('myBlob.valueOf()' + myBlob.valueOf()); // [object Blob]
        alert('myBlob.valueOf()' + JSON.stringify(myBlob.valueOf())); // {}

        //var bb = new BlobBuilder();
        //bb.append(image64);
        //var blob = bb.getBlob('image/png');
        //alert('blob:' + blob);

    };

    $scope.saveImageToPGFileAPI = function () {

        imageFilename = $scope.images[$scope.currentImage];
        //imageData = convertImageToBase64Format(imageFilename, "image/jpeg");
        //localStorage.setItem('image', imageData);


        console.log('will save image: ' + imageFilename);
    }


    $scope.saveTable2ToPGFileAPI = function () {

        window.requestFileSystem(window.PERSISTENT, 1024 * 1024,
            function (fs) {

                saveAsset('http://www.example-site-with-cors.com/test.png');

            },
            errorHandler
        );

    };

    function saveAsset(url, callback, failCallback) {
        var filename = url.substring(url.lastIndexOf('/') + 1);

        // Set callback when not defined
        if (!callback) {
            callback = function (cached_url) {
                console.log('download ok: ' + cached_url);
            };
        }
        if (!failCallback) {
            failCallback = function () {
                console.log('download failed');
            };
        }

        // Set lookupTable if not defined
        if (!window.lookupTable)
            window.lookupTable = {};

        // BlobBuilder shim
        // var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        // xhr.responseType = 'blob';
        xhr.responseType = 'arraybuffer';

        xhr.addEventListener('load', function () {

            fs.root.getFile(filename, {create: true, exclusive: false}, function (fileEntry) {
                fileEntry.createWriter(function (writer) {

                    writer.onwrite = function (e) {
                        // Save this file in the path to URL lookup table.
                        lookupTable[filename] = fileEntry.toURL();
                        callback(fileEntry.toURL());
                    };

                    writer.onerror = failCallback;

                    // var bb = new BlobBuilder();
                    var blob = new Blob([xhr.response], {type: ''});
                    // bb.append(xhr.response);
                    writer.write(blob);
                    // writer.write(bb.getBlob());

                }, failCallback);
            }, failCallback);
        });

        xhr.addEventListener('error', failCallback);
        xhr.send();

        return filename;
    }

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

});