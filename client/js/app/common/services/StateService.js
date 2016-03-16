angular.module('app.common')
.factory('StateService', [function() {
    var server = __SERVERENV || {};
    server.env = server.env || {};

    return {
        getUser: function() {
            return server.env.user || {name:'Unknown', email:''};
        }
    };
}]);