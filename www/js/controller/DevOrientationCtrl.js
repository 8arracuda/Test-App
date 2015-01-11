sdApp.controller('DevOrientationCtrl', function ($scope) {

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (event) {
            $scope.alpha = event.alpha;
            $scope.beta = event.beta;
            $scope.gamma = event.gamma;
            $scope.$apply();

        });
    } else {
        alert('no DeviceOrientationEvent');
    }

});