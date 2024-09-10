let canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let interval;

let player = new Plane(0, 50, 30, 20, 60, 0);
let sprites = new Array();
let renderer = new Renderer(canvas);

//dt managment
let lastFrameDate = Date.now();

//airport data
let lastAirportPos = 0;

//sprite generation data
let lastGeneration = 0;
let generationFrequency = MIN_GENERATION_FREQUENCY;

function init(){
    //Inputs managment
    canvas.addEventListener("mousedown", ()=>{player.throttle = true});
    canvas.addEventListener('mouseup', ()=>{player.throttle = false})

    canvas.addEventListener("touchstart", ()=>{player.throttle = true})
    canvas.addEventListener("touchend", ()=>{player.throttle = false})
}

function computeDeltaTime(){
    let currentDate = Date.now();
    let dt = currentDate - lastFrameDate;
    lastFrameDate = currentDate;
    return dt/1000;
}

function generateAirport(){
    if(player.fuel < 25 && lastAirportPos < player.x - 500){
        let lastSprite = sprites[sprites.length - 1];
        let newAirportX = (lastSprite.x + lastSprite.w + 10)
        if(newAirportX < MAX_DISPLAY_WIDTH){
            newAirportX = player.x + MAX_DISPLAY_WIDTH
        }
        let airport = new Airport(newAirportX, -7, 490, 112, 0, 0)

        lastAirportPos = newAirportX;
        sprites.push(airport);
    }
}

function generateSprite(){
    let currentDate = Date.now();
    if(currentDate - lastGeneration > 1000/generationFrequency){
        if(sprites.length == 0 || sprites[sprites.length-1].x + sprites[sprites.length-1].w < player.x + MAX_DISPLAY_WIDTH){
            //we generate a sprite
            let newSpriteData = spriteData[Math.floor(Math.random()* spriteData.length)];
            let newSprite;

            switch (newSpriteData.type) {
                case "Building":
                    newSprite = new Building(player.x + MAX_DISPLAY_WIDTH, -Math.random()*4, newSpriteData.with, newSpriteData.height, 0, 0, newSpriteData.textures);
                    break;
                case "Vegetation":
                    newSprite = new Vegetation(player.x + MAX_DISPLAY_WIDTH, newSpriteData.y, newSpriteData.with, newSpriteData.height, 0, 0, newSpriteData.textures);
                    break;
                case "Baloon":
                    newSprite = new Baloon(player.x + MAX_DISPLAY_WIDTH, MAX_HEIGHT - newSpriteData.height - Math.random() * 30, newSpriteData.width, newSpriteData.height, -10, 0);
                    break;
                case "Helicopter":
                    newSprite = new Helicopter(player.x + MAX_DISPLAY_WIDTH, MAX_HEIGHT - newSpriteData.height - Math.random() * 30, newSpriteData.width, newSpriteData.height, -30, 0);
                    break;
                default:
                    return;
                    break;
                
            }
            sprites.push(newSprite);

            lastGeneration = currentDate;
            if(generationFrequency < MAX_GENERATION_FREQUENCY){
                generationFrequency += GENERATION_FREQUENCY_GAP;
            }
        }
    }
}

function endGame(){
    clearInterval(interval);
    player.audio.pause();
    alert("collision");
}

function frame(){
    let dt = computeDeltaTime();

    player.update(dt)

    generateAirport();
    generateSprite();

    if(player.checkGroundCollision()) endGame(); //check for ground crash

    for (let i = 0; i < sprites.length; i++) {

        if(sprites[i].x < player.x - 5000) sprites.splice(i, 1); //delete sprite if needed

        sprites[i].update(dt);
        
        if(player.checkCollide(sprites[i])) sprites[i].collide(player); //check for collisions

    }

    renderer.render(player, sprites);

    document.getElementById("score").innerText = "Score " + (Math.floor(player.score)).toString(); //update score
    document.getElementById("fuelLevel").style.width = parseFloat(player.fuel)+"%"; //update fuel level
}

//Launch game

init();

interval = setInterval(()=>{
    frame();
}, 16);