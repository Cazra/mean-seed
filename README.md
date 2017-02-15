# MEAN stack project structure with Grunt

This project demonstrates how to set up a grunt-driven project structure for
an MEAN stack projects. As its example, this project implements the Tour of Heroes
web application used in Angular 2's official tutorial, but with improved
structuring with subfolders and barrels following Angular 2's preferred
project structure.

The source files exist in a precompiled form: .ts files
for the javascript, .less files for the CSS, and .pug for the HTML.

The default grunt target compiles/transpiles the source files and puts the
results in a www/ directory for the public-facing web app. Any vendor files
are copied into www/lib.

The typings/ directory contains all the Typescript mappings required by
Angular 2 to transpile the ES6 code for itself and the web app project.

## Installing the project

Run the following commands from the project's root to install it.

1. ```npm install``` to install the project's dependencies.
2. ```npm run typings install``` to install Angular 2's Typescript typings.

## Building the project

There are two ways to build the project:

1. ```grunt``` to build the project without running it. This will compile the source and dump the output into the www/ directory.
2. ```npm start``` to build the project and then run a server on localhost:3000 hosting the built project in the www/ directory.

## Running the project

Running ```npm start``` will build and the run the project. (see above)
For the application to interact with Mongo data, you'll also need to make sure
that you have a ```mongod``` instance running.
