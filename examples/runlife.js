//This file demonstrates the use of the LifelikeAutomaton class.

var cellerity = require("../src/main.js");
// Under normal circumstances, use the following instead:
//var cellerity = require("cellerity");

//Create a basic automaton using the rule for Conway's Game of Life
var life = new cellerity.LifelikeAutomaton("3/23",{
    rows:23, //These dimensions fit a "typical" console
    cols:40,
    initializer:function(){
        //Randomly initialize each cell as true or false
        // (i.e. "alive" or "dead") with equal probability.
        return Math.random() > 0.5;
    },
    edgeMode:"toroid" //Wrap edges horizontally and vertically.
});

//Print a frame every 100 ms until the user stops the program
function printSteps(){
    life.step(); //Perform one iteration of the automaton's evolution
    console.log(life.prettyPrint()); //Print data in readable format
    setTimeout(printSteps,100);
}

printSteps();
