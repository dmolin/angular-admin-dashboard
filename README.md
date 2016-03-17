# Angular generic Admin Dashboard

A very basic project that I use as a generic template when building Admin/Backoffice applications.

![Image](/assets/edit.png?raw=true)

### Tech Stack ###
- Grunt
- Angular 1.3.x
- Angular UI with Material Design
- Angular UI.Router
- NodeJS Express
- Amazon S3 integration (document storage and retrieval)
- MongoDB with Mongoose

### Prerequisites ###

- Node and npm
- MongoDB
- Grunt

### Setup ###

- install MongoDB
- run `npm install`
- run `grunt` to compile the project and run the unit tests
- run `npm start` to start the server

The compilation step will generate :
- the file 'dist/js/templates.js', with the compiled Angular template code.
- the file 'dist/css/main.css', containing all the combined CSS files.
- all the assets and compacted JS files will be automatically copied over into 'dist/'

### Screenshots ###

Projects list

![Image](/assets/list.png?raw=true)

Project creation

![Image](/assets/create.png?raw=true)

Project editing

![Image](/assets/edit.png?raw=true)