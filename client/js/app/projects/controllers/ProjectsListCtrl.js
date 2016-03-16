angular.module('app.projects')
.controller('ProjectsListCtrl', ['$scope', 'ProjectService', '$mdDialog', '$state',
function($scope, ProjectService, $mdDialog, $state) {
  var modalInstance;

  /*-------------------------
   * Controller logic
   *-------------------------*/
  $scope.data = {};
  $scope.data.isLoading = true;

  //retrieve the managed projects
  ProjectService.getAll()
    .then(function(data) {
      console.log("data", data);
      $scope.data.projects = data;
    })
    .catch(function(err) {
      console.log("error loading data from the server", err);
    })
    .finally(function() {
      $scope.data.isLoading = false;
    });

  /*-------------------------
   * Scope functions
   *-------------------------*/
  $scope.isEmpty = function() {
    return !$scope.data.projects || !$scope.data.projects.length;
  };

  $scope.requestProjectCreation = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'projects/controllers/create.modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      //focus must be given on complete
      onComplete: function(scope, element, options) {
        element.find('input:first').focus();
      },
      transformTemplate: function(template) {
        return '<div class="md-dialog-container app-dialog">' + template + '</div>';
      },
      locals: { project: {} }
    })
    .then($scope.createProject, function cancelled() {
      console.log("cancelled");
    });
  };

  $scope.createProject = function(model) {
      ProjectService.create(model)
        .then(function(response) {
          //redirect to project editing
          console.log("creaton successful. request project editing for project", response);
          $state.go('project', {id: response._id});
        });
  };

  /*-------------------------
   * Private functions
   *-------------------------*/
  function DialogController($scope, $mdDialog, project) {
    $scope.project = project || {};

    $scope.closeDialog = function() {
      $mdDialog.cancel($scope.project);
    };

    $scope.confirmDialog = function() {
      $mdDialog.hide($scope.project);
    };
  }
}]);