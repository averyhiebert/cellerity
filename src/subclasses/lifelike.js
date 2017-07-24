"use strict";
var Automaton = require("../automaton.js");

/** A class representing a lifelike cellular automaton.
 * @memberof module:cellerity
 * @extends module:cellerity.Automaton
 * @inheritdoc
 */
class LifelikeAutomaton extends Automaton {
    /** Construct a lifelike cellular automaton.  When specifying an
     * initializer function or an initial data array, "alive" cells
     * should be represented as true, and "dead" cells as false.
     *
     * @param {string} ruleString A string describing the rule for the
     *   automaton, in born/survive format (e.g. "3/23" for Conway's 
     *   Game of Life).
     * @param {automatonOptions} options The options to use for the automaton.
     * @throws {string} An error message if the rule is not understood.
     */
    constructor(ruleString,options){
        var ruleset = LifelikeAutomaton.parseRule(ruleString);
        super(ruleset,options);
    }//constructor

    /** Parse a string describing an update rule into a function.
     *
     * @param {string} ruleString The rule to parse.
     * @return {updateFunction} The function resulting from parsing the rule.
     * @throws {string} An error message if the rule is not understood.
     * @private
     */
    static parseRule(ruleString){
        var re = /^(\d*)[^\d](\d*)$/;
        var m = re.exec(ruleString);
        if(m){
            var born = [];
            var survive = [];
            m[1].split("").forEach((digit) => born.push(parseInt(digit)));
            m[2].split("").forEach((digit) => survive.push(parseInt(digit)));
            //Create rule (assuming true = alive)
            function rule(neighbourhood){
                var count = 0;
                for(var i = 0; i < 3; i++){
                    for(var j = 0; j < 3; j++){
                        count += (neighbourhood[i][j]?1:0);
                    }
                }
                if(neighbourhood[1][1]){
                    count--;
                    return (survive.indexOf(count) > -1);
                }else{
                    return (born.indexOf(count) > -1);
                }
            }//rule
            return rule;
        }else{
            //In future, check against known rule names.
            // For now, just throw error.
            throw "Rule '" + ruleString + "' not recognized.";
        }
    }//parseRule

    /** Get a nice string representation of the state of the automaton.
     * Same as {@link module:cellerity.Automaton#prettyPrint}, but with
     * a default map function that works well for lifelike automata.
     *
     * @param {function} [map] A function to apply to each cell value,
     *  returning the string to be used to represent the cell.
     * @return {string} A string representation of the automaton's state.
     */
    prettyPrint(map){
        if(!map){
            map = (cell) => (cell?"[]":"  ");
        }
        return super.prettyPrint(map);
    }
}//LifelikeAutomaton

module.exports = LifelikeAutomaton;
