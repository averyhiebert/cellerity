"use strict";

var assert = require("assert");
var cellerity = require("../src/main.js");
var Automaton = cellerity.Automaton;
var LifelikeAutomaton = cellerity.LifelikeAutomaton;

describe("Automaton", function(){
    // Rule to use for testing (Conway's Game of Life)
    function lifeUpdateRule(n){
        //Note: n = neighbourhood, as a 2D array
        // (i.e. the cell being updated is n[1][1]
        //Assumes cells are either 1 or 0
        var sum = 0;
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                sum += n[i][j];
            }
        }

        if(n[1][1]){
            var survive = (sum - 1) == 2 || (sum - 1) == 3;
            return (survive?1:0);
        }else{
            return (sum == 3)?1:0;
        }
    }

    describe("#constructor()",function(){
        it("should initialize an automaton to default conditions", function(){
            var aut = new Automaton(() => 0);
            assert.equal(aut.data.length,20);
            assert.equal(aut.data[0].length,20);
            assert.equal(aut.data[0][0],0);
        });// default conditions

        it("should support alternate dimensions", function(){
            var aut = new Automaton(() => 0,{
                rows:3,
                cols:5
            });
            assert.equal(aut.data.length,3);
            assert.equal(aut.data[0].length,5);
        });// alternate dimensions

        it("should support an alternate initialization function",function(){
            var aut = new Automaton(() => 0,{
                initializer:function(row,col){
                    return [row,col,"test"];
                }
            });
            
            for (var i = 0; i < aut.data.length; i++){
                for (var j = 0; j < aut.data[0].length; j++){
                    assert.deepEqual(aut.data[i][j],[i,j,"test"]);
                }
            }//for each cell in data array
        });// alternate initialization

        it("should support initializing using a set array",function(){
            var startArray = [[1,2,3],[4,5,6],[7,8,9]];
            var aut = new Automaton(() => 0,{
                startData:startArray
            });
            assert.deepEqual(aut.data,startArray);
        });
    });// describe constructor

    describe("#setRuleset()",function(){
        it("should change the automaton's ruleset",function(){
            var aut = new Automaton(() => 0);
            aut.setRuleset(() => 37);
            aut.step();
            assert.equal(aut.data[1][1],37);
        });
    });

    describe("#step()",function(){
        it("should support a simple update rule",function(){
            var aut = new Automaton(n => n[1][1] + 1);
            var initial = aut.data[1][1];
            aut.step();
            assert.equal(aut.data[1][1],initial + 1);
            aut.step();
            assert.equal(aut.data[1][1],initial + 2);
            aut.step(5);
            assert.equal(aut.data[1][1],initial + 7);
        });// simple rule

        it("should successfully execute Conway's Game of Life", function(){
            var glider = [[0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,1,1,0,0,0],
                          [0,0,1,0,1,0,0],
                          [0,0,1,0,0,0,0],
                          [0,0,0,0,0,0,0]];
            var glider2 = [[0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,1,1,0,0,0,0],
                          [0,1,0,1,0,0,0],
                          [0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0]];
            var aut = new Automaton(lifeUpdateRule,{
                startData:glider
            });
            aut.step(4);
            assert.deepEqual(aut.data,glider2);
        });// Game of Life

        it("should support composition of rules",function(){
            var glider = [[0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,1,1,0],
                          [0,0,0,0,1,0,1],
                          [0,0,0,0,1,0,0]];
            var glider2 = [[0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,1,1,0,0],
                          [0,0,0,1,0,1,0],
                          [0,0,0,1,0,0,0],
                          [0,0,0,0,0,0,0]];
            var aut = new Automaton([lifeUpdateRule,lifeUpdateRule],{
                startData:glider
            });
            aut.step(2); //2 steps of rule composed with self = 4 normal steps
            assert.deepEqual(aut.data,glider2);
        });// composition of rules

        it("should use the 'toroid' edge mode by default",function(){
            var grid = [[1,0,1],
                        [0,0,0],
                        [0,0,1]]
            var grid2 = [[1,1,1],
                        [1,1,1],
                        [1,1,1]]
            var aut = new Automaton(lifeUpdateRule,{
                startData:grid
            });
            aut.step();
            assert.deepEqual(aut.data,grid2);
        });// 'toroid' setting

        it("should respect the 'cylinder' edge mode",function(){
            var grid = [[1,0,1],
                        [0,0,0],
                        [0,0,1]]
            var grid2 = [[1,0,1],
                        [1,1,1],
                        [0,0,1]]
            var aut = new Automaton(lifeUpdateRule,{
                startData:grid,
                edgeMode:"cylinder"
            });
            aut.step();
            assert.deepEqual(aut.data,grid2);
        });// 'cylinder' setting

        it("should respect the 'freeze' edge mode",function(){
            var grid = [[1,0,1],
                        [0,0,0],
                        [0,0,1]]
            var grid2 = [[1,0,1],
                        [0,1,0],
                        [0,0,1]]
            var aut = new Automaton(lifeUpdateRule,{
                startData:grid,
                edgeMode:"freeze"
            });
            aut.step();
            assert.deepEqual(aut.data,grid2);
        });// 'freeze' setting

        it("should allow row- and column-dependant updating",function(){
            var expected = [[1,2,3],[4,5,6],[7,8,9]];
            var aut = new Automaton((n,row,col) => (3*row + col + 1),{
                rows:3,
                cols:3,
                initializer:()=>0
            });
            aut.step()
            assert.deepEqual(aut.data,expected);
        });// update by row & column
    });// describe step

    describe("#reset()",function(){
        it("should reset automaton data to initial conditions",function(){
            var grid = [[1,2,3],[4,5,6],[7,8,9]];
            var aut = new Automaton((n) => n[4] + 1,{
                startData: grid
            });
            aut.step(5);
            assert.notDeepEqual(aut.data,grid);
            aut.reset();
            assert.deepEqual(aut.data,grid);
        });// basic reset functionality
    });// describe reset

    describe("#prettyPrint()",function(){
        it("should format the array into a readable string", function(){
            var aut = new Automaton(() => 0,{
                startData:[[1,2,3],[4,5,6],[7,8,9]]
            });
            assert.equal(aut.prettyPrint(),"123\n456\n789");
        });// format array into string

        it("should use a provided map function to display cells",function(){
            var aut = new Automaton(() => 0,{
                startData:[[1,2,3],[4,5,6],[7,8,9]]
            });           

            var s = aut.prettyPrint((cell) => "(" + cell + ")");
            assert.equal(s,"(1)(2)(3)\n(4)(5)(6)\n(7)(8)(9)");
        });
    });// describe prettyPrint
});// describe Automaton

