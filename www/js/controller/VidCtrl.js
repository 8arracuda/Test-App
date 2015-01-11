sdApp.controller('VidCtrl', function ($scope) {

    $scope.startVid = function() {
        console.log('startVid');

        // Not showing vendor prefixes.
        navigator.getUserMedia('video, audio', function(localMediaStream) {
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function(e) {
                // Ready to go. Do some stuff.
            };
        }, onFailSoHard);

    }

    var onFailSoHard = function(e) {
        console.log('Reeeejected!', e);
    };



});