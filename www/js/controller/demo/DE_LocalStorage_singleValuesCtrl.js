sdApp.controller('DE_LocalStorage_singleValuesCtrl', function ($scope) {

    $scope.keyToLoad = "a";
    $scope.keyToSave = "a";
    $scope.valueToSave = "b";
    $scope.keyToRemove = "";

    $scope.saveEinzelwerte = function () {
        if ($scope.keyToSave == '' || $scope.valueToSave == '') {
            alert('You need to enter a key and a value');
        } else {
            localStorage.setItem($scope.keyToSave, $scope.valueToSave);
            console.log('saved Value ' + $scope.valueToSave + ' for key ' + $scope.keyToSave);

        }
    };

    $scope.updateEinzelwerteView = function () {
        $scope.localStorage = localStorage;
        $scope.keyLoaded = $scope.keyToLoad;

        var item = localStorage.getItem($scope.keyToLoad);

        if (item == null) {
            $scope.valueLoadedFromLocalStorage = 'does not exist';
        } else {
            $scope.valueLoadedFromLocalStorage = 'has value "' + item + '"';
        }

    };

    $scope.removeKeyFromLocalStorage = function () {
        localStorage.removeItem($scope.keyToRemove);
        alert('key ' + $scope.keyToRemove + ' was removed');
    };

});