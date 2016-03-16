describe("app.projects.ProjectService", function() {
    var subject, scope, httpBackend;

    beforeEach(function() {
        module("app");
        module("app.projects", function($provide){});

        inject(function($injector) {
            subject = $injector.get('ProjectService');
            httpBackend = $injector.get('$httpBackend');
        });
    });

    afterEach(function() {
        httpBackend.resetExpectations();
    });

    describe("getAll", function() {
        it("provides an endpoint for fetching all the projects", function() {
            expect(_.isFunction(subject.getAll)).toBe(true);
        });
        it("returns a promise that resolve with the list of projects", function(done) {
            httpBackend.whenGET("/api/projects")
                .respond([{name:'project1'}]);

            subject.getAll().then(function(data) {
                expect(data.length).toEqual(1);
                done();
            });
            httpBackend.flush();
        });

        it("returns a promise that reject with an error state in case of errors", function(done) {
            httpBackend.whenGET("/api/projects")
                .respond(500, {status: 'failure'});
            subject.getAll().catch(function(response) {
                expect(response.status).toBe('failure');
                done();
            });
            httpBackend.flush();
        });
    });

    describe("findById", function() {
        it("provide an endpoint for fetching a project by id", function() {
            expect(_.isFunction(subject.findById)).toBe(true);
        });
    });

    describe("create", function() {
        it("provides an endpoint for creating a new project", function() {
            expect(_.isFunction(subject.create)).toBe(true);
        });

        it("returns a promise that resolves with a new unique ID for the newly created project", function(done) {
            httpBackend.whenPOST("/api/projects")
                .respond(201, {id:'0001'}, {Location:'/api/project/0001'});

            var data = {name:"new project", clientName: "1"};
            subject.create(data).then(function(result) {
                expect(result.id).toBe('0001');
                done();
            });
            httpBackend.flush();
        });

        it("returns a promise that rejects with a 500 error status in case of server side errors", function(done) {
            httpBackend.whenPOST("/api/projects")
                .respond(500);

            var data = {name:"new project", clientName: "name"};
            subject.create(data).catch(function(result) {
                done();
            });
            httpBackend.flush();
        });

    });

    describe("update", function() {
        it("provide an endpoint for updating a project document", function() {
            expect(_.isFunction(subject.update)).toBe(true);
        });
    });

    describe("delete", function() {
        it("provide an endpoint for deleting a project document", function() {
            expect(_.isFunction(subject.delete)).toBe(true);
        });
    });
});