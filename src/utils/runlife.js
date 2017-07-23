var cellulite = require("../main.js");
//This file shows basic use of the LifelikeAutomaton class.

//Returns true or false with equal probability:
function rand(){
    return Math.random() > 0.5;
}

//Create a basic automaton using the rule for Conway's Game of Life
var life = new cellulite.LifelikeAutomaton("3/23",{
    rows:23, //These dimensions should fit a "typical" console
    cols:40,
    initializer:rand, //Randomly initialize each cell as alive or dead.
    edgeMode:"toroid" //Wrap edges horizontally and vertically.
});

//Print a frame every 100 ms until the user stops the program
function printSteps(){
    life.step(); //Perform one iteration of the automaton's evolution
    console.log(life.prettyPrint()); //Print data in readable format
    setTimeout(printSteps,100);
}

printSteps();
