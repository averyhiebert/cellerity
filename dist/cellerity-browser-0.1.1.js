(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cellerity = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Typedefs for the auto-generated docs (Also useful for developers!) =========

/**
 * A function that determines the state of a cell based on the state of its
 * neighbours.  The Moore neighbourhood (8 surrounding cells) is used, but
 * obviously you could ignore some cells if you only care about the Von Neumann
 * neighbourhood.  Neighbourhoods of a greater radius are not currently supported.
 *
 * The additional "row" and "column" params can be used to make your rule's behaviour
 * vary by location, or allow you to, for example, call some sort of draw function
 * based on the location and value of each cell as you update it.
 * 
 * IMPORTANT NOTE: If the contents of the cells in your automaton are objects or
 * arrays, you should try not to modify them in your function, as they will also
 * be modified in the array currently being used to create the new generation. This
 * is done due to performance constraints.
 *
 * If you don't modify the state of any objects, and always return an either
 * unchanged or brand new object from this update function, you should be fine.
 * Anything else could result in unpredictable behaviour.
 *
 * @callback updateFunction
 * @param neighbourhood The neighbourhood of the cell, expressed as a 3x3 array.
 *   Note that the centre cell, the cell whose value is to be determined,
 *   is equal to neighbourhood[1][1].
 *   Elements can be of any type, but if using objects or arrays do not modify
 *   their state.
 * @param {number} row The cell's row index.  Feel free to ignore this.
 * @param {number} col The cell's column index.  Feel free to ignore this.
 * @return The new value for the cell in question.  This probably should have the same
 *   type as the contents of neighbourhood.
 */

/** A function that initializes a cell on the grid based on 
 * its row and column value.
 * This could be used for a typical random initialization, or something more exotic
 * (e.g. stripes or a checkerboard pattern).
 *
 * @callback initializerFunction
 * @param {number} row The row of the cell to be initialized.
 * @param {number} col The column of the cell to be initialized.
 * @return The intended initial value for the cell.  The type can be whatever you want.
 */

/** A ruleset for a cellular automaton.  If a single updateFunction is given, that
 * function will be applied as a rule.
 * If a list of updateFunctions are given, the overall rule will be the composition
 * of functions, with the first function in the list being applied first, and so on.
 *
 * @typedef {updateFunction | updateFunction[]} ruleset
 */


// Start of actual code =======================================================

/**
 * Class representing a cellular automaton.
 * @memberof module:cellerity
 */
class Automaton{
    /** Create an automaton instance.
     *
     * @param ruleset {ruleset} The rule 
     *   that guides the automaton's evolution
     * @param {number} [rows=20] The number of rows of cells to use.
     * @param {number} [cols=20] The number of columns of cells to use.
     */
    constructor(ruleset,rows,cols){
        this.ruleset = ruleset;

        /** @private */
        this.rows = rows || 20;
        /** @private */
        this.cols = cols || 20;

        /** The main data array.   
        *
        * Note that the convention used here
        * (and elsewhere in this package) is that data[row][col] corresponds
        * to the row-th cell down and the col-th cell to the right, indexed
        * from zero (as one would normally expect).*/
        this.data = get2DArray(this.rows,this.cols);

        /** 
         * The function used to initialize the contents of the data array.
         * Default: Initialize all cells to 0.
         * @private */
        this.initializer = (x => 0); 

        /** 
         * The edge mode, one of "toroid", "cylinder", or "freeze"
         *@private */
        this.edgeMode = "toroid";

        /**
         * A function to execute after each "step"
         * @private */
        this.postStep = function(){};

        //Set the grid to initial conditions
        this.reset();
    }//constructor

    /** Change the automaton's ruleset.
     * @param {ruleset} ruleset The new update function(s) 
     *   for the automaton.*/
    setRuleset(ruleset){
        this.ruleset = ruleset;
    }//setRuleset

    /** Change the automaton's dimensions.
     * This will reset the automaton's state to conform to the chosen
     * dimensions, using the automaton's current initializer function.
     * @param {number} rows The new number of rows.
     * @param {number} cols The new number of columns.
     */
    setDimensions(rows,cols){
        this.rows = rows;
        this.cols = cols;
        this.reset();
    }//setDimensions

    /** Change the function used to initialize the automaton's state,
     * and then reset the automaton to the new initial conditions.
     *
     * If a 2D array is provided, the automaton will be initialized
     * so as to match the given array as closely as possible, causing
     * the provided array to repeat in a tiled fashion if it is not
     * large enough to fully cover the automaton's data grid.
     *
     * @param {initializerFunction | Array[]} initial
     *   Either an initializer function, or a 2D array of cell values, to
     *   use to initialize the automaton's state when resetting.
     */
    setInitializer(initial){
        if(typeof initial == "function"){
            this.initializer = initial;
        }else{
            //Copy initializer so that it doesn't change if the
            // passed array changes.
            this.initializer = Automaton.constantInitializer(initial);
        }
        this.reset();
    }//setInitializer

    /** Set the automaton's edge behaviour.
     * If "toroid", the neighbourhood of cells near the edge of the
     * grid will "wrap around" horizontally and vertically.
     *
     * If "cylinder", the neighbourhood will wrap horizontally only,
     * and cells in the top and bottom row will never change.
     *
     * If "freeze", cells on the edge of the grid will never change.
     *
     * @param {string} edgeMode The edge mode, one of "toroid",
     *   "cylinder", "freeze".
     */
    setEdgeMode(edgeMode){
        this.edgeMode = edgeMode;
    }//setEdgeMode

    /** Set a function to be executed after each "step".
     * This could be useful for integrating with other functionality
     * (e.g. image rendering or mouse interactivity), or adding
     * internal functionality (e.g. tracking # of living cells, entropy, etc.)
     *
     * @param {function} postStep A function to be executed after
     *  each generation.
     */
    setPostStep(postStep){
        this.postStep = postStep;
    }//setPostStep

    /** Add a function to be executed after a cell is updated.
     * This can be used to speed up tasks such as image rendering, 
     * since it saves you having to iterate over the array more
     * than once for each frame.
     *
     * @param {function} postUpdate The function to run after each
     *   cell is updated.  Should take three params: cellValue, rowIndex,
     *   and colIndex.
     */
    addPostUpdate(postUpdate){
        if(typeof this.ruleset == "function"){
            var ruleset = this.ruleset;
            var newRule = function(neighbourhood,row,col){
                var newValue = ruleset(neighbourhood,row,col);
                postUpdate(newValue,row,col);
                return newValue;
            }
            this.ruleset = newRule;
        }else{
            //We currently have multiple update rules composed.
            //Add the postupdate to the last rule in the list.
            var lastRule = this.ruleset[this.ruleset.length - 1];
            var newRule = function(neighbourhood,row,col){
                var newValue = lastRule(neighbourhood,row,col);
                postUpdate(newValue,row,col);
                return newValue;
            }
            this.ruleset = this.ruleset.slice(0,this.ruleset.length - 1);
            this.ruleset.push(newRule);
        }
    }//addPostUpdate

    /** Set the automaton's data to initial conditions */
    reset(){
        //Call the initializer on each item of data
        this.data = get2DArray(this.rows,this.cols);
        for (var row = 0; row < this.data.length; row ++){
            for (var col = 0; col < this.data[row].length; col ++){
                this.data[row][col] = this.initializer(row,col);
            }
        }
    }//reset

    /** Run one iteration of the automaton's evolution, using the
     * function passed in.  This should not be used externally, only
     * used by the public step function.
     *
     * @param {updateFunction} update The function to apply.
     * @private
     */
    apply(update){
        var oldArray = []
        for (var i = 0; i < this.rows; i++){
            oldArray[i] = this.data[i].slice();
        }

        //Decide what bounds to use, based on edge behaviour
        var startRow = 1;
        var endRow = this.rows - 1;
        if(this.edgeMode == "toroid"){
            startRow = 0;
            endRow = this.rows;
        }

        //Update main body of table:
        for (var i = startRow; i < endRow; i++){
            var topArr = oldArray[(i-1 + this.rows) % this.rows];
            var midArr = oldArray[i];
            var bottomArr = oldArray[(i+1) % this.rows];
            for (var j = 1; j < this.cols - 1; j++){
                //Update according to rule function.

                // (This is faster than nested for loops)
                this.data[i][j] = update([
                    topArr.slice(j-1,j+2),
                    midArr.slice(j-1,j+2),
                    bottomArr.slice(j-1,j+2)
                ],i,j);
            }// for each cell in row
        }// for each row

        //Update left & right column if necessary
        if (this.edgeMode != "freeze"){
            for(var i = startRow; i < endRow; i ++){
                // This only runs O(n) times per step, not O(n^2) like above, 
                // so I didn't bother with optimization.
                var neighbourhood = [[0,0,0],[0,0,0],[0,0,0]];
                var neighbourhood2 = [[0,0,0],[0,0,0],[0,0,0]]; //sometimes redundant
                for(var m = 0; m < 3; m++){
                    for(var n = 0; n < 3; n++){
                        var row = (i + m - 1 + this.rows) % this.rows;
                        var col = (n - 1 + this.cols) % this.cols;
                        neighbourhood[m][n] = oldArray[row][col];
                        
                        //Update right column, too (rarely unnecessary)
                        col = (this.cols + n - 2) % this.cols;
                        neighbourhood2[m][n] = oldArray[row][col];
                    }//inner for
                }// done building neighbourhood
                this.data[i][0] = update(neighbourhood,i,0);
                //Second update will be redundant if there is only 1 column
                this.data[i][this.cols - 1] = update(neighbourhood2,i,this.cols - 1);
            }// for each row
        }// left & right column
    }//apply

    /** Perform one or more iterations of evolution according to 
     * the automaton's rule.
     *
     * @param {number} [n=1] The number of iterations to perform
     */
    step(n){
        n = n || 1;
        if((typeof this.ruleset) == "function"){
            for(var i = 0; i < n; i++){
                this.apply(this.ruleset);
                this.postStep();
            }
        }else{
            //Compose functions, in order.
            for(var i = 0; i < n; i++){
                var that = this;
                this.ruleset.forEach(function(updateFunction){
                    that.apply(updateFunction)
                });
                this.postStep();
            }
        }
    }//step

    /** Get a human-friendly string representation of the current
     * state of the automaton.  Note that the convention used here
     * (and elsewhere in this package) is that data[row][col] corresponds
     * to the row-th cell down and the col-th cell to the right, indexed
     * from zero (as one would normally expect).
     *
     * @param {function} [map] A function to apply to each cell value, 
     *   returning the string to be used to represent the cell.
     * @return {string} The string representation of the current state of
     *   the automaton.
     */
    prettyPrint(map){
        var result = "";
        this.data.forEach(function(row){
            row.forEach(function(cell){
                if(map){
                    result += map(cell);
                }else{
                    result += cell;
                }
            }); // for each cell in row
            result += "\n";
        });// for each row

        //Remove last character, which should be a \n
        result = result.slice(0,result.length - 1);
        return result;
    }//prettyPrint

    /** Return an initializer that initializes the array to match
     * a specified constant array.  The array will be assumed to
     * "wrap around" in a toroidal, "tiled" fashion.
     *
     * @private
     * @param array The array to initialize to.  Should have at least
     *   the dimensions of the automaton.
     * @return {initializerFunction} An initializer function to use
     *   in the creation of an automaton.
     */
    static constantInitializer(arr){
        //Deep copy the array first
        var copy = [];
        for (var i = 0; i < arr.length; i++){
            copy[i] = arr[i].slice();
        }
        return function(row,col){
            return copy[row % copy.length][col % copy[0].length];
        }
    }//constantInitializer
}//Automaton

/** Get a 2D array of zeros.
 *
 * @private
 * @param cols {number} The number of columns desired
 * @param rows {number} The number of rows desired
 * @return A 2D array of zeros
 */
function get2DArray(rows,cols){
    var a = (new Array(rows)).fill(null);
    for (var i = 0; i < a.length; i++){
        a[i] = new Array(cols).fill(0);
    }
    return a;
}// get2DArray

module.exports = Automaton;

},{}],2:[function(require,module,exports){
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

},{"./automaton.js":1,"./subclasses/lifelike.js":3}],3:[function(require,module,exports){
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

},{"../automaton.js":1}]},{},[2])(2)
});