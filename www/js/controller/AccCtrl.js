sdApp.controller('AccCtrl', function ($scope) {

    $scope.refreshIntervalId = -1;
    $scope.accelerometer = navigator.accelerometer;

    alert(cordova.file.applicationDirectory);

    onSuccess = function (acceleration) {
        console.log('onSuccess');

        $scope.$apply(function () {
            $scope.AccX = acceleration.x;
            $scope.AccY = acceleration.y;
            $scope.AccZ = acceleration.z;
        });
        //$scope.$apply();
    };

    onError = function () {
        alert('onError!');
    };

    $scope.startUpdating = function () {

        console.log("startUpdating");
        $scope.refreshIntervalId = setInterval(
            "navigator.accelerometer.getCurrentAcceleration(onSuccess, onError)",
            250
        );
    }

    $scope.stopUpdating = function () {
        console.log("stopUpdating");
        clearInterval($scope.refreshIntervalId);
        $scope.refreshIntervalId = -1;
    }


    $scope.callManually = function () {
        navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    }

    $scope.$watch('AccX', function () {
        console.log('foobar')
    });

});