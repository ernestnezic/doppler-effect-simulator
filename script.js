/*************
* Doppler Effect Simulator Project
* Razvili: F.Zarkovic & E.Nezic
* Visoko učilište Algebra, Multimedijsko Računarstvo, 1RM1
* Mentor: Goran Đambić
**************/


//Uzimanje referenci DOM objekata
const cvs = document.getElementById( "myCanvas" );
const sliderSource = document.getElementById( "mySource" );
const sliderListener = document.getElementById( "myListener" );


//Deklariranje globalnih varijabli
const context = cvs.getContext( "2d" );

let sourceSpeed = sliderSource.value;
let sourceFrequency = 20;

let listenerSpeed = sliderListener.value;

let circles = [];

let perceivedLambda = 0;
let perceivedFrequency = 0;


//Podešavanje dimenzija canvas objekta
cvs.height = window.innerHeight * 0.7;
cvs.width = window.innerWidth;


/**
 * Stvaranje kružnica na lokaciji izvora
 * @constructor
 * @param {number} x1 - Horizontalna lokacija izvora
 * @param {number} y1 - Vertikalna lokacija izvora
 * @param {number} rad - Radijus kružnice
 * @param {number} opacity - Definiranje prozirnosti
 * @param {boolean} fill - Definiranje ispune
 */
function CreateCircle( x1, y1, rad, r, g, b, opacity, fill ) {
    
    context.beginPath();
    context.arc( x1, y1, rad, 0, 2 * Math.PI );
    
    //Ukoliko je zadana ispuna, kružnicu se popunjava (koristi se samo prikilom crtanja izvora i slušatelja)
    if( fill ){
        context.fillStyle = `rgba(${r},${g},${b},${opacity.toString()})`;
        context.fill();
    } else{
        context.strokeStyle = `rgba(${r},${g},${b},${opacity.toString()})`;
        context.stroke();
    }

}


/**
 * Crtanje zadanog teksta na canvasu
 * @constructor
 * @param {string} text - Tekst za crtanje
 * @param {number} size - Velučina fonta
 * @param {number} x - Horizontalna pozicija teksta
 * @param {number} y - vertikalna pozicija teksta
 * @param {string} color - Boja teksta
 */
function DrawText( text, size, x, y, color ){
    
    context.fillStyle = color;
    context.font = size+"px Arial";
    context.textAlign = "center";
    context.fillText(text,x,y);

}


/**
 * Definiranje objekta kružnice
 * @constructor
 * @param {number} x - Horizontalna pozicija stvaranja kružnice
 * @param {number} y - Vertikalna pozicija stvaranja kružnice
 * @param {boolean} fill - Je li krug ispunjen (Da / Ne)
 */
function Circle( x, y, fill ){
    
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


//Kreiranje Izvora
const source = new Circle(window.innerWidth/4, window.innerHeight/4, true);
//Mjenjanje draw() funkcije- dodavanje teksta za ispis "Izvor"
source.draw = function(){
    CreateCircle(this.x,this.y,this.rad,this.r,this.g,this.b,this.opacity,this.fill);
    DrawText("Source",15,this.x,this.y-5,"crimson");
}
source.rad = 2;


//Kreiranje Slušatelja
const listener = new Circle(window.innerWidth/4 * 3,window.innerHeight/4, true);
listener.rad = 2;
listener.r = 20;
listener.g = 100;
listener.b = 255;
//Mjenjanje draw() funkcije- dodavanje teksta za ispis "Slušatelj"
listener.draw = function(){
    CreateCircle(this.x,this.y,this.rad,this.r,this.g,this.b,this.opacity,this.fill);
    DrawText("Observer",15,this.x,this.y-5,"dodgerblue");
}


//Varijable korištene u slijedećim funkcijama
let animating = false;

//Pokretanje animacije
function play() {
    animating = true;
}

//Zaustavljanje animacije
function stop() {
    animating = false;
}

//Resetiranje animacije
function remake() {
    source.x = window.innerWidth/16;
    listener.x = window.innerWidth/16 * 15;
    circles = [];
}


//Event listeneri za slidere
sliderSource.oninput = function(){
    sourceSpeed = this.value;
}
sliderListener.oninput = function(){
    listenerSpeed = this.value;
}


//Varijable korištene u slijedećoj funkciji
let delay = 0;
const animationSpeed = 3; //Fiksni parametar brzine animacije

//Animiranje Canvas objekta
function canvasAnimation(){
    
    //Animacija jednog framea kroz loop
    window.requestAnimationFrame(function loop(){
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        //Ukoliko animcija nije aktivna, objekti stoje
        if( animating ){
            
            //Kada je delay counter veći od frekvencije izvora, kreira se novi objekt (krug)
            if ( delay > sourceFrequency ){
                circles.push(new Circle(source.x,source.y,false));
                delay = 0;
            }else{
                delay += 1;
            }

            //Određuje novu horizontalnu poziciju izvora i slušatelja s obzirom na njihove brzine
            source.x += sourceSpeed/(343)*animationSpeed;
            listener.x += listenerSpeed/(343)*animationSpeed;

            //forEach petlja prolazi kroz sve elemente circles arraya (iscrtani valovi)
            circles.forEach(element => {
                element.rad += 1*animationSpeed;

                //Što je duže objekt (kružnica) na ekranu, smanjuje mu se opacity
                if( element.rad>50 ){
                    element.opacity -= 0.004;
                }
                
                //Zbog optimizacije, briše objekt (kružnicu) kada je njen opacity zanemariv
                if( element.opacity <= 0.02 ){
                    circles.shift();
                }
            });
        }
        

        //Parsanje varijabli
        sourceSpeed = parseInt( sourceSpeed )
        listenerCalculation = Math.abs(parseInt( listenerSpeed ));
        
        //Promjena i primjena formule  ukoliko se izvor približava/udaljava od slušatelja
        if( source.x <= listener.x ){
            perceivedFrequency = 343*((343+listenerCalculation)/(343-sourceSpeed));
            perceivedLambda = 343/perceivedFrequency;
        }else{
            perceivedFrequency = 343*((343-listenerCalculation)/(343+sourceSpeed));
            perceivedLambda = 343/perceivedFrequency;
        }

        //Korištenje formula Dopplerovog efekta i pozivanje njihovog ispisa
        DrawText("Source Velocity = "+sourceSpeed+" m/s",15,cvs.width*0.35,cvs.height-5,"crimson");
        DrawText("Observer Velocity = "+listenerSpeed+" m/s",15,cvs.width*0.65,cvs.height-5,"dodgerblue");
        DrawText("Brziva zvuka = 343 m/s",15,cvs.width*0.1,cvs.height-45,"black");
        DrawText("Frekvencija izvora = 343 Hz",15,cvs.width*0.1,cvs.height-25,"black");
        DrawText("Valna duljina izvora = 1 m",15,cvs.width*0.1,cvs.height-5,"black");
        DrawText("Opazena valna duljina = "+perceivedLambda.toFixed(2)+" m",15,cvs.width*0.9,cvs.height-25,"magenta");
        DrawText("Opazena frekvencija = "+perceivedFrequency.toFixed(2)+"Hz",15,cvs.width*0.9,cvs.height-5,"magenta");
        source.draw();
        listener.draw();
        
        //Crtanje objekta (kružnica) na canvasu
        circles.forEach(element => {
            element.draw();
        });

        //Pozivanje slijedećeg framea
        window.requestAnimationFrame(loop);
    })
}


//Inicijalno pokretanje
canvasAnimation();