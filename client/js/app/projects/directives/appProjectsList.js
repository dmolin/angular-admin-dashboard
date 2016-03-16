angular.module('app.projects')
.directive('appProjectsList', [
    '$state','$mdDialog', '$q', 'ProjectService',
function($state, $mdDialog, $q, ProjectService) {
  return {
    restrict: 'E',
    scope:{
      data: "="
    },
    templateUrl: "projects/directives/app-projects-list.html",
    link: function(scope, element, attrs) {
      scope.edit = function(item) {
        //navigate to edit state
        $state.go('project', {id: item._id});
      };

      scope.delete = function(ev, item) {
        //ask for confirmation before deleting the project
        var confirm = $mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Confirmation required for Project deletion')
          .content('Deleting a Project is an irreversible operation. Please confirm that you really want to proceed with its removal.')
          .ariaLabel('Confirm deletion')
          .ok('Delete')
          .cancel('Go back')
          .targetEvent(ev);
        $mdDialog.show(confirm).then(function proceed() {
          ProjectService.delete(item._id)
            .then(function() {
              console.log("record removed");
              scope.data.splice(scope.data.indexOf(item), 1);
            })
            .catch(function error() {
              console.log("error removing project");
            });

        }, function cancel() {
            console.log("you made up your mind, eh?");
        });
      };
    }
  };
}]);