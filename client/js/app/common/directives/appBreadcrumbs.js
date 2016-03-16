(function appToolbarIIFE(){

angular.module('app.common')
.directive('appBreadcrumbs', ['$state', function($state){
    return {
        restrict: 'E',
        templateUrl: 'common/directives/app-breadcrumbs.html',
        scope:{},
        link: function(scope, element, attrs) {
            scope.$state = $state;
            scope.links = [];

            scope.$watch('$state.current', function(val) {
                scope.links = _buildLinks(scope.$state);
            });
        }
    };

    function _buildLinks(state) {
        var links = [
            {state: "projects", label:"Projects list"},
            {state: "project", label:"Project editing"}
        ];

        var last = false; //will be set to true to flag the last visible link
        _.each(links, function(link) {
            if(!last) {
                link.visible = true;
            }
            if(state.includes(link.state)) {
                last = true; //from here onward, the links must be invisible
            }
        });

        return links;
    }

}]);

}());