describe("LifelikeAutomaton",function(){
    describe("#constructor()",function(){
        it("should accept a valid rule string without breaking", function(){
            var aut = new LifelikeAutomaton("3/23");
        });// default conditions

        it("should succesfully parse and apply a valid rule",function(){
            var glider = [[0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,1,1,0,0,0],
                          [0,0,1,0,1,0,0],
                          [0,0,1,0,0,0,0],
                          [0,0,0,0,0,0,0]];
            var glider2 = [[0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,1,1,0,0,0,0],
                          [0,1,0,1,0,0,0],
                          [0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0]];
            var aut = new LifelikeAutomaton("B3/S23",{
                startData:glider
            });
            aut.step(4);
            assert.deepEqual(aut.data,glider2);
        });// successfully parse life

        it("should reject invalid rule",function(){
            assert.throws(function(){
                var aut = new LifelikeAutomaton("This will never be valid!");
            });
        });
    });// describe constructor

    describe("#prettyPrint()",function(){
        it("should use the correct default map function",function(){
            var aut = new LifelikeAutomaton("3/23",{
                startData:[[true,true,true],
                           [false,false,false],
                           [false,true,false]]
            });
            var result = aut.prettyPrint();
            assert.equal(result,"[][][]\n      \n  []  ");
        });

        it("should accept an alternate map function",function(){
            var aut = new LifelikeAutomaton("3/23",{
                startData:[[true,true,true],
                           [false,false,false],
                           [false,true,false]]
            });
            var result = aut.prettyPrint((x) => x?"1":"0");
            assert.equal(result,"111\n000\n010");
        });
    });// describe prettyPrint

    describe("#setRuleset()",function(){
        it("should change the automaton's ruleset",function(){
            var grid1 = [[false,false,false,false],
                         [false,true,false,false],
                         [false,true,false,false],
                         [false,false,false,false]]
            var grid2 = [[false,false,false,false],
                         [true,false,true,false],
                         [true,false,true,false],
                         [false,false,false,false]]
            var aut = new LifelikeAutomaton("3/23",{startData:grid1});
            aut.setRuleset("2/");
            aut.step();
            assert.deepEqual(aut.data,grid2);
        });// basic test

        it("should support composition of functions",function(){
            var grid1 = [[false,false,false,false],
                         [false,true,false,false],
                         [false,true,false,false],
                         [false,false,false,false]]
            var grid2 = [[false,true,false,true],
                         [false,false,false,false],
                         [false,false,false,false],
                         [false,true,false,true]]
            var aut = new LifelikeAutomaton("3/23",{startData:grid1});
            aut.setRuleset(["2/","2/"]); //Seeds composed with itself
            aut.step();
            assert.deepEqual(aut.data,grid2);
        });// composition of functions
    });// describe setRuleset
});// describe LifelikeAutomaton
