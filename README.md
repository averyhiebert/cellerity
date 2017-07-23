# Cellulite (General Purpose Cellular Automata)
Cellulite is intended to be a library providing generalized cellular 
automaton functionality for a variety of purposes.  In particular, it's 
meant to work with non-numeric cell values, and offers an Automaton 
class that can be extended to more restricted types of automata 
(e.g. lifelike automata or elementary automata).

## Installation
If you don't already have Node.js and npm installed, install them.
Then, clone the project, and run `npm install` in the project's root
directory to install dev dependencies.

The project uses some ES6 features that may not be supported in older
versions of Node.

## Usage
Usage examples will be provided eventually.  In the mean time, either
look at the unit tests, check out `src/pseudotests/runlife.js`, or
view the API documentation to understand the usage of the Automaton
class.

## Documentation
Documentation for the public API can be found in the `docs/htmlDocs` 
directory.

You can build the documentation by running `npm run documentation`.

## Tests
Run unit tests and generate a code coverage report using `npm test`.

## License
I'll probably release this under the LGPL at some point, but for now consider it copyrighted.
