sdApp.controller('PE_SessionStorageCtrl', function ($scope, $rootScope) {

    $rootScope.section = 'PE';

    $scope.sessionStorage = sessionStorage;

    //<für alle Tabs>
    $scope.stringForRightButton = '';
    $scope.stringForTitle = 'SessionStorage';
    $scope.functionForRightButton = function () {
        $rootScope.toggle('myOverlay', 'on');
    };
    //</für alle Tabs>

    $scope.enableTab_1 = function () {
        $scope.tab = 1;
        //$scope.stringForTitle = 'SessionStorage';
        //$scope.stringForRightButton = 'EZW';
    };

    $scope.enableTab_2 = function () {
        $scope.tab = 2;
        //$scope.stringForTitle = 'SS - strDaten';
        //$scope.stringForRightButton = 'STR';
    };

    $scope.enableTab_3 = function () {
        $scope.tab = 3;
        //$scope.stringForTitle = 'SS Mediendaten';
        //$scope.stringForRightButton = 'MED';
    };

    $scope.enableTab_4 = function () {
        $scope.tab = 4;
        //$scope.stringForTitle = 'SS Mediendaten';
        //$scope.stringForRightButton = 'MED';
    };

    $scope.enableTab_5 = function () {
        $scope.tab = 5;
        //$scope.stringForTitle = 'SS Mediendaten';
        //$scope.stringForRightButton = 'MED';
    };

    $scope.enableTab_6 = function () {
        $scope.tab = 6;
        //$scope.stringForTitle = 'SS Mediendaten';
        //$scope.stringForRightButton = 'MED';
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