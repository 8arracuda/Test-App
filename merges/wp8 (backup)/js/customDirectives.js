sdApp.directive('ngStrDatenDatasetLoader', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/StrDatenDatasetLoader.html'
    }

})
    .controller('strDatenDatasetLoaderCtrl', function ($scope, $rootScope, testDataFactory) {

        $rootScope.verifyTestsOutput = true;

        $scope.datasets = [
            'data01_small.json',
            'data01.json',
            'data02.json',
            'data03.json',
            'data04.json',
            'data05.json',
            'data01+02.json'
            //'data06.json',
            //'data07.json',
            //'data08.json',
            //'data09.json',
            //'data10.json',
            //'data01-05.json',
            //'data06-10.json',
            //'data01-10.json'
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
        templateUrl: '/www/customAngularDirectives/StartPerformanceTestButtonWithDatabase.html'
    }


});

sdApp.directive('ngStartPerformanceTestButtonWithoutDatabase', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/StartPerformanceTestButtonWithoutDatabase.html'
    }


});

sdApp.directive('ngPrepareSectionForTests', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/PrepareSectionForTests.html'

    }

});

sdApp.directive('ngOpenDatabaseSectionWebsql', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/OpenDatabaseSectionWebsql.html'
    }

});

sdApp.directive('ngOpenDatabaseSection', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/OpenDatabaseSection.html'
    }

});

sdApp.directive('ngResultsForPerformanceTests', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/ResultsForPerformanceTests.html'
    }

});

sdApp.directive('ngMediendatenImageSelector', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/MediendatenImageSelector.html'
    }


})
    .controller('MediendatenImageSelectorCtrl', function ($scope, $rootScope) {


        $rootScope.images = [
            '/www/res/logo_brs.jpg', '/www/res/logo_angularJS.jpg', '/www/res/logo_cordova.jpg'
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

sdApp.directive('ngMediendatenVideoSelector', function () {

    return {
        restrict: 'A',
        templateUrl: '/www/customAngularDirectives/MediendatenVideoSelector.html'
    }

})
    .controller('MediendatenVideoSelectorCtrl', function ($scope, $rootScope) {

        $rootScope.videos = [
            '/www/res/H264_test4_Talkingheadclipped_mp4_480x320.mp4', '/www/res/H264_test1_Talkinghead_mp4_480x360.mp4', '/www/res/mov_bbb.mp4'
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
