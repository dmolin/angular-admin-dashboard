angular.module('app.common')
  .factory('UtilsService', [ '$http', '$q', function($http, q) {

    return {
      checkUrlForTypes: checkUrlForTypes
    };

    function checkUrlForTypes(url, acceptedTypes) {
      var deferred = q.defer();

      $http({
        method: 'POST',
        url: '/api/utils/urlcheck',
        data: {
          url: url,
          acceptedTypes: acceptedTypes
        }
      })
        .then(function(response) {
          deferred.resolve(response.data);
        })
        .catch(function(response) {
          deferred.reject(response.data);
        });

      return deferred.promise;
    }
  }]);
