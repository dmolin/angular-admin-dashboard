(function sbToolbarIIFE(){

angular.module('app.common')
.directive('appToolbar', ['$state', 'StateService', function($state, StateService){
  return {
    restrict: 'AE',
    templateUrl: 'common/directives/app-toolbar.html',
    scope:{},
    link: function(scope, element, attrs) {
      scope.$state = $state;
      scope.user = StateService.getUser();
    }
  };
}]);

}());