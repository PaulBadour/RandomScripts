/*

Class that does all the math for scrambling picture

Usage:

var s = new Scrambler();
s.scramble("R U R' F2");

To then get a face:

s.wface
s.gface
s.rface

Whatever color you want

After scramble is done:
s.reset();
s.scramble("R U...");

*/
class Scrambler {
    constructor(){
        this.wface;
        this.gface;
        this.rface;
        this.bface;
        this.oface;
        this.yface;
        this.reset();
    }

    reset() {
        this.wface = [
            ["w", "w", "w"],
            ["w", "w", "w"],
            ["w", "w", "w"]
        ];
    
        this.gface = [
            ["g", "g", "g"],
            ["g", "g", "g"],
            ["g", "g", "g"]
        ];
    
        this.rface = [
            ["r", "r", "r"],
            ["r", "r", "r"],
            ["r", "r", "r"]
        ];
    
        this.bface = [
            ["b", "b", "b"],
            ["b", "b", "b"],
            ["b", "b", "b"]
        ];
    
        this.oface = [
            ["o", "o", "o"],
            ["o", "o", "o"],
            ["o", "o", "o"]
        ];
    
        this.yface = [
            ["y", "y", "y"],
            ["y", "y", "y"],
            ["y", "y", "y"]
        ];
    }

    rotateFace(s, n){
        var t;
        for (var i = 0; i < n; i++){
            t = s[0][0];
            s[0][0] = s[2][0];
            s[2][0] = s[2][2];
            s[2][2] = s[0][2];
            s[0][2] = t;
    
            t = s[0][1];
            s[0][1] = s[1][0];
            s[1][0] = s[2][1];
            s[2][1] = s[1][2];
            s[1][2] = t;
        }
    
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
        for (var i = 0; i < n; i++){
            t = this.gface[2];
            this.gface[2] = this.oface[2];
            this.oface[2] = this.bface[2];
            this.bface[2] = this.rface[2];
            this.rface[2] = t;

        }
    }

    layerR(n){
        var t;
        for (var i = 0; i < n; i++){
            t = this.gface[0][2];
            this.gface[0][2] = this.yface[0][2];
            this.yface[0][2] = this.bface[2][0];
            this.bface[2][0] = this.wface[0][2];
            this.wface[0][2] = t;

            t = this.gface[1][2];
            this.gface[1][2] = this.yface[1][2];
            this.yface[1][2] = this.bface[1][0];
            this.bface[1][0] = this.wface[1][2];
            this.wface[1][2] = t;

            t = this.gface[2][2];
            this.gface[2][2] = this.yface[2][2];
            this.yface[2][2] = this.bface[0][0];
            this.bface[0][0] = this.wface[2][2];
            this.wface[2][2] = t;
        }
    }

    layerL(n){
        var t;
        for (var i = 0; i < n; i++){
            t = this.gface[0][0];
            this.gface[0][0] = this.wface[0][0];
            this.wface[0][0] = this.bface[0][2];
            this.bface[0][2] = this.yface[0][0];
            this.yface[0][0] = t;

            t = this.gface[1][0];
            this.gface[1][0] = this.wface[1][0];
            this.wface[1][0] = this.bface[1][2];
            this.bface[1][2] = this.yface[1][0];
            this.yface[1][0] = t;

            t = this.gface[2][0];
            this.gface[2][0] = this.wface[2][0];
            this.wface[2][0] = this.bface[2][2];
            this.bface[2][2] = this.yface[2][0];
            this.yface[2][0] = t;
        }
    }

    layerF(n){
        var t;
        for (var i = 0; i < n; i++){
            t = this.wface[2][0];
            this.wface[2][0] = this.oface[2][2];
            this.oface[2][2] = this.yface[0][2];
            this.yface[0][2] = this.rface[0][0];
            this.rface[0][0] = t;

            t = this.wface[2][1];
            this.wface[2][1] = this.oface[1][2];
            this.oface[1][2] = this.yface[0][1];
            this.yface[0][1] = this.rface[1][0];
            this.rface[1][0] = t;

            t = this.wface[2][2];
            this.wface[2][2] = this.oface[0][2];
            this.oface[0][2] = this.yface[0][0];
            this.yface[0][0] = this.rface[2][0];
            this.rface[2][0] = t;
        }
    }

    layerB(n){
        var t;
        for (var i = 0; i < n; i++){
            t = this.wface[0][0];
            this.wface[0][0] = this.rface[0][2];
            this.rface[0][2] = this.yface[2][2];
            this.yface[2][2] = this.oface[2][0];
            this.oface[2][0] = t;

            t = this.wface[0][1];
            this.wface[0][1] = this.rface[1][2];
            this.rface[1][2] = this.yface[2][1];
            this.yface[2][1] = this.oface[1][0];
            this.oface[1][0] = t;

            t = this.wface[0][2];
            this.wface[0][2] = this.rface[2][2];
            this.rface[2][2] = this.yface[2][0];
            this.yface[2][0] = this.oface[0][0];
            this.oface[0][0] = t;
        }
    }

    scramble(s){
        var moveCount;
        var t;
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
                    this.rotateFace(this.wface, moveCount);
                    this.layerU(moveCount);
                    break;
                case "F":
                    this.rotateFace(this.gface, moveCount);
                    this.layerF(moveCount)
                    break;

                case "R":
                    this.rotateFace(this.rface, moveCount);
                    this.layerR(moveCount);
                    break;

                case "B":
                    this.rotateFace(this.bface, moveCount);
                    this.layerB(moveCount);
                    break;

                case "L":
                    this.rotateFace(this.oface, moveCount);
                    this.layerL(moveCount);
                    break;

                case "D":
                    this.rotateFace(this.yface, moveCount);
                    this.layerD(moveCount)
                    break;
            }
        }
    }
}