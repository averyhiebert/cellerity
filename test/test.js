"use strict";

var assert = require("assert");
var Automaton = require("../src/main.js").Automaton;

describe("Automaton", function(){
    describe("#constructor()",function(){
        it("should initialize an automaton to default conditions", function(){
            var aut = new Automaton(() => 0);
            assert.equal(aut.data.length,20);
            assert.equal(aut.data[0].length,20);
            assert.equal(aut.data[0][0],0);
        });

        it("should support alternate dimensions", function(){
            var aut = new Automaton(() => 0,{
                rows:3,
                cols:5
            });
            assert.equal(aut.data.length,3);
            assert.equal(aut.data[0].length,5);
        });

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
        });
    });// describe constructor

    describe("#step()",function(){
        it("should support a simple update rule",function(){
            var aut = new Automaton(n => n[4] + 1);
            assert.equal(aut.data[1][1],0);
            aut.step();
            assert.equal(aut.data[1][1],1);
            aut.step();
            assert.equal(aut.data[1][1],2);
            aut.step();
            assert.equal(aut.data[1][1],3);
            aut.step();
            assert.equal(aut.data[1][1],4);
        });
    });// describe step
});// describe Automaton
