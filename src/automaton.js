"use strict";

// Typedefs for the auto-generated docs (Also useful for developers!) =========
/** @lends module:cellulite */

/**
 * A function that determines the state of a cell based on the state of its
 * neighbours, and (optionally) on the coordinates of the cell.
 *
 * The intended use case of the coordinate params is to allow for more
 * complicated artwork or simulations that are not purely determined by initial
 * conditions.  If you don't want to do this, just ignore 'em.
 *
 * @callback updateFunction
 * @param neighbourhood The neighbourhood of the cell, expressed as a 1D
 *   array.  The cells' values are read by rows, 
 *   so [[1,2,3],[4,5,6],[7,8,9]] is expressed as [1,2,3,4,5,6,7,8,9].
 *   Note that the centre cell, the cell whose value is to be determined,
 *   is equal to neighbourhood[4].
 *   Note also that the elements don't necessarily need to be of type number.
 * @param {number} row The row of the cell whose state is to be determined.
 * @param {number} col The column of the cell whose state is to be determined.
 * @return The new value for the cell in question.  This probably should have the same
 *   type as the contents of neighbourhood.
 */

 /** A function that initializes a cell on the grid based on its row and column value.
  * This could be used for a typical random initialization, or something more exotic
  * (e.g. stripes or a checkerboard pattern), or could easily be used to initialize the
  * contents of the automaton so that they match a predefined array of the correct
  * dimensions.
  *
  * @callback initializerFunction
  * @param {number} row The row of the cell to be initialized.
  * @param {number} col The column of the cell to be initialized.
  * @return The intended initial value for the cell.  Note that this does not need
  *   to be a number!
  */

/** A ruleset for a cellular automaton.  If a single updateFunction is given, that
 * function will be applied as a rule.
 * If a list of updateFunctions are given, the overall rule will be the composition
 * of functions, with the first function in the list being applied first, and so on.
 *
 * @typedef {updateFunction | updateFunction[]} ruleset
 */

/**
 * An object representing a set of options for a cellular automaton.
 * @typedef {Object} automatonOptions
 * @property {number} [rows=20] The number of rows to use
 * @property {number} [cols=20] The number of columns to use
 * @property {initializerFunction} [initializer] The function to use to initialize cells
 *   (defaults to setting all cells to 0)
 * @property {string} [edgeMode="toroid"] The edge mode to use, 
 *   one of ("toroid", "freeze","cylinder")
 */


// Start of actual code =======================================================

/**
 * Class representing a cellular automaton.
 */
class Automaton{
    /** Create an automaton instance.
     *
     * @param ruleset {function|function[]} The rule 
     *   that guides the automaton's evolution
     * @param [options] {automatonOptions} Other options to use when 
     *   creating the automaton
     */
    constructor(ruleset,options){
        options = options || {};
        /** @private */
        this.ruleset = ruleset;

        /** @private */
        this.rows = options.rows || 20;
        /** @private */
        this.cols = options.cols || 20;

        /** The main data array */
        this.data = get2DArray(this.rows,this.cols);

        /** @private */
        this.initializer = options.initializer || (x => 0); 
        /** @private */
        this.edgeMode = options.edgeMode || "wrap";

        this.initialize();
    }//constructor

    /** (Re)set the automaton's data to initial conditions */
    initialize(){
        //Call the initializer on each item of data
        for (var row = 0; row < this.data.length; row ++){
            for (var col = 0; col < this.data[row].length; col ++){
                this.data[row][col] = this.initializer(row,col);
            }
        }
    }//initialize

    /** Run one iteration of the automaton's evolution, using the
     * function passed in.  This should not be used externally, only
     * used by the public step function.
     *
     * @param {updateFunction} update The function to apply.
     * @private
     */
    apply(update){
        var newArray = get2DArray(this.rows,this.cols);

        for (var i = 0; i < this.rows; i++){
            for (var j = 0; j < this.cols; j++){
                if(this.edgeMode == "freeze"){
                    //don't update edge cells
                    if(i == 0 || i == this.rows - 1 
                        || j == 0 || j == this.cols - 1){
                        continue;
                    }
                }else if(this.edgeMode == "cylinder"){
                    //Don't update top or bottom edges, but wrap sides.
                    if(i == 0 || i == this.rows - 1){
                        continue;
                    }
                }// Possible skip update based on edge rules

                //Update according to rule function.
                // Pass neighbourhood as linear array, read by rows.
                // (so current value of cell is neighbourhood[4] )
                var neighbourhood = [0,0,0,0,0,0,0,0,0];
                for(var m = 0; m < 3; m++){
                    for(var n = 0; n < 3; n++){
                        var row = (i + m - 1 + this.rows) % this.rows;
                        var col = (j + n - 1 + this.cols) % this.cols;
                        neighbourhood[m*3 + n] = this.data[row][col];
                    }
                }
                newArray[i][j] = update(neighbourhood);
            }// for each cell in row
        }// for each row

        //Overwrite the current state to match
        this.data = newArray;
    }//apply

    /** Perform one "step" of evolution according to the automaton's rule.
     */
    step(){
        if((typeof this.ruleset) == "function"){
            this.apply(this.ruleset);
        }else{
            //Compose functions, in order.
            this.ruleset.forEach(function(updateFunction){
                this.apply(updateFunction)
            });
        }
    }//step

    /** Get a human-friendly string representation of the current
     * state of the automaton.
     *
     * @param {function} [map] A function to apply to each cell value, 
     *   returning the string to be used to represent the cell.
     * @return {string} The string representation of the current state of
     *   the automaton.
     */
    prettyPrint(map){
        var result = "\n";
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
        return result;
    }//prettyPrint
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
}

module.exports = Automaton;
