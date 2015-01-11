sdApp.controller('LocalStorageList2DetailsCtrl', function ($scope, $routeParams) {

    var key = $routeParams.key;

    $scope.value = localStorage.getItem(key);

});