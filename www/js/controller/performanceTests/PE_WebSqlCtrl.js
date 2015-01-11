sdApp.controller('PE_WebSqlCtrl', function ($scope, $rootScope) {

    $rootScope.section = 'PE';

    //<für alle Tabs>
    $scope.stringForRightButton = '';
    $scope.stringForTitle = 'WebSQL';
    //$scope.functionForRightButton = function () {
    //    $rootScope.toggle('myOverlay', 'on');
    //};
    //</für alle Tabs>

    $scope.enableTab_1 = function () {
        $scope.tab = 1;
    };

    $scope.enableTab_2 = function () {
        $scope.tab = 2;
    };

    $scope.enableTab_3 = function () {
        $scope.tab = 3;
    };

    $scope.enableTab_4 = function () {
        $scope.tab = 4;
    };

    $scope.enableTab_5 = function () {
        $scope.tab = 5;
    };

    $scope.enableTab_6 = function () {
        $scope.tab = 6;
    };

    $scope.enableTab_7 = function () {
        $scope.tab = 7;
    };

    $scope.enableTab_8 = function () {
        $scope.tab = 8;
    };

    $scope.enableTab_9 = function () {
        $scope.tab = 9;
    };

    $scope.enableTab_10 = function () {
        $scope.tab =10;
    };

    $scope.enableTab_1();

});