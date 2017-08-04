# Cellerity
## Extensible Cellular Automata
*NOTE*: The public API is not yet stable (hence major version 0).

Cellerity provides general 
[cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton) 
tools.  In order to support a variety of uses, it's 
designed to work with non-numeric cell values, and offers an Automaton 
class that can be extended to more specific types of cellular automata 
(e.g. [lifelike cellular automata](https://en.wikipedia.org/wiki/Life-like_cellular_automaton) 
or [elementary cellular automata](https://en.wikipedia.org/wiki/Elementary_cellular_automaton)).

The primary focus of the module is the Automaton class, which supports
very general cellular automaton functionality.  Additionally, a more
concrete LifelikeAutomaton subclass makes it easy to simulate any
lifelike cellular automaton and serves an example of how to extend
the Automaton class.

## Installation
This is an npm package, so naturally it requires 
[Node.js](https://nodejs.org/en/download/) 
and [npm](https://www.npmjs.com/get-npm).
Install those if you don't have them already.

Note that the package uses some language features that may not 
be supported in old versions of Node.

To install locally for use in your Node.js project, run 
`npm install cellerity`.

If you want to build the documentation, run tests, view examples, 
or modify the source for the project, clone this repository from 
GitHub and run `npm install` in the project's root directory to
install the dev dependencies.

## Usage
An example using the LifelikeAutomaton class to run Conway's Game of Life
in the console is provided.  You can also pass a rule in the "B/S" format
(e.g. "B3/S23" for Life) as the first argument to view an automaton other than
Life.  The script is located at `examples/runlife.js`. 

More usage examples will be provided eventually.  In the mean time, you can
view the API documentation to understand the usage of the Automaton
class.

## Browser Support
If you have cloned the repository and installed the dev dependencies,
you can use `npm run build` to generate a browser-friendly version of the
module, located at `dist/cellerity-browser-<version>.js`.

Including this file in your html page should be equivelant 
to Node's `var cellerity = require("cellerity");`

Note: I have not yet tested a wide range of browsers, and the module does use
some ES6 functionality, so don't expect support across all browsers currently
in use.

## Documentation
Auto-generated documentation for the public API can be found in 
the `docs/htmlDocs` directory.

If you have cloned the repository and installed the dev dependencies, 
you can build the documentation by running `npm run documentation`.

## Tests
If you have cloned the repository and installed the dev dependencies, 
you can run unit tests and generate a code coverage report using `npm test`.

## Licence
This package was written by Avery Hiebert and released under the 
MIT license, as described in `LICENCE.txt`
