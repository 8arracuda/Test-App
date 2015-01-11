sdApp.controller('DirectoryVariablesCtrl', function ($scope) {
    $scope.directoryVars = cordova.file;

//    $scope.directoryVars = [
//        { name: 'applicationDirectory',
//          value: cordova.file.applicationDirectory
//        },
//        { name: 'applicationStorageDirectory',
//            value: cordova.file.applicationStorageDirectory
//        }
//
//        ];

});