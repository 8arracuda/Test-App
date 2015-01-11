angular.module('testDataFactory', [])
    .factory('testDataFactory', function () {

        var filename = 'res/data/data01_2000.json';
        var filenameForUpdateTests = 'res/data/data_2000_forUpdate.json';

        return {
            testData: function () {

                //var filename = 'res/data/data01_2000.json';
                //Filehelper function is defined in custom.js
                var contentsOfFileAsString = FileHelper.readStringFromFileAtPath(filename);

                return JSON.parse(contentsOfFileAsString);
            },

            getBigDataset: function() {
                var data1 = JSON.parse(FileHelper.readStringFromFileAtPath(filename));
                var data2 = JSON.parse(FileHelper.readStringFromFileAtPath(filenameForUpdateTests));
                var dataCombined = data1.concat(data2);

                return dataCombined;

            },

            getRandomIndices: function () {

                var filename = 'res/data/Indices_random_2000.json';

                //Filehelper function is defined in custom.js
                var contentsOfFileAsString = FileHelper.readStringFromFileAtPath(filename);
                return JSON.parse(contentsOfFileAsString);

            },

            getDatasetWithOffset: function (factor) {
                //This function uses the avaiable datasets to create new datasets
                //Example: When offset is set to 100, and dataCombined contains 4000 addresses
                //The returned array will contain 4000 addresses starting from index 100.
                //When the end of dataCombined is reached it starts from the beginning of the array.

                var data1 = JSON.parse(FileHelper.readStringFromFileAtPath(filename));
                var data2 = JSON.parse(FileHelper.readStringFromFileAtPath(filenameForUpdateTests));
                var dataCombined = data1.concat(data2);
                var offset = (100 * parseInt(factor)) % dataCombined.length;
                data1 = null;
                data2 = null;

                var newData1 = dataCombined.slice(offset, 4000);
                return newData1.concat(dataCombined.slice(0, offset));

            },

            testDataForUpdateTests: function () {
                //var filename = 'res/data/data02_first500_idStartingAt0.json';

                var contentsOfFileAsString = FileHelper.readStringFromFileAtPath(filenameForUpdateTests);
                return JSON.parse(contentsOfFileAsString);
            },

            getDataFromFile: function (filename) {
                console.log('fn:' + filename);
                //Filehelper function is defined in custom.js
                var contentsOfFileAsString = FileHelper.readStringFromFileAtPath(filename);

                return JSON.parse(contentsOfFileAsString);

            },

            getStringFromFile: function (filename) {

                //Filehelper function is defined in custom.js
                return FileHelper.readStringFromFileAtPath(filename);

            },

            getDatasetForPlatformTest: function () {

                var data = JSON.parse(FileHelper.readStringFromFileAtPath(filename));

                return data.slice(0, 100);

            }
        };
    });