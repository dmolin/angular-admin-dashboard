angular.module('app.projects')
.factory('ProjectService', [ '$http', '$q', function($http, $q) {
  return {
    getAll: _getAll,
    create: _create,
    update: _update,
    delete: _delete,
    findById: _findById
  };

  function _getAll() {
    var deferred = $q.defer();

    $http({
        method: 'get',
        url: '/api/projects'
      })
      .success( function(response) {
        deferred.resolve(response);
      })
      .error( function(data) {
        deferred.reject(_.extend({status: 'failure'}, data));
      });

    return deferred.promise;
  }

  function _findById(id) {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: '/api/project/' + id
    })
    .success(function(response) {
      deferred.resolve(response);
    })
    .error(function(response) {
      deferred.reject(response);
    });

    return deferred.promise;
  }

  function _create(model) {
    var deferred = $q.defer();

    $http({
      method: 'POST',
      url: '/api/projects',
      data: model
    })
    .success(function(response) {
      deferred.resolve(response);
    })
    .error(function(response) {
      deferred.reject(response);
    });

    return deferred.promise;
  }

  function _update(model) {
    var deferred = $q.defer();

    $http({
      method: 'PUT',
      url: '/api/project/' + model._id,
      data: model
    })
    .success(function(response) {
      deferred.resolve(response);
    })
    .error(function(response) {
      deferred.reject(response);
    });
    return deferred.promise;
  }

  function _delete(id) {
    var deferred = $q.defer();

    $http({
      method: 'DELETE',
      url: '/api/project/' + id
    })
    .success(function(response) {
      deferred.resolve(response);
    })
    .error(function(response) {
      deferred.reject(response);
    });
    return deferred.promise;
  }

}]);