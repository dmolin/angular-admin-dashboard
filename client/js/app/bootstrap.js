(function() {

var app = angular.module('app', ['ui.router', 'ui.gravatar', 'ngMaterial', 'ngAnimate', 'app.common', 'app.projects', 'underscore']);

app.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, gravatarServiceProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red')
        .warnPalette('red');

    gravatarServiceProvider.defaults = {
        size: 40,
        "default": "mm"
    };

    $urlRouterProvider.otherwise('/projects');

    $stateProvider
        //Projects state
        .state('projects', {
            url: '/projects',
            templateUrl: 'projects/controllers/projects.list.html',
            controller: 'ProjectsListCtrl'
        })
        .state('project', {
            url: '/project/:id/edit',
            templateUrl: 'projects/controllers/project.html',
            controller: 'ProjectCtrl'
        });
});

}());
