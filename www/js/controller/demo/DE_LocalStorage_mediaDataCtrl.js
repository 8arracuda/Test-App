sdApp.controller('DE_LocalStorage_mediaDataCtrl', function ($scope, $rootScope) {

    $scope.saveImageToLocalStorage = function () {
        imageFilename = $scope.images[$scope.currentImage];
        imageData = convertImageToBase64Format(imageFilename, "image/jpeg");
        localStorage.setItem('image', imageData);
    };

    $scope.loadImageFromLocalStorage = function () {

        imageData = localStorage.getItem('image');
        document.getElementById("imagePlaceholder").src = imageData;

    };

    //Funktion übernommen von http://forums.mozillazine.org/viewtopic.php?f=19&t=856865
    function convertImageToBase64Format(imageURI, aType) {
        var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
        var image = document.createElementNS("http://www.w3.org/1999/xhtml", "html:img");
        image.src = imageURI;

        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(aType);
    };

    $scope.showImageInLocalStorage = function () {
        alert(localStorage.getItem('image'));
    };

    $scope.deleteImageFromLocalStorage = function () {
        localStorage.removeItem('image');
    };



    //load image from localStorage when page is loaded
    $scope.loadImageFromLocalStorage();



//------------------------
//------------------------
//------------------------
//------------------------
//
//
    $scope.videos = [
        'res/H264_test4_Talkingheadclipped_mp4_480x320.mp4', 'res/H264_test1_Talkinghead_mp4_480x360.mp4', 'res/mov_bbb.mp4'
    ];

    $scope.currentVideo = 0;

    $scope.video_next = function () {
        if ($scope.currentVideo == $scope.videos.length - 1) {
            $scope.currentVideo = 0;
        } else {
            $scope.currentVideo++;
        }
    };

    $scope.video_prev = function () {
        if ($scope.currentVideo == 0) {
            $scope.currentVideo = $scope.videos.length - 1;
        } else {
            $scope.currentVideo--;
        }
    };

    $scope.saveVideoToLocalStorage = function () {
        videoFilename = $scope.videos[$scope.currentVideo];
        videoData = convertVideoToBase64Format(videoFilename, "video/mp4");
        localStorage.setItem('video', videoData);
    };

    $scope.loadVideoFromLocalStorage = function () {

        videoData = localStorage.getItem('video');
        document.getElementById("videoPlaceholder").src = videoData;

    };

    //Funktion übernommen von http://forums.mozillazine.org/viewtopic.php?f=19&t=856865
    function convertVideoToBase64Format(videoURI, aType) {
        var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
        var video = document.createElementNS("http://www.w3.org/1999/xhtml", "html:video");
        video.src = videoURI;

        canvas.width = video.width;
        canvas.height = video.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL(aType);
    };

    $scope.showVideoInLocalStorage = function () {
        alert(localStorage.getItem('video'));
    };

    $scope.deleteVideoFromLocalStorage = function () {
        localStorage.removeItem('video');
    };

});