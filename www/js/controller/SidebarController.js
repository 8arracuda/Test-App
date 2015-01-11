sdApp.controller('SidebarController', function ($scope, techSupportFactory) {

    ts = techSupportFactory.techSupport();

    $scope.techniques = ts;

    $scope.sidebar_performanceTests = [
        {
            labelText: 'Overview',
            linkURL: 'overview',
            support: true
        },
        {
            labelText: 'SessionStorage',
            linkURL: 'PE_sessionStorage',
            support: ts.sessionStorage
        },
        {
            labelText: 'LocalStorage',
            linkURL: 'PE_localStorage',
            support: ts.localStorage
        },
        {
            labelText: 'WebSQL',
            linkURL: 'PE_webSql',
            support: ts.webSQL
        },
        {
            labelText: 'IndexedDB',
            linkURL: 'PE_indexedDB',
            support: ts.indexedDB
        },
        {
            labelText: 'SQLite Plugin',
            linkURL: 'PE_SQLitePlugin',
            support: ts.sqlitePlugin
        },
        //TODO check if sqlitePlugin is working...

        {
            labelText: 'File API',
            linkURL: 'PE_fileAPI',
            support: ts.fileAPI_fullSupport
        },
        //{
        //    labelText: '(Acc)',
        //    linkURL: 'acc',
        //    support: ts.accelerometer
        //},
        //{
        //    labelText: '(Cam)',
        //    linkURL: 'cam',
        //    support: ts.camera
        //},
        //{
        //    labelText: '(directory variables)',
        //    linkURL: 'directoryVariables',
        //    support: true
        //},
        //{
        //    labelText: '(device orientation)',
        //    linkURL: 'devOrientation',
        //    support: true
        //},
        //{
        //    labelText: '(video)',
        //    linkURL: 'vid',
        //    support: true
        //},
        //{
        //    labelText: '(loadImage)',
        //    linkURL: 'loadImage',
        //    support: true
        //}
    ];

    //TODO bei FileAPI wird auf Chrome/Desktop angezeigt, dass es unterstützt wird, obwohl es nicht der Fall ist - Der Test in TechSupport muss verbessert werden


    $scope.sidebar_plattformTests = [
        {
            labelText: 'LocalStorage',
            linkURL: 'PL_localStorage',
            support: ts.localStorage
        },
        {
            labelText: 'WebSQL',
            linkURL: 'PL_webSQL',
            support: ts.webSQL
        },
        {
            labelText: 'IndexedDB',
            linkURL: 'PL_indexedDB',
            support: ts.indexedDB
        },
        {
            labelText: 'SQLite Plugin',
            linkURL: 'PL_PGSQLite',
            support: ts.sqlitePlugin
        },
        {
            labelText: 'File API',
            linkURL: 'PL_fileAPI',
            support: ts.fileAPI_fullSupport
        }
    ];

    $scope.sidebar_demonstration = [
        {
            labelText: 'SessionStorage',
            linkURL: 'DE_sessionStorage',
            support: ts.sessionStorage
        },
        {
            labelText: 'LocalStorage',
            linkURL: 'DE_localStorage',
            support: ts.localStorage
        },
        {
            labelText: 'WebSQL',
            linkURL: 'DE_webSql',
            support: ts.webSQL
        },
        {
            labelText: 'IndexedDB',
            linkURL: 'DE_indexedDB',
            support: ts.indexedDB
        },
        {
            labelText: 'SQLite Plugin',
            linkURL: 'DE_PGSQLite',
            support: ts.sqlitePlugin
        },
        {
            labelText: 'File API',
            linkURL: 'DE_PG_fileAPI',
            support: ts.fileAPI_fullSupport
        }
    ];

});