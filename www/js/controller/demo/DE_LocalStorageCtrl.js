sdApp.controller('DE_LocalStorageCtrl', function ($scope, $rootScope) {

    $rootScope.section = 'DE';

    $scope.localStorage = localStorage;

    //<für alle Tabs>
    $scope.stringForRightButton = 'show keys';
    $scope.stringForTitle = 'LocalStorage';
    $scope.functionForRightButton = function () {
        $rootScope.toggle('myOverlay', 'on');
    };
    //</für alle Tabs>

    $scope.enableTab_singleValues = function () {
        $scope.tab = 1;
    };

    $scope.enableTab_strData = function () {
        $scope.tab = 2;
    };

    $scope.enableTab_mediaData = function () {
        $scope.tab = 3;
    };


    $scope.enableTab_singleValues();

    //Functions for the Overlay

    //showLocalStorage = function () {
    //    $rootScope.toggle('myOverlay', 'on');
    //};




    $scope.deleteItem = function (key) {
        var answer = confirm('do you really want to delete key "' + key + '"?')

        if (answer == true) {
            localStorage.removeItem(key);
        }
    };

});