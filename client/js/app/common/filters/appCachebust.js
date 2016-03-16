angular.module('app.common')
.filter('appCachebust', function() {
    return function(input) {

        return input + "?" + Date.now();
    };
});
