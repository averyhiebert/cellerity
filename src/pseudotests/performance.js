var cellulite = require("../main.js");
var Automaton = cellulite.Automaton;

//Test generations-per-second on a standard data set.

// Use Game of Life rule (arguably the most well-known cellular automaton)
function lifeRule(n){
    var count = n[0][0] + n[0][1] + n[0][2] + n[1][0] +
                n[1][2] + n[2][0] + n[2][1] + n[2][2];
    if(n[1][1]){
        //Implemented weird to reflect the format of a more generalized rule
        return ([2,3].indexOf(count) > -1);
    }else{
        return ([3].indexOf(count) > -1);
    }
}

// Standard test data set: the R-pentomino (lasts over 1000 generations).
// We'll plant it in the top left corner of a grid using toroidal wrapping.
function rpent(row,column){
    var coords = "" + row + "," + column;
    switch (coords){
        case "0,0":
        case "0,1":
        case "1,1":
        case "1,2":
        case "2,1":
            return 1;
            break;
        default:
            return 0;
    }
}

//Start the test
//Smaller grid, many generations:
var aut = new Automaton(lifeRule,{
    rows:100,
    cols:100,
    initializer:rpent
});

var start = new Date();
aut.step(1000);
var time = new Date() - start;

console.log("100x100 grid, 1000 generations:");
console.log("" + time + " ms, average " + (1000/(time/1000.0)) + " fps");

//Large grid:
var aut = new Automaton(lifeRule,{
    rows:1000,
    cols:1000,
    initializer:rpent
});

var start = new Date();
aut.step(10);
var time = new Date() - start;
console.log("1000x1000 grid, 10 generations:");
console.log("" + time + " ms, average " + (10/(time/1000.0)) + " fps");
