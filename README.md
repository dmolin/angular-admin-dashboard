# Angular generic Admin Dashboard

A very basic project that I use as a generic template when building Admin/Backoffice applications.

![Image](/assets/edit.png?raw=true)

### Prerequisites ###

- Node and npm
- MongoDB
- Grunt

### Setup ###

- install MongoDB
- <pre>npm install</pre>
- <pre>grunt</pre>

The compilation step will generate :
- the file 'dist/js/templates.js', with the compiled Angular template code.
- the file 'dist/css/main.css', containing all the combined CSS files.
- all the assets and compacted JS files will be automatically copied over into 'dist/'

### Compiling/generating the code ###

Issue the following command to compile the code and generate the required artifacts for running the server.
<pre>
grunt
</pre>

This command will lint the files, generate the dependencies and run the Unit Tests.

### Screenshots ###

Projects list

![Image](/assets/list.png?raw=true)

Project creation

![Image](/assets/create.png?raw=true)

Project editing

![Image](/assets/edit.png?raw=true)