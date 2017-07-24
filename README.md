# Cellerity
## Extensible Cellular Automata
Cellerity provides general cellular automaton functionality 
for a variety of purposes.  In particular, it's 
meant to work with non-numeric cell values, and offers an Automaton 
class that can be extended to more specific types of automata 
(e.g. lifelike automata or elementary automata).

Currently, the module includes the general Automaton class, as well as
the LifelikeAutomaton subclass which makes it easy to simulate any
lifelike cellular automaton and serves an example of how to extend
the Automaton class.

## Installation
This is an npm package, so naturally it requires Node.js and npm.
Install those two things if you don't have them already.
Note that the package uses some language features that may not 
be supported in older versions of Node.

To install locally for use in you Node.js project, run 
`npm install cellerity`.

If you want to build the documentation, run tests, view examples, 
or modify the source for the project, clone this repository from 
GitHub and run `npm install` in the project's root directory to
install the dev dependencies.

## Usage
An example using the LifelikeAutomaton class to run Conway's Game of Life
in the console is provided.  You can also pass a rule in the "b/s" format
(i.e. "3/23" for Life) as the first argument to view an automaton other than
Life.  The script is located at `examples/runlife.js`. 

More usage examples will be provided eventually.  In the mean time, you can
view the API documentation to understand the usage of the Automaton
class.

## Documentation
Auto-generated documentation for the public API can be found in 
the `docs/htmlDocs` directory.

If you have cloned the repository and installed the dev dependencies, 
you can build the documentation by running `npm run documentation`.

## Tests
If you have cloned the repository and installed the dev dependencies, 
you can run unit tests and generate a code coverage report using `npm test`.

## License
This package was written by Avery Hiebert and released under the 
MIT license, as described in `LICENCE.txt`
