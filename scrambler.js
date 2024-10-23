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
const DEBUG = false;

class Scrambler {

    // This is essentially an enum
    static Cubes = Object.freeze({
        TWOxTWO: 2,
        THREExTHREE: 3,
        FOURxFOUR: 4,
        FIVExFIVE: 5,
        SIXxSIX: 6,
        SEVENxSEVEN: 7
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

    layerU(n, wc){
        var t;
        for (var w = 0; w < wc; w++){
            for (var i = 0; i < n; i++){
                t = this.gface[w];
                this.gface[w] = this.rface[w];
                this.rface[w] = this.bface[w];
                this.bface[w] = this.oface[w];
                this.oface[w] = t;
            }
        }
    }

    layerD(n, wc){
        var t;
        var r;
        for (var w = 0; w < wc; w++) {
            r = this.cubeType - 1 - w;
            for (var i = 0; i < n; i++){
                t = this.gface[r];
                this.gface[r] = this.oface[r];
                this.oface[r] = this.bface[r];
                this.bface[r] = this.rface[r];
                this.rface[r] = t;

            }
        }
    }

    layerR(n, wc){
        var t;
        var r;
        for (var w = 0; w < wc; w++){
            r = this.cubeType - 1;
            for (var i = 0; i < n; i++){
                for (var j = 0; j < this.cubeType; j++){
                    t = this.gface[j][r];
                    this.gface[j][r - w] = this.yface[j][r - w];
                    this.yface[j][r - w] = this.bface[r - j][w];
                    this.bface[r - j][w] = this.wface[j][r - w];
                    this.wface[j][r - w] = t;
                }
            }
        }
    }

    layerL(n, wc){
        var t;
        var r;
        for (var w = 0; w < wc; w++){
            r = this.cubeType - 1;
            for (var i = 0; i < n; i++){
                for (var j = 0; j < this.cubeType; j++){
                    t = this.gface[j][w];
                    this.gface[j][w] = this.wface[j][w];
                    this.wface[j][w] = this.bface[r-j][r - w];
                    this.bface[r-j][r - w] = this.yface[j][w];
                    this.yface[j][w] = t;
                }
            }
        }
    }

    layerF(n, wc){
        var t;
        var r;
        for (var w = 0; w < wc; w++){
            r = this.cubeType - 1;
            for (var i = 0; i < n; i++){
                for (var j = 0; j < this.cubeType; j++){
                    t = this.wface[r - w][j];
                    this.wface[r - w][j] = this.oface[r-j][r - w];
                    this.oface[r-j][r - w] = this.yface[w][r-j];
                    this.yface[w][r-j] = this.rface[j][w];
                    this.rface[j][w] = t;
                }
            }
        }
    }

    layerB(n, wc){
        var t;
        var r;
        for (var w = 0; w < wc; w++){
            r = this.cubeType - 1;
            for (var i = 0; i < n; i++){
                for (var j = 0; j < this.cubeType; j++){
                    t = this.wface[w][j];
                    this.wface[w][j] = this.rface[j][r-w];
                    this.rface[j][r-w] = this.yface[r-w][r-j];
                    this.yface[r-w][r-j] = this.oface[r-j][w];
                    this.oface[r-j][w] = t;
                }
            }
        }
    }

    generateScramble(genOnly = false) {
        
        // Inclusive range of scramble lengths
        const THREExTHREE_RANGE = [18,21];
        const TWOxTWO_RANGE = [11, 11];
        const FOURxFOUR_RANGE = [42, 47];
        const FIVExFIVE_RANGE = [60, 60];
        const SIXxSIX_RANGE = [64, 64];
        const SEVENxSEVEN_RANGE = [100, 100]; // I almost threw up when i found this number
        
        // I noticed that 4x4 scrambles did not have any wedge moves in the first 40% of moves per scramble, so this simulates that
        const FOURxFOUR_GRACE = [18, 21];
        var grace = Math.floor(Math.random() * (1 + FOURxFOUR_GRACE[1] - FOURxFOUR_GRACE[0])) + FOURxFOUR_GRACE[0];

        var scramble = [];
        var range;
        switch (this.cubeType){
            case Scrambler.Cubes.THREExTHREE:
                range = THREExTHREE_RANGE;
                break;

            case Scrambler.Cubes.TWOxTWO:
                range = TWOxTWO_RANGE;
                break;

            case Scrambler.Cubes.FOURxFOUR:
                range = FOURxFOUR_RANGE;
                break;

            case Scrambler.Cubes.FIVExFIVE:
                range = FIVExFIVE_RANGE;
                break;

            case Scrambler.Cubes.SIXxSIX:
                range = SIXxSIX_RANGE;
                break;

            case Scrambler.Cubes.SEVENxSEVEN:
                range = SEVENxSEVEN_RANGE;
                break;

            default:
                range = THREExTHREE_RANGE;
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

                // A 2x2 specific rule where two opposite moves can not be next to each other
                if (this.cubeType == Scrambler.Cubes.TWOxTWO && scramble.length > 0 && scramble[scramble.length - 1][0] == opp(m)){
                    good = false;
                }
            } while (!good);

            // Special rule for 4x4
            if (this.cubeType == Scrambler.Cubes.FOURxFOUR && scramble.length > grace && Math.floor(Math.random() * 2) == 0){
                m += "w";
            } // The special rule for 5x5 since it is different than 4x4
            else if (this.cubeType == Scrambler.Cubes.FIVExFIVE && Math.floor(Math.random() * 2) == 0){
                m += "w";
            } else if (this.cubeType == Scrambler.Cubes.SIXxSIX || this.cubeType == Scrambler.Cubes.SEVENxSEVEN){
                switch (Math.floor(Math.random() * 3)){
                    case 0:
                        m += "w";
                        break
                    case 1:
                        m = "3" + m + "w";
                        break;
                }
            }
            
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

    doScramble(s = this.scramble){
        var moveCount;
        var wedgeCount;

        
        this.reset();

        for (const move of s.split(" ")){

            var mdir = move[0] == '3' ? move[1] : move[0];
            var mlast = move[move.length - 1];

            if (move.length == 1 || move[1] != 'w'){
                wedgeCount = 1;
            } else if (move[1] == 'w'){
                wedgeCount = 2;
            } else {
                wedgeCount = 3;
            }

            
            if (move.length == 1 || mlast == 'w'){
                moveCount = 1;
            } else if (mlast == "2"){
                moveCount = 2;
            } else {
                moveCount = 3;
            }

            switch(mdir){
                case "U":
                    this.wface = this.rotateFace(this.wface, moveCount);
                    this.layerU(moveCount, wedgeCount);
                    break;
                case "F":
                    this.gface = this.rotateFace(this.gface, moveCount);
                    this.layerF(moveCount, wedgeCount)
                    break;

                case "R":
                    this.rface = this.rotateFace(this.rface, moveCount);
                    this.layerR(moveCount, wedgeCount);
                    break;

                case "B":
                    this.bface = this.rotateFace(this.bface, moveCount);
                    this.layerB(moveCount, wedgeCount);
                    break;

                case "L":
                    this.oface = this.rotateFace(this.oface, moveCount);
                    this.layerL(moveCount, wedgeCount);
                    break;

                case "D":
                    this.yface = this.rotateFace(this.yface, moveCount);
                    this.layerD(moveCount, wedgeCount)
                    break;
                default:
                    console.log("Error Move");
                    break;
            }
        }
    }
}


if (DEBUG){
    var s = new Scrambler(Scrambler.Cubes.SEVENxSEVEN);
    var str = s.generateScramble();
    console.log(str);
    console.log(s.wface);
    console.log(s.gface);
    console.log(s.rface);
}