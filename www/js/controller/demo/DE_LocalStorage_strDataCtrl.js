sdApp.controller('DE_LocalStorage_strDataCtrl', function ($scope, $rootScope) {

    $scope.tableFromLocalStorage = [];

    //Method1: As seperate key/value pairs

    $scope.saveTable1= function () {

        //delete old data first
        $scope.deleteTable1FromLocalStorage();

        for (var i = 0; i < $rootScope.numberOfRows; i++) {

            localStorage.setItem('table1_' + i + '_id', $rootScope.data[i][0]);
            localStorage.setItem('table1_' + i + '_firstname', $rootScope.data[i][1]);
            localStorage.setItem('table1_' + i + '_lastname', $rootScope.data[i][2]);
            localStorage.setItem('table1_' + i + '_street', $rootScope.data[i][3]);
            localStorage.setItem('table1_' + i + '_zipcode', $rootScope.data[i][4]);
            localStorage.setItem('table1_' + i + '_city', $rootScope.data[i][5]);
            localStorage.setItem('table1_' + i + '_email', $rootScope.data[i][6]);
            localStorage.setItem('table1_' + i + '_randomNumber1', $rootScope.data[i][7]);
            localStorage.setItem('table1_' + i + '_randomNumber2', $rootScope.data[i][8]);

        }

        localStorage.setItem('table1_numberOfAddresses', $rootScope.numberOfRows);

        console.log('saved ' + $rootScope.numberOfRows + ' addresses (method 1).');

    };

    $scope.loadTable1= function () {

        var numberOfRows = localStorage.getItem('table1_numberOfAddresses');

        $scope.tableFromLocalStorage = [];

        for (var i = 0; i < numberOfRows; i++) {

            var address = [];

            address[0] = localStorage.getItem('table1_' + i + '_id');
            address[1] = localStorage.getItem('table1_' + i + '_firstname');
            address[2] = localStorage.getItem('table1_' + i + '_lastname');
            address[3] = localStorage.getItem('table1_' + i + '_street');
            address[4] = localStorage.getItem('table1_' + i + '_zipcode');
            address[5] = localStorage.getItem('table1_' + i + '_city');
            address[6] = localStorage.getItem('table1_' + i + '_email');
            address[7] = localStorage.getItem('table1_' + i + '_randomNumber1');
            address[8] = localStorage.getItem('table1_' + i + '_randomNumber2');

            $scope.tableFromLocalStorage.push(address);

        }

        highlightDestinationTableTitle($scope);

    };


    $scope.deleteTable1= function () {

        var numberOfRows = localStorage.getItem('table1_numberOfAddresses');

        for (var i = 0; i < numberOfRows; i++) {

            localStorage.removeItem('table1_' + i + '_id');
            localStorage.removeItem('table1_' + i + '_firstname');
            localStorage.removeItem('table1_' + i + '_lastname');
            localStorage.removeItem('table1_' + i + '_street');
            localStorage.removeItem('table1_' + i + '_zipcode');
            localStorage.removeItem('table1_' + i + '_city');
            localStorage.removeItem('table1_' + i + '_email');
            localStorage.removeItem('table1_' + i + '_randomNumber1');
            localStorage.removeItem('table1_' + i + '_randomNumber2');

        }

        localStorage.removeItem('table1_numberOfAddresses');

        console.log('deleted all addresses from LocalStorage (method 1).');

    };

    //Method2: Every row data-item (address) is stored in a key-value pair

    $scope.saveTable2= function () {

        //delete old data first
        $scope.deleteTable2();

        for (var i = 0; i < $rootScope.numberOfRows; i++) {

            localStorage.setItem('table1_' + i, JSON.stringify($rootScope.data[i]));

        }

        localStorage.setItem('table1_numberOfAddresses_method2', $rootScope.numberOfRows);

        console.log('saved ' + $rootScope.numberOfRows + ' addresses (method 2).');

    };

    $scope.loadTable2FromLocalStorage = function () {

        $scope.tableFromLocalStorage = [];

        var numberOfRows = localStorage.getItem('table1_numberOfAddresses_method2');

        for (var i = 0; i < numberOfRows; i++) {

            var addressLoaded = JSON.parse(localStorage.getItem('table1_' + i));

            $scope.tableFromLocalStorage.push(addressLoaded);

        }

        highlightDestinationTableTitle($scope);

    };

    $scope.deleteTable2FromLocalStorage = function () {

        var numberOfRows = localStorage.getItem('table1_numberOfAddresses_method2');

        for (var i = 0; i < numberOfRows; i++) {

            localStorage.removeItem('table1_' + i);
        }

        localStorage.removeItem('table1_numberOfAddresses_method2');

        console.log('deleted all addresses from LocalStorage (method 2).');

    };


    //Method3: As JSON-String with JSON.stringify

    $scope.saveTable3ToLocalStorage = function () {

        //delete old data first
        $scope.deleteTable3FromLocalStorage();

        var tableToSave = [];
        for (var i = 0; i < $rootScope.numberOfRows; i++) {

            tableToSave.push($rootScope.data[i]);

        }

        localStorage.setItem('table1_JSON', JSON.stringify(tableToSave));

        console.log('saved ' + $rootScope.numberOfRows + ' addresses (method 3).');

    };

    $scope.loadTable3FromLocalStorage = function () {

        $scope.tableFromLocalStorage = [];
        var tableFromLocalStorage = localStorage.getItem('table1_JSON');
        $scope.tableFromLocalStorage = JSON.parse(tableFromLocalStorage);

        highlightDestinationTableTitle($scope);

    };

    $scope.deleteTable3FromLocalStorage = function () {

        localStorage.removeItem('table1_JSON');

        console.log('deleted all addresses from LocalStorage (method 3).');

    };

});