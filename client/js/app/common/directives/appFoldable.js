angular.module('app.common')
  .directive('appFoldable', function() {
    return {
      restrict: 'A',
      link: function(scope, element ,attrs) {
        var target = angular.element(attrs.foldableTarget||document.body);
        var iconEl;

        element.on('click', handleClick);

        scope.$on('$destroy', function() {
          element.off('click', handleClick);
        });

        target.addClass('app-foldable-target');

        //initial state is expanded, unless indicated
        var folded = attrs.folded === "true" || false;
        if(folded) {
          element.addClass('app-foldable__folded');
        }

        //add folding icon to the element
        //add icon
        iconEl = angular.element('<i class="app-foldable-icon fa ' + getIcon(folded) + '"></i>');
        element.append(iconEl);

        function getIcon(isFolded) {
          return (isFolded ? 'fa-plus' : 'fa-minus');
        }

        function updateIcon(isFolded) {
          //if(!iconEl) return;
          //remove class for the old state
          iconEl.removeClass(getIcon(!isFolded));
          iconEl.addClass(getIcon(isFolded));
        }

        function handleClick(e) {
          e.stopPropagation();
          e.preventDefault();

          element.toggleClass('app-foldable__folded');

          if( element.hasClass('app-foldable__folded') ) {
            target.slideUp();
            updateIcon(true);
          } else {
            target.slideDown();
            updateIcon(false);
          }

        }
      }
    };

  });
