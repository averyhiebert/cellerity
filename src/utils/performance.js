var cellulite = require("../main.js");
var Automaton = cellulite.Automaton;
var LifelikeAutomaton = cellulite.LifelikeAutomaton;

// Test generations-per-second on a standard data set =========================



//Test of a more complex rule - uses object-valued cells to track age.
function weirdRule(n){
    var count = 0;
    var cell = n[1][1];
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            count += (n[i][j].alive? 1 : 0);
        }
    }
    if(cell.alive){
        count--;
        if(count == 3 || count == 2){
            return {alive:true,age:cell.age + 1}
        }else{
            return {alive:false,age:0}
        }
    }else if (count == 3){
        return {alive:true, age:1}
    }else{
        return {alive:false, age:0}
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
            return true;
            break;
        default:
            return false;
    }
}

//Start the tests ============================================================
console.log("Starting Performance Test");

//Smaller grid, many generations:
var aut = new LifelikeAutomaton("3/23",{
    rows:100,
    cols:100,
    initializer:rpent
});

var start = new Date();
aut.step(1000);
var time = new Date() - start;

console.log("\n100x100 grid, 1000 generations:");
console.log("" + time + " ms, average " + (1000/(time/1000.0)) + " fps");

//Large grid:
var aut = new LifelikeAutomaton("3/23",{
    rows:1000,
    cols:1000,
    initializer:rpent
});

start = new Date();
aut.step(10);
time = new Date() - start;
console.log("\n1000x1000 grid, 10 generations:");
console.log("" + time + " ms, average " + (10/(time/1000.0)) + " fps");

//Small grid, more complex object-based rule
//(Using a random start this time, not that it matters, I think)
var aut = new Automaton(weirdRule,{
    rows:100,
    cols:100,
    initializer:function(){
        var alive = Math.random() > 0.5;
        return {alive:alive,age:(alive?1:0)};
    }
});

start = new Date();
aut.step(1000);
time = new Date() - start;
console.log("\nMore complex rule, 100x100 grid, 1000 generations:");
console.log("" + time + " ms, average " + (1000/(time/1000.0)) + " fps");
