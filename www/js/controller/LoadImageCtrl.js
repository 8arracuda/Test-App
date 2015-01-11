sdApp.controller('LoadImageCtrl', function ($scope, $http) {

    $scope.loadImage_pg = function () {

        console.log("loadImage_pg start");
        $.get('img/logoGoogle.jpg').
            success(function (imageData) {
                console.log("LoadImage_pg success");

                alert(imageData);
                document.getElementById("imagePlaceholder").src = imageData;

            }).
            error(function (data, status, headers, config) {
                console.log('error while importing logoGoogle');
            });
        console.log('end loadImage_pg');
    }


    $scope.fooText = 'fooText';

    $scope.loadText = function () {
        console.log('start loadText');
        $.get('res/fooText.txt').
            success(function (data) {

                $scope.fooText = data;
                $scope.$apply();

            }).
            error(function (data, status, headers, config) {
                console.log('error while importing text');
            });
        console.log('end loadText');
    }

    $scope.loadBase64Image = function () {
        console.log('start loadBase64Image');

        $.get('res/flag.img').
            success(function (data) {

                console.log('loadBase64Image success');
                //document.getElementById("imagePlaceholder2").src = 'data:image/png;base64,' + data;
                document.getElementById("imagePlaceholder2").src = data;

            }).
            error(function (data, status, headers, config) {
                console.log('error while importing base64 image');
            });
    }
    console.log('end loadBase64Image');

});