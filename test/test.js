"use strict";

var assert = require("assert");
var Automaton = require("../src/main.js").Automaton;

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
