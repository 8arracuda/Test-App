sdApp.controller('CamCtrl', function ($scope) {

    alert('test');

    $scope.name='mmm';

    $scope.camera = navigator.camera;

    cameraSuccess = function (imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;

    };

    cameraError = function (message) {
        alert('Failed because: ' + message);
    };

    $scope.startCamera = function () {
        console.log('start camera');

        navigator.camera.getPicture(cameraSuccess, cameraError, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });

    }

    $scope.stopCamera = function () {
        console.log('stop camera');

    }

});