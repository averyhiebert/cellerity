"use strict";
var Automaton = require("../automaton.js");

/** A class representing a lifelike cellular automaton.
 *
 * When specifying an initializer function or an initial data array, 
 * "alive" cells should be represented as true, and "dead" cells as false.
 *
 * @memberof module:cellerity
 * @extends module:cellerity.Automaton
 * @inheritdoc
 */
class LifelikeAutomaton extends Automaton {
    /** Construct a lifelike cellular automaton.
     *
     * @param {string} ruleString A string describing the rule for the
     *   automaton, in born/survive format (e.g. "B3/S23" or just
     *   "3/23" for Conway's Game of Life).
     * @param {number} [rows=20] The number of rows to use.
     * @param {number} [cols=20] The number of columns to use.
     * @throws {string} An error message if the rule is not understood.
     */
    constructor(ruleString,rows,cols){
        var ruleset = LifelikeAutomaton.parseRule(ruleString);
        super(ruleset,rows,cols);
        this.setInitializer(x => false);
    }//constructor

    /** Change the automaton's ruleset.
     * @param {string | string[]} ruleset The rule or rules to use
     *   for the automaton, in "B/S" format (e.g. "B3/S23" or just 
     *   "3/23" for Conway's Game of Life).  If a list is provided, 
     *   the rules will be composed in order.
     * @throws {string} An error message if the rule is not valid.
     */
    setRuleset(ruleset){
        if(typeof ruleset == "string"){
            this.ruleset = LifelikeAutomaton.parseRule(ruleset);
        }else{
            var rules = [];
            ruleset.forEach(function(ruleString){
                rules.push(LifelikeAutomaton.parseRule(ruleString));
            });
            this.ruleset = rules;
        }
    }//setRuleset

    /** Parse a string describing an update rule into a function.
     *
     * @param {string} ruleString The rule to parse.
     * @return {updateFunction} The function resulting from parsing the rule.
     * @throws {string} An error message if the rule is not understood.
     * @private
     */
    static parseRule(ruleString){
        var re = /^B?(\d*)[^\d]S?(\d*)$/i;
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
