sdApp.directive('ngStrDataDatasetLoader', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/StrDataDatasetLoader.html'
    }

})
    .controller('strDataDatasetLoaderCtrl', function ($scope, $rootScope, testDataFactory) {

        $rootScope.verifyTestsOutput = true;

        $scope.datasets = [
            'data01_2000.json',
            'data_2000_forUpdate.json'
        ];

        //set the default value for numberOfRows
        $rootScope.numberOfRows = 5;

        $rootScope.data = [];
        $rootScope.tableOriginal = [];

        //copied and modified from
        // http://thiscouldbebetter.wordpress.com/2013/01/31/reading-a-string-from-a-file-in-javascript/
        startJSONImport = function () {

            var pathOfFileToRead = 'res/data/' + $scope.selectedDataset;

            $rootScope.data = testDataFactory.getDataFromFile(pathOfFileToRead);

            console.log('dataset ' + $scope.selectedDataset + " loaded successfully");

        };

        $scope.createTable = function () {

            $rootScope.tableOriginal = [];

            for (var i = 0; i < $rootScope.numberOfRows; i++) {

                $rootScope.tableOriginal.push($rootScope.data[i]);

            }

            //set animation
            //color changes for 1.5 seconds and then changes back

            if (animationsEnabled) {
                highlightSourceTableTitle($scope);
            }

        };

        $scope.selectAndLoadDataset = function (dataset) {

            $scope.selectedDataset = dataset;
            startJSONImport();
            $rootScope.numberOfRows = 5;
            $scope.createTable();
            animationsEnabled = true;

        };

        //variable is set to false, to avoid animation after loading the page
        var animationsEnabled = false;

        $scope.selectAndLoadDataset($scope.datasets[0]);

        $scope.openDatasetSelectionOverlay = function () {
            $scope.toggle('datasetSelectionOverlay', 'on');
        };

        //$scope.test = function () {
        //    alert('test');
        //};

        $scope.decreaseNumberOfRowsBy = function (i) {
            $rootScope.numberOfRows = $rootScope.numberOfRows - i;

            if ($rootScope.numberOfRows < 0) {
                $rootScope.numberOfRows = 0;
            }
        };

        $scope.increaseNumberOfRowsBy = function (i) {
            $rootScope.numberOfRows = $rootScope.numberOfRows + i;

            if ($rootScope.numberOfRows > $rootScope.data.length) {
                $rootScope.numberOfRows = $rootScope.data.length;
            }
        };
    });


sdApp.directive('ngStartPerformanceTestButtonWithDatabase', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/StartPerformanceTestButtonWithDatabase.html'
    }


});

sdApp.directive('ngStartPerformanceTestButtonWithoutDatabase', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/StartPerformanceTestButtonWithoutDatabase.html'
    }


});

sdApp.directive('ngPrepareSectionForTests', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/PrepareSectionForTests.html'

    }

});

sdApp.directive('ngOpenDatabaseSectionWebsql', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/OpenDatabaseSectionWebsql.html'
    }

});

sdApp.directive('ngOpenDatabaseSectionSqliteplugin', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/OpenDatabaseSectionSqliteplugin.html'
    }

});

sdApp.directive('ngOpenDatabaseSection', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/OpenDatabaseSection.html'
    }

});

sdApp.directive('ngResultsForPerformanceTests', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/ResultsForPerformanceTests.html'
    }

});

sdApp.directive('ngResultsForPlatformTests', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/ResultsForPlatformTests.html'
    }

});

sdApp.directive('ngMediadataImageSelector', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/MediadataImageSelector.html'
    }


})
    .controller('MediadataImageSelectorCtrl', function ($scope, $rootScope) {


        $rootScope.images = [
            'res/logo_brs.jpg', 'res/logo_angularJS.jpg', 'res/logo_cordova.jpg'
        ];


        $rootScope.currentImage = 0;

        $scope.image_next = function () {
            if ($rootScope.currentImage == $rootScope.images.length - 1) {
                $rootScope.currentImage = 0;
            } else {
                $rootScope.currentImage++;
            }
        };

        $scope.image_prev = function () {
            if ($rootScope.currentImage == 0) {
                $rootScope.currentImage = $rootScope.images.length - 1;
            } else {
                $rootScope.currentImage--;
            }
        };

    });

sdApp.directive('ngMediadataVideoSelector', function () {

    return {
        restrict: 'A',
        templateUrl: 'customAngularDirectives/MediadataVideoSelector.html'
    }

})
    .controller('MediadataVideoSelectorCtrl', function ($scope, $rootScope) {

        $rootScope.videos = [
            'res/H264_test4_Talkingheadclipped_mp4_480x320.mp4', 'res/H264_test1_Talkinghead_mp4_480x360.mp4', 'res/mov_bbb.mp4'
        ];


        $rootScope.currentVideo = 0;

        $scope.video_next = function () {
            if ($rootScope.currentVideo == $rootScope.videos.length - 1) {
                $rootScope.currentVideo = 0;
            } else {
                $rootScope.currentImage++;
            }
        };

        $scope.video_prev = function () {
            if ($rootScope.currentVideo == 0) {
                $rootScope.currentVideo = $rootScope.videos.length - 1;
            } else {
                $rootScope.currentVideo--;
            }
        };
    });
