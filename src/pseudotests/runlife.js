var cellulite = require("../main.js");

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
    var count = 0;
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            count += n[i][j];
        }
    }

    if(n[1][1]){
        count = count - 1;
        return (count == 2 || count == 3);
    }else{
        return (count == 3);
    }
}//lifeRule

//Create a basic automaton and view it

var aut = new cellulite.Automaton(lifeRule,{
    //Dimensions work with a typically-sized console
    rows:23,
    cols:40,
    initializer:rand,
});

function printSteps(){
    aut.step();
    console.log(aut.prettyPrint(checkers));
    setTimeout(printSteps,100);
}

printSteps();


