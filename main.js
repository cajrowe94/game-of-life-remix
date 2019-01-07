//canvas and context variables
var canvas;
var c;

var allCells = []; //array to hold all allCells in canvas

var cellEdge = 25; //how big is cell edge

var colNum; //how many fit in width

var rowNum; //how many fit in height

var frameCount = 0; //keep track of the frame count
var speed = 3;

var seeCells = 0;

var audioCtx = new (window.AudioContext || window.webkitAudioContext); //audio object

var notes = ["C", "D", "Db", "E", "Eb", "F", "Gb", "G", "Ab", "A", "Bb", "B"]; //list of notes
var noteFreqs = { //list of notes and their frequencies
    "C": [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50],
   "Db":   [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73],
    "D":   [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66],
   "Eb":   [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51],
    "E":   [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51],
    "F":   [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91],
   "Gb":   [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98],
    "G":   [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98],
   "Ab":   [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22],
    "A":   [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00],
   "Bb":   [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66],
    "B":   [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53]
 }

var soundTypes = ["sine", "square", "sawtooth", "triangle"];
            

$(document).ready(function() {
    //assign canvas and context objects
    canvas = document.getElementById('mycanvas');
    c = canvas.getContext('2d');
    //canvas.setAttribute("tabindex", 0);

    //fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
                
    //calc how many are going to fit
    rowNum = Math.floor(canvas.height/cellEdge);       
    colNum = Math.floor(canvas.width/cellEdge);

    //assign starting points
    var startX = (canvas.width-(colNum*cellEdge))/2;
    var startY = (canvas.height-(rowNum*cellEdge))/2;
    
    canvas.addEventListener('mousemove', function(e){
        //console.log("works");
//        if (speed < 10) speed++;
//        else speed = 10;
        var dist;
        for (var i = 0; i < allCells.length; i++){
            dist = calcDist(e.clientX, e.clientY, allCells[i].tL.x, allCells[i].tL.y);
            if (dist < 20 && allCells[i].color == 'black') {
                allCells[i].giveDeath();
                allCells[i].colors = 'black';
                allCells[i].playSound();
            }
            
        }
    },false);
    
    document.addEventListener('keypress', changeStyle, false);
                
                
                
    //populate array
    for (var y = startY; y < canvas.height; y+=cellEdge){
        for(var x = startX; x < canvas.width; x+=cellEdge){
            allCells.push(new Cell(x, y));
        }
    }
    
    for (var i = 0; i < allCells.length; i++){
        this.state = getRandomInt(0,1);
        if (allCells[i].tL.x <= 100 && allCells[i].tL.y < canvas.height*.66){
            if (allCells[i].tL.y > canvas.height*.33){
                if(this.state == 1){
                    allCells[i].color = 'black';
                } else allCells[i].color = 'white';
            }
        }
        
        allCells[i].count++;
            
        if (allCells[i].count > 5){
            allCells[i].giveDeath();
        }
            
        console.log(allCells[i].count);
    }
            
    //try to push those tool bars away
    afterLoad();
        
    //animation
    setInterval(animate, 33);
        
});

function animate() { //animate loop function
    //increase frame count
    frameCount++;
    
    c.globalAlpha = .3;
    
    //c.clearRect(0,0, canvas.width, canvas.height);

    if(frameCount%speed==0){
        for (var i = 0; i < allCells.length; i++){
            //allCells[i].drawCell();
            allCells[i].checkAround();          
        }
    }
    
}

function Cell(sqXSt, sqYSt){
    
    this.size = cellEdge;

    //cell parameters
    this.tL = {x:sqXSt, y:sqYSt};
    this.tR = {x:sqXSt + this.size, y:sqYSt};
    this.bL = {x:sqXSt, y:sqYSt + this.size};
    this.bR = {x:sqXSt + this.size, y:sqYSt + this.size};

    //keeps track of the allCells life or death state
    this.color = 'white'; //color for whether cell is alive or dead
    this.colors = 'rgb(' + getRandomInt(0, 25) + ',' + getRandomInt(100, 255) + ',' + getRandomInt(0, 255) + ')'; //color of cell edges
    
//    this.sound = soundTypes[getRandomInt(0, soundTypes.length-1)]; //sound type of cell
    this.sound = "square";
    this.note = "C";
    
    this.freq = 1;
    
    this.count;
    

    //assign a state when cell is created
    //this.state = getRandomInt(0, 1);
//    if (this.state == 0) this.color = 'white';
//    else this.color = 'black';
    
    //show the allCells
    this.drawCell = function(){
        c.lineWidth = .1;
        c.strokeStyle = this.color;
        c.strokeRect(this.tL.x, this.tL.y, this.size, this.size);
    };

    //called when you want to kill a cell
    this.giveDeath = function(){
        this.color = 'white';
        //this.sound = "sawtooth";
    }

    //called when you want to give a cell life
    this.giveLife = function(){
        this.color = 'black';
        //this.sound = "square";
//        c.beginPath();
//        c.lineWidth = .5;
//        c.strokeStyle = 'rgb(' + getRandomInt(0, 50) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')';
//        c.arc(this.tL.x+getRandomInt(0,5), this.tL.y+getRandomInt(0,5), getRandomFloat(.1, 5), 0, 2*Math.PI);
//        c.stroke();
    }
    
    this.playSound = function(){
        // create Oscillator node
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = this.sound;
        o.connect(g);
        o.frequency.setValueAtTime(this.tL.y, audioCtx.currentTime); // value in hertz
        g.connect(audioCtx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + this.tL.y*.002);
    }
    

    this.checkAround = function(){
        var neighbors = 0;
        
        for (var i = 0; i < allCells.length; i++){ //go through allCells array
            
            //top row of neighbors
            if (allCells[i].bR.x == this.tL.x && allCells[i].bR.y == this.tL.y){ //top left neighbor
                if (allCells[i].color == 'black') {
                    neighbors++; //if its black, its a neighbor
//                    c.beginPath();
//                    c.strokeStyle = 'rgb(' + getRandomInt(0, 50) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')';
//                    c.moveTo(this.tL.x, this.tL.y);
//                    c.lineTo(allCells[i].bR.x, allCells[i].bR.y);
//                    c.stroke();
                    
                }
            }
            if (allCells[i].bL.x == this.tL.x && allCells[i].bL.y == this.tL.y){ //top middle neighbor
                if (allCells[i].color == 'black') {
                    neighbors++;
//                    c.beginPath();
//                    c.strokeStyle = 'rgb(' + getRandomInt(0, 20) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')';
//                    c.moveTo(this.tL.x, this.tL.y);
//                    c.lineTo(allCells[i].bR.x, allCells[i].bR.y);
//                    c.stroke();
                }
            }
            if (allCells[i].bL.x == this.tR.x && allCells[i].bL.y == this.tR.y) { //top right neighbor
                if (allCells[i].color == 'black'){
                    neighbors++;
//                    c.beginPath();
//                    c.strokeStyle = this.colors;
//                    c.moveTo(this.tR.x, this.tR.y);
//                    c.lineWidth = .6;
//                    c.lineTo(allCells[i].bR.x + getRandomInt(-10, 10), allCells[i].bR.y + getRandomInt(-10, 10));
//                    c.stroke();
                }
            }
            //middle row
            if (allCells[i].tR.x == this.tL.x && allCells[i].tR.y == this.tL.y) { //middle left neighbor
                if (allCells[i].color == 'black'){
                    neighbors++;
                    c.beginPath();
                    c.strokeStyle = this.colors;
                    c.moveTo(this.tL.x + getRandomInt(-10, 10), this.tL.y);
                    c.lineWidth = .6;
                    c.lineTo(allCells[i].tL.x + getRandomInt(-10, 10), allCells[i].tL.y + getRandomInt(-10, 10));
                    c.stroke();
                }
            }
            if (allCells[i].tL.x == this.tR.x && allCells[i].tL.y == this.tR.y) { //middle right neighbor
                if (allCells[i].color == 'black') neighbors++;
            }
            
            //bottom row
            if (allCells[i].tR.x == this.bL.x && allCells[i].tR.y == this.bL.y) { // bottom left neighbors
                if (allCells[i].color == 'black') {
                    neighbors++;
                    c.beginPath();
                    c.strokeStyle = this.colors;
                    c.moveTo(this.bL.x, this.bL.y + getRandomInt(-10, 10));
                    c.lineWidth = .6;
                    c.lineTo(allCells[i].bR.x + getRandomInt(-10, 10), allCells[i].bR.y + getRandomInt(-10, 10));
                    c.stroke();
                }
            }
            if (allCells[i].tL.x == this.bL.x && allCells[i].tL.y == this.bL.y) {
                if (allCells[i].color == 'black') neighbors++;
            }
            if (allCells[i].tL.x == this.bR.x && allCells[i].tL.y == this.bR.y) {
                if (allCells[i].color == 'black') neighbors++;
            } 

        }
        //console.log(neighbors);
        
        switch(neighbors){
            case 0:
                this.giveDeath();
                break;
            case 1:
                this.giveDeath();
                break;
            case 2:
                //this.giveLife();
                break;
            case 3:
                this.giveLife();
                break;
            case 4:
                this.giveDeath();
                break;
            case 5:
                this.giveDeath();
                break;
            case 6:
                this.giveDeath();
                break;
            case 7:
                this.giveDeath();
                break;
            case 8:
                this.giveDeath();
                break;
        }
        
    }
    
}
    
function changeStyle(e){ //var notes = ["C", "D", "Db", "E", "Eb", "F", "Gb", "G", "Ab", "A", "Bb", "B"]; //list of notes
   //console.log("works");
    if (e.keyCode == 49){
        for (var i=0; i < allCells[i].length; i++){
            allCells[i].sound = "sawtooth";
        } 
    }
    else if (e.keyCode == 50){
        for (var i=0; i < allCells[i].length; i++){
            allCells[i].sound = "triangle";
        }
    }
    else if (e.keyCode == 51){
        for (var i=0; i < allCells[i].length; i++){
            allCells[i].sound = "sine";
        }
    }
    else if (e.keyCode == 52){
        for (var i=0; i < allCells[i].length; i++){
            allCells[i].sound = "square";
        }
    }
}

//calculate distance between two objects
function calcDist(xin, yin, x2in, y2in){
    var a = xin - x2in;
    var b = yin - y2in;

    var c = Math.sqrt(a*a + b*b);
    
    return c;
}

//map function
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//randomness
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max){
    return Math.random() * (max - min) + min;
}

//other stuff you need
function afterLoad(){
    window.scrollTo(0,1);
}

function touchStart (e) {
    e.preventDefault();
}

function touchMove (e) {
    e.preventDefault();
}

function touchEnd (e) {
    e.preventDefault();
}

function touchCancel (e) {
    e.preventDefault();
} 
















