describe("app.projects.ProjectsListCtrl", function() {
    var ctrl,
        scope,
        serviceData,
        q,
        MockSvc,
        createController;

    //mock the required services
    beforeEach(function() {
        serviceData = [];
        MockSvc = {};

        module("app");
        module("app.projects", function($provide) {
            $provide.value('ProjectService', MockSvc);
        });
        inject(function($q) {
            q = $q;
            MockSvc.getAll = function() {
                var defer = $q.defer();
                defer.resolve(serviceData);
                return defer.promise;
            }
        });
    });

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        createController = function(params) {
            return $controller('ProjectsListCtrl', _.extend({
                $scope: scope,
                ProjectService: MockSvc
            }, params||{}));
        };
        scope.$digest();
    }));

    afterEach(function() {
    });

    it('should be loading data when instanced', function() {
        var ctrl = createController();
        expect(scope.data.isLoading).toBe(true);
    });

    it("should be empty if no projects are available", function() {
        var ctrl = createController();
        expect(scope.isEmpty()).toBe(true);
    });

});