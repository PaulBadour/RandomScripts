/*

Class that does all the math for scrambling picture

Usage:

var s = new Scrambler(Scrambler.Cubes.THREExTHREE);
var scrambleString = s.generateScramble();

To then get a face:

s.wface
s.gface
s.rface

Whatever color you want

When it is time for a new scramble:
scrambleString = s.generateScramble();

The Enum Scrambler.Cubes can also return the value of side length, might be useful for generalizing display
Can be accessed with:

s.cubeType // Would return 3 for a 3x3


If for whatever reason you want to generate a scramble without scrambling the virtual cube:
var scramble = s.generateScramble(genOnly = true);

*/


class Scrambler {

    // This is essentially an enum
    static Cubes = Object.freeze({
        THREExTHREE: 3,
        TWOxTWO: 2
    });

    static moves = ["R","U","F","L","D","B"];

    constructor(cubeType){
        this.wface;
        this.gface;
        this.rface;
        this.bface;
        this.oface;
        this.yface;
        this.cubeType = cubeType;
        this.reset();

    }

    reset() {
        this.wface = []
        this.gface = []
        this.rface = []
        this.bface = []
        this.oface = []
        this.yface = []
        for (var i = 0; i < this.cubeType; i++){
            this.wface.push(new Array(this.cubeType).fill('w'));
            this.gface.push(new Array(this.cubeType).fill('g'));
            this.rface.push(new Array(this.cubeType).fill('r'));
            this.bface.push(new Array(this.cubeType).fill('b'));
            this.oface.push(new Array(this.cubeType).fill('o'));
            this.yface.push(new Array(this.cubeType).fill('y'));
        }
    }

    rotateFace(s, n){
        const transpose = function(matrix) {
            return matrix[0].map((col, i) => matrix.map(row => row[i]));
        }

        // Flips the order of each column
        // Ex. [1, 4, 7],           [3, 6, 9],
        //     [2, 5, 8],      =    [2, 5, 8],
        //     [3, 6, 9]            [1, 4, 7]
        const flipColumns = function(matrix) {
            for (var i = 0; i < matrix.length / 2; i++){
                var temp = matrix[i];
                matrix[i] = matrix[matrix.length - i - 1];
                matrix[matrix.length - i - 1] = temp;
            }

            return matrix;
        }

        n = 4 - n; // Since this code actually rotates CCW, we have to inverse the number of rotations to make it CW

        for (var i = 0; i < n; i++){
            s = flipColumns(transpose(s));
        }
        return s;
    }

    layerU(n){
        var t;
        for (var i = 0; i < n; i++){
            t = this.gface[0];
            this.gface[0] = this.rface[0];
            this.rface[0] = this.bface[0];
            this.bface[0] = this.oface[0];
            this.oface[0] = t;
        }
    }

    layerD(n){
        var t;
        var r = this.cubeType - 1;
        for (var i = 0; i < n; i++){
            t = this.gface[r];
            this.gface[r] = this.oface[r];
            this.oface[r] = this.bface[r];
            this.bface[r] = this.rface[r];
            this.rface[r] = t;

        }
    }

    layerR(n){
        var t;
        var r = this.cubeType - 1;
        for (var i = 0; i < n; i++){
            for (var j = 0; j < this.cubeType; j++){
                t = this.gface[j][r];
                this.gface[j][r] = this.yface[j][r];
                this.yface[j][r] = this.bface[r - j][0];
                this.bface[r - j][0] = this.wface[j][r];
                this.wface[j][r] = t;
            }
        }
    }

    layerL(n){
        var t;
        var r = this.cubeType - 1;
        for (var i = 0; i < n; i++){
            for (var j = 0; j < this.cubeType; j++){
                t = this.gface[j][0];
                this.gface[j][0] = this.wface[j][0];
                this.wface[j][0] = this.bface[r-j][r];
                this.bface[r-j][r] = this.yface[j][0];
                this.yface[j][0] = t;
            }
        }
    }

    layerF(n){
        var t;
        var r = this.cubeType - 1;
        for (var i = 0; i < n; i++){
            for (var j = 0; j < this.cubeType; j++){
                t = this.wface[r][j];
                this.wface[r][j] = this.oface[r-j][r];
                this.oface[r-j][r] = this.yface[0][r-j];
                this.yface[0][r-j] = this.rface[j][0];
                this.rface[j][0] = t;
            }
        }
    }

    layerB(n){
        var t;
        var r = this.cubeType - 1;
        for (var i = 0; i < n; i++){
            for (var j = 0; j < this.cubeType; j++){
                t = this.wface[0][j];
                this.wface[0][j] = this.rface[j][r];
                this.rface[j][r] = this.yface[r][r-j];
                this.yface[r][r-j] = this.oface[r-j][0];
                this.oface[r-j][0] = t;
            }
        }
    }

    generateScramble(genOnly = false) {
        
        // Inclusive range of scramble lengths
        const THREExTHREE_RANGE = [18,21];
        const TWOxTWO_RANGE = [11, 11];

        
        var scramble = [];
        var range;
        switch (this.cubeType){
            case Scrambler.Cubes.THREExTHREE:
                range = THREExTHREE_RANGE;
                break;

            case Scrambler.Cubes.TWOxTWO:
                range = TWOxTWO_RANGE;
                break;
        }
        
        // Gets opposite side move
        // Ex. R -> L, U -> D
        var opp = function (c) {
            var i = Scrambler.moves.indexOf(c);
            var io;
            
            if (i < 3){
                io = i + 3;
            } else {
                io = i - 3;
            }
            
            return Scrambler.moves[io];
        }
    
    
        var scrLength = Math.floor(Math.random() * (1 + range[1] - range[0])) + range[0];
        
        for (var i = 0; i < scrLength; i++){
            var m;
            var good;
            do{
                good = true;
                m = Scrambler.moves[Math.floor(Math.random() * 6)];
                
                // Gets rid of the same moves back to back
                if (scramble.length > 0 && scramble[scramble.length - 1][0] == m){
                    good = false;
                }
                
                // Gets rid of redundant moves after opposite moves
                if (scramble.length > 1 && scramble[scramble.length - 1][0] == opp(m) && scramble[scramble.length - 2][0] == m){
                    good = false;
                }
            } while (!good);
            
            // Adds modifiers
            switch (Math.floor(Math.random() * 3)){
                case 0:
                  m += "'";
                  break;
                case 1:
                  m += "2";
                  break;
            }
            scramble.push(m);
        }

        this.scramble = scramble.join(" ");
        if (!genOnly){
            this.doScramble();
        }

        return this.scramble;
    }

    doScramble(){
        var moveCount;
        var t;
        var s = this.scramble;

        
        this.reset();

        for (const move of s.split(" ")){
            if (move.length == 1){
                moveCount = 1;
            } else if (move[1] == "2"){
                moveCount = 2;
            } else {
                moveCount = 3;
            }
            
            switch(move[0]){
                case "U":
                    this.wface = this.rotateFace(this.wface, moveCount);
                    this.layerU(moveCount);
                    break;
                case "F":
                    this.gface = this.rotateFace(this.gface, moveCount);
                    this.layerF(moveCount)
                    break;

                case "R":
                    this.rface = this.rotateFace(this.rface, moveCount);
                    this.layerR(moveCount);
                    break;

                case "B":
                    this.bface = this.rotateFace(this.bface, moveCount);
                    this.layerB(moveCount);
                    break;

                case "L":
                    this.oface = this.rotateFace(this.oface, moveCount);
                    this.layerL(moveCount);
                    break;

                case "D":
                    this.yface = this.rotateFace(this.yface, moveCount);
                    this.layerD(moveCount)
                    break;
            }
        }
    }
}