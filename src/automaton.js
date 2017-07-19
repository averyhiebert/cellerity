"use strict";

/**
 * @typedef {Object} automatonOptions
 * @property {function | function[]} rule The rule governing the automaton's evolution
 * @property {number} [rows=20] The number of rows to use
 * @property {number} [cols=20] The number of columns to use
 * @property {function} [initializer] The function to use to initialize cells
 *   (defaults to setting all cells to 0)
 * @property {string} [edgeMode="wrap"] The edge mode to use, either "wrap" or "freeze"
 */

/**
 * Class representing a cellular automaton.
 */
class Automaton{
    /** Create an automaton instance.
     * 
     * @param options {automatonOptions} The options to use when 
     *   creating the automaton
     */
    constructor(options){
        /** @private */
        this.rows = options.rows || 20;
        /** @private */
        this.cols = options.cols || 20;

        /** The main data array */
        this.data = get2DArray(this.rows,this.cols);

        /** @private */
        this.initializer = options.initializer || (x => 0); 
        /** @private */
        this.rule = options.rule;
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
     * @param {function} ruleFunc The function to apply.
     * @private
     */
    apply(ruleFunc){
        var newArray = get2DArray(this.rows,this.cols);

        for (var i = 0; i < this.rows; i++){
            for (var j = 0; j < this.cols; j++){
                if(this.edgeMode == "freeze"){
                    //don't update edge cells
                    if(i == 0 || i == this.rows - 1 
                        || j == 0 || j == this.cols - 1){
                        continue;
                    }
                }// if in freeze mode

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
                newArray[i][j] = ruleFunc(neighbourhood);
            }// for each cell in row
        }// for each row

        //Overwrite the current state to match
        this.data = newArray;
    }//apply

    /** Perform one "step" of evolution according to the automaton's rule.
     */
    step(){
        this.apply(this.rule);
    }

    /** Get a human-friendly string representation of the current
     *   state of the automaton.
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
