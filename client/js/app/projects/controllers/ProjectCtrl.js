angular.module('app.projects')
.controller('ProjectCtrl', [
  '$scope', 'ProjectService', '$state', '$stateParams', '$q', '$sce', 'Upload', '$timeout',
function($scope, ProjectService, $state, $stateParams, $q, $sce, Upload, $timeout) {
  var ctrl = this;

  /*-------------------------
   * Controller logic
   *-------------------------*/
  $scope.data = {
    id: $stateParams.id,
    project: null
  };

  //binary attach
  $scope.data.contract = null;

  //load the project
  $scope.data.isLoading = true;
  ProjectService.findById($scope.data.id)
    .then( function(project){
      console.log("done. result", project);
      if(!project) {
        $scope.data.noResult = true;
      } else {
        $scope.data.project = project;
        $scope.data.contract = project.contract;
        ctrl.watchForModelChanges();
        ctrl.watchForAttachmentChanges();
      }
    })
    .catch(function error(result) {
      console.log("error loading project");
    })
    .finally(function() {
      $scope.data.isLoading = false;
    });

  /*-------------------------
   * Scope functions
   *-------------------------*/
  $scope.save = function() {
    console.log("saving model", $scope.data.project);
    ProjectService.update($scope.data.project)
      .then(function(result) {
        console.log("document saved!");
      })
      .catch(function error(result){
        console.log("error saving document", result);
      });
  };

  $scope.upload = function(property, files) {
    if(files.length === 0) return;

    var file = files[0];
    //call UploadService !
    Upload.upload({
      url: '/project/' + $scope.data.project._id + '/upload',
      file: file,
      fileFormDataName: property
    }).success(function (data, status, headers, config) {
      $timeout(function() {
        $scope.data[property] = data[property];
        //$scope[property].url += '?tstamp=' + Date.now(); //cachebusted version

        //update document
        $scope.data.project[property] = data[property];
      });
    });
  };

  $scope.getUrl = function(property) {
    return _.get($scope.data[property], 'url', null) || _.get($scope.data.project, property + '.url', null) || "";
  };

  $scope.removeAttachment = function($event, property) {
    console.log("removing attachment ", property);
    ProjectService.deleteAttachment($scope.data.project._id, property)
      .then(function(result) {
        console.log("attachment removed");
        $scope.data[property] = null;
        $scope.data.project[property] = {};
      })
      .catch(function error(result) {
        console.log("error removing attachment", result);
      });
  };

  /*-------------------------
   * Private functions
   *-------------------------*/
  this.watchForModelChanges = function() {
    $scope.$watch(function(){ return $scope.data.project; }, function(val, oVal, scope) {
      if(!val || !oVal) return;
      var newVal = _.omit(val, 'contract');
      var oldVal = _.omit(oVal, 'contract');
      if(_.isEqual(newVal, oldVal)) return;
      scope.save();
    }, true);
  };

  this.watchForAttachmentChanges = function() {
    _.each(['contract'], function(o) {
      $scope.$watch('data.' + o, function(val) {
        if(!val || !val.length) return;
        $scope.upload(o, $scope.data[o]);
      });
    });
  };
}]);