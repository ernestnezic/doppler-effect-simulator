/*************
* Doppler Effect Simulator Project
* Razvili: F.Zarkovic & E.Nezic
* Visoko učilište Algebra, Multimedijsko Računarstvo, 1RM1
* Mentor: Goran Đambić
**************/


const cvs = document.getElementById("myCanvas");
cvs.height = window.innerHeight*0.7;
cvs.width = window.innerWidth;
const context = cvs.getContext("2d");

const sliderSource = document.getElementById("mySource");
const sliderListener = document.getElementById("myListener");

function CreateCircle(x1, y1, rad,r,g,b,opacity,fill) {
    context.beginPath();
    context.arc(x1, y1, rad, 0, 2 * Math.PI);
    if(fill){
        context.fillStyle = "rgba("+r+","+g+","+b+","+opacity.toString()+")";
        context.fill();
    }else{
        context.strokeStyle = "rgba("+r+","+g+","+b+","+opacity.toString()+")";
        context.stroke();
    }
}

function DrawText(text,size,x,y,color){
    context.fillStyle = color;
    context.font = size+"px Arial";
    context.textAlign = "center";
    context.fillText(text,x,y);
}

function Circle(x,y,fill){
    this.x = x;
    this.y = y;
    this.rad = 0;
    this.r = 255;
    this.g = 20;
    this.b = 20;
    this.opacity = 1;
    this.fill = fill;
    this.draw = function(){
        CreateCircle(this.x,this.y,this.rad,this.r,this.g,this.b,this.opacity,this.fill);
    }
}

//source
let sourceSpeed = sliderSource.value;
let sourceFrequency = 20;
const source = new Circle(window.innerWidth/4, window.innerHeight/4, true);
source.draw = function(){
    CreateCircle(this.x,this.y,this.rad,this.r,this.g,this.b,this.opacity,this.fill);
    DrawText("Source",15,this.x,this.y-5,"crimson");
}
source.rad = 2;


//listener
let listenerSpeed = sliderListener.value;
const listener = new Circle(window.innerWidth/4 * 3,window.innerHeight/4, true);
listener.draw = function(){
    CreateCircle(this.x,this.y,this.rad,this.r,this.g,this.b,this.opacity,this.fill);
    DrawText("Observer",15,this.x,this.y-5,"dodgerblue");
}
listener.rad = 2;
listener.r = 20;
listener.g = 100;
listener.b = 255;

//variables
let circles = [];
let delay = 0;
let animating = false;

function stop() {
    animating = false;
}
function play() {
    animating = true;
}
function remake() {
    source.x = window.innerWidth/16;
    listener.x = window.innerWidth/16 * 15;
    circles = [];
}


//SLIDERS
sliderSource.oninput = function(){
    sourceSpeed = this.value;
}
sliderListener.oninput = function(){
    listenerSpeed = this.value;
}

let perceivedLambda = 0;
let perceivedFrequency = 0;

const animationSpeed = 3;
function canvasAnimation(){
    window.requestAnimationFrame(function loop(){
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if(animating){
            if (delay > sourceFrequency){
                circles.push(new Circle(source.x,source.y,false));
                delay = 0;
            }else{
                delay+=1;
            }
            source.x+=sourceSpeed/(343)*animationSpeed;
            listener.x+=listenerSpeed/(343)*animationSpeed;
            circles.forEach(element => {
                element.rad += 1*animationSpeed;
                if(element.rad>50){
                    element.opacity -= 0.004;
                }
                if(element.opacity<=0.02){
                    circles.shift();
                }
            });
        }
        //FORMULA ZA DOPPLER
        sourceSpeed = parseInt(sourceSpeed)
        listenerCalculation = parseInt(listenerSpeed)*-1;
        if(source.x<=listener.x){
            perceivedFrequency = 343*((343+listenerCalculation)/(343-sourceSpeed));
            perceivedLambda = 343/perceivedFrequency;
        }else{
            perceivedFrequency = 343*((343-listenerCalculation)/(343+sourceSpeed));
            perceivedLambda = 343/perceivedFrequency;
        }
        DrawText("Source Velocity = "+sourceSpeed+" m/s",15,cvs.width*0.35,cvs.height-5,"crimson");
        DrawText("Observer Velocity = "+listenerSpeed+" m/s",15,cvs.width*0.65,cvs.height-5,"dodgerblue");
        DrawText("Brziva zvuka = 343 m/s",15,cvs.width*0.1,cvs.height-45,"black");
        DrawText("Frekvencija izvora = 343 Hz",15,cvs.width*0.1,cvs.height-25,"black");
        DrawText("Valna duljina izvora = 1 m",15,cvs.width*0.1,cvs.height-5,"black");
        DrawText("Opazena valna duljina = "+perceivedLambda.toFixed(2)+" m",15,cvs.width*0.9,cvs.height-25,"magenta");
        DrawText("Opazena frekvencija = "+perceivedFrequency.toFixed(2)+"Hz",15,cvs.width*0.9,cvs.height-5,"magenta");
        source.draw();
        listener.draw();
        circles.forEach(element => {
            element.draw();
        });
        window.requestAnimationFrame(loop);
    })
}
canvasAnimation();