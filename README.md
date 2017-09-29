# MEAN stack project structure with Grunt

This project demonstrates how to set up a grunt-driven project structure for
an MEAN stack projects. As its example, this project implements the Tour of Heroes
web application used in Angular's official tutorial, but with improved
structuring with subfolders and barrels following Angular's preferred
project structure.

The source files exist in a precompiled form: .ts files
for the javascript, .less files for the CSS, and .pug for the HTML.

The default grunt target compiles/transpiles the source files and puts the
results in a www/ directory for the public-facing web app. Any vendor files
are copied into www/lib.

## Installing the project

Run ```npm install``` from the project's root to install it and its dependencies.

## Building the project

Run ```grunt``` from the project's root to build the project. This will compile the source and dump the output into the www/ directory.

## Running the project

Before running the project, make sure you have a ```mongod``` instance running to host the database.
Running ```npm run server``` will run the project at ```localhost:1337```.
