/**
 * A module exposing a variety of functionality related to
 * simulating general-purpose cellular automata.
 * Includes the Automaton class, which allows the
 * creation of general-purpose cellular automata, as well
 * as some subclasses representing more specialized automata.
 *
 * @module cellerity
 */

exports.Automaton = require("./automaton.js"),
exports.LifelikeAutomaton = require("./subclasses/lifelike.js")
