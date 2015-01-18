angular.module('SQLDatabaseClearTable', [])
    .factory('SQLDatabaseClearTable', function () {
        return {
            clearTable: function (db, tableName, callback) {

                db.transaction(function (tx) {
                    tx.executeSql("DELETE FROM " + tableName, [], clearedTableCallback, errorHandler);
                });

                function clearedTableCallback(transaction, results) {
                    callback();
                    //console.log('Table ' + tableName + ' has been cleared');
                    //$scope.isPrepared = true;
                    //$scope.$apply();

                }

                function errorHandler(e) {
                    console.error(e.message);
                };

            }
        };
    });