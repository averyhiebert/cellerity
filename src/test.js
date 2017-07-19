var cellulite = require("./main.js");

//Randomize the state of the automaton
function rand(){
    return Math.random() > 0.5;
}

//Simple settings for displaying boolean data
function checkers(cell){
    return (cell? "[]" : "  ");
}

//Evaluate a step of the Game of Life
// (n = neighbourhood as linear array, read by rows)
function lifeRule(n){
    var count = n.reduce(function(sum,value){
        return sum + (value? 1 : 0)
    },0);
    if(n[4]){
        count = count - 1;
        return (count == 2 || count == 3);
    }else{
        return (count == 3);
    }
}//lifeRule

//Create a basic automaton and view it
var aut = new cellulite.Automaton({
    rows:40,
    cols:40,
    initializer:rand,
    rule:lifeRule
});

function printStep(){
    aut.step();
    console.log(aut.prettyPrint(checkers));
    setTimeout(printStep,200);
}

printStep();


