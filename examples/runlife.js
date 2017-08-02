//This file demonstrates the use of the LifelikeAutomaton class.

var cellerity = require("../src/main.js");
// Under normal circumstances, use the following instead:
//var cellerity = require("cellerity");

//Set the rule to use based on first command line argument.
var rule = "3/23"; // Use Conway's Game of Life by default
if(process.argv.length > 2){
    rule = process.argv[2]; //Take first argument as rule
}

//Create a basic automaton using the chosen rule
var life = new cellerity.LifelikeAutomaton(rule,23,40);

// Set to randomly initialize each cell as true or false
// (i.e. "alive" or "dead") with equal probability.
life.setInitializer(function(){
    return Math.random() > 0.5;
});

//Wrap edges horizontally and vertically (default)
life.setEdgeMode("toroid"); 

//Print a frame every 100 ms until the user stops the program
function printSteps(){
    life.step(); //Perform one iteration of the automaton's evolution
    console.log(life.prettyPrint()); //Print data in readable format
    setTimeout(printSteps,100);
}

printSteps();
