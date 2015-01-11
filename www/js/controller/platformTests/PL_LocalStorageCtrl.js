sdApp.controller('PL_LocalStorageCtrl', function ($scope, $rootScope, TestHelperFactory, testDataFactory) {

    $rootScope.section = 'PL';

    $scope.result = '';
    $scope.isPrepared = false;
    $scope.testInProgress = false;

    $scope.localStorage = localStorage;

    $scope.prepare = function () {











        localStorage.clear();
        $scope.isPrepared = true;
        $scope.currentIteration = '';
        $scope.$apply();
    };

    $scope.startPlatformTest = function () {

        //the function writes x-items to LocalStorage.
        //after x-items the UI will be updated to show some progress for the user
        //after that the function will continue
        //It will continue until it reaches max quota.

        function nextLoop() {

            try {

                localStorage.setItem($scope.currentIteration, datasetStringToSave);

                //timeout to allow the UI to update
                //setTimeout(
                  //  function () {
                        //to update the UI - gives the user an update about the progress as the test progresses
                        $scope.currentIteration = (parseInt($scope.currentIteration) + 1);
                        $scope.$apply();
                        setTimeout(
                            nextLoop(), 500);
                    //}, 500);

            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    //console.log('error is QuotaExceededError');
                    $scope.result = { description: 'QuotaExceededError', exceptionInIteration: $scope.currentIteration};
                    $scope.testInProgress = false;
                    $scope.$apply();
                }

            }

        };

        //start the test

        var datasetStringToSave = JSON.stringify(testDataFactory.getDatasetForPlatformTest());
        $scope.testInProgress = true;
        $scope.$apply();

        $scope.currentIteration = 1;
        nextLoop();

    };

})
;
