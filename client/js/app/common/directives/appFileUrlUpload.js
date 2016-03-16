angular.module('app.common')
  .directive('appFileUrlUpload', ['$parse', 'underscore', 'UtilsService', function($parse, _, UtilsService) {
    return {
      restrict: 'E',
      scope:{
        model: "=",
        urlModel: "=",
        onRemove: "&",
        label: "@",
        accept: "@",
        name: "@",
        tip: "@",
        errorMessage: "@"
      },
      templateUrl: 'common/directives/app-file-url-upload.html',
      link: function(scope, element, attrs) {
        attrs.accept = attrs.accept || "image/*";

        scope.refModel = _.cloneDeep(scope.model);
        scope.loading = false;
        scope.invalidUrl = false;

        scope.onAttachmentRemove = function(e) {
          scope.loading = false;
          e.preventDefault();
          e.stopPropagation();
          scope.onRemove({$event:e});
        };

        scope.hasTip = function() { return scope.tip && scope.tip.length; };
        scope.isImage = function() { var matches = attrs.accept.match(/image\//); return matches && matches.length > 0; };
        scope.isImageVisible = function() {
          //var matches = scope.refModel ? scope.refModel.url.match(/(https?:\/\/.*\.(?:png|jpe?g))/i) : [];
          return scope.isImage() && (scope.urlModel || (scope.refModel && scope.refModel.url));
        };

        //only for image types
        scope.validateUrl = function(value) {
          if(_.isUndefined(value) || value === null || !value.trim().length) {
            scope.invalidUrl = false;
            return;
          }

          if(!scope.isImage) return true;

          var acceptedTypes = _.map(_.compact(attrs.accept.split(" ")), function(o) {
            var index = o.lastIndexOf('*');
            if(index > 0) {
              o = o.substring(0, index);
            }
            return o;
          });
          UtilsService.checkUrlForTypes(value, acceptedTypes)
            .then(function() {
              scope.invalidUrl = false;
            })
            .catch(function() {
              scope.invalidUrl = true;
            });
        };

        scope.popoverTemplate = "common/directives/app-image-upload-popover.html";
        scope.$watch('model', function(nv, ov) {
          if(nv && nv.length === 0) {
            //re-copy
            scope.model = _.cloneDeep(scope.refModel);
          }

          //if(nv && nv.length && !_.isEqual(nv,ov)) {
          if(nv && nv.length && !_.isEqual(nv,ov)) {
            //file selected, upload is starting...
            scope.loading = true;
          } else if(!nv){
            //we get here after we remove the attachment
            scope.loading = false;
            scope.refModel = null;
          }

          //after the file has been loaded. nv is no more an array, but an object structure
          if(nv && nv.url) {
            scope.loading = false;
            scope.urlModel = null;
            scope.refModel = _.cloneDeep(scope.model);
          }
        });

        if(scope.urlModel) {
          scope.validateUrl(scope.urlModel);
        }
      }
    };
  }]);
