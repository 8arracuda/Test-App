sdApp.controller('DE_SessionStorageCtrl', function ($scope, $rootScope) {

    $rootScope.section='DE';

    //<für alle Tabs>
    $scope.stringForRightButton = 'show keys';
    $scope.stringForTitle = 'SessionStorage';
    $scope.functionForRightButton = function () {
        $rootScope.toggle('myOverlay', 'on');
    };
    //</für alle Tabs>

    $scope.enableTab_singleValues = function () {
        $scope.tab = 1;
    };

    $scope.enableTab_structuredData = function () {
        $scope.tab = 2;
    };

    $scope.enableTab_mediaData = function () {
        $scope.tab = 3;
    };

    $scope.enableTab_singleValues();

});