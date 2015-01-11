angular.module('IndexedDBClearObjectStore', [])
    .factory('IndexedDBClearObjectStore', function () {
        return {
            clearObjectStore: function (db, objStoreName, callback) {

                var transaction = db.transaction([objStoreName], "readwrite");
                var objectStore = transaction.objectStore(objStoreName);

                objectStore.clear();
                objectStore.onerror = function (event) {
                    console.error("clearObjectStore error: ", event.target.errorCode);
                };

                transaction.oncomplete = function (event) {
                    callback();

                };
            }
        };
    });