let canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let interval;

let player = new Player(0, 50, 30, 20, 60, 0);
let renderer = new Renderer(canvas);

//dt managment
let lastFrameDate = Date.now();

function init(){
    //Input managment
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

function generateCloud(){
    if(Cloud.lastCloudX < player.x + MAX_WIDTH*0.33 && Math.random() > 0.5){

        let x = player.x + MAX_DISPLAY_WIDTH;
        let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;

        new Cloud(x, y, 40, 30);

    }
}

function generateAirport(){
    if(player.fuel < 25 && Airport.lastAirportX < player.x - 500){

        let newAirportX = (Sprite.getLastSprite().getRightBoundX() + 10)
        if(newAirportX < MAX_DISPLAY_WIDTH){
            newAirportX = player.x + MAX_DISPLAY_WIDTH
        }

        new Airport(newAirportX, -7, 490, 112)

    }
}

function generateSprite(){
    if(Sprite.getLastGenerationAge()> 1000/Sprite.generationFrequency){
        if(Sprite.sprites.length == 0 || Sprite.getLastSprite().getRightBoundX() < player.x + MAX_DISPLAY_WIDTH){
            
            let newSpriteData = spriteData[Math.floor(Math.random()* spriteData.length)];

            switch (newSpriteData.type) {
                case "Building":
                    new Building(player.x + MAX_DISPLAY_WIDTH, -Math.random()*4, newSpriteData.with, newSpriteData.height, newSpriteData.textures);
                    break;
                case "Vegetation":
                    new Vegetation(player.x + MAX_DISPLAY_WIDTH, newSpriteData.y, newSpriteData.with, newSpriteData.height, newSpriteData.textures);
                    break;
                case "Baloon":
                    new Baloon(player.x + MAX_DISPLAY_WIDTH, MAX_HEIGHT - newSpriteData.height - Math.random() * 30, newSpriteData.width, newSpriteData.height, -10, 0);
                    break;
                case "Helicopter":
                    new Helicopter(player.x + MAX_DISPLAY_WIDTH, MAX_HEIGHT - newSpriteData.height - Math.random() * 30, newSpriteData.width, newSpriteData.height, -30, 0);
                    break;
                default:
                    break;
                
            }
        }
    }
}

function endGame(){
    clearInterval(interval);
    player.audio.pause();
    alert("collision");
    window.location.reload();
}

function frame(){
    let dt = computeDeltaTime();

    player.update(dt)

    //Generations
    generateCloud();
    generateAirport();
    generateSprite();

    //Background Sprites loop
    for (let i = 0; i < Sprite.backgroundSprites.length; i++) {

        //Delete background sprite if not visible anymore
        if(Sprite.backgroundSprites[i].x < player.x - 5000) Sprite.backgroundSprites.splice(i, 1);
    
    }

    //Main Sprites loop
    for (let i = 0; i < Sprite.sprites.length; i++) {

        //Delete sprite if not visible anymore
        if(Sprite.sprites[i].x < player.x - 5000) Sprite.sprites.splice(i, 1);

        Sprite.sprites[i].update(dt);
        
        if(player.checkCollide(Sprite.sprites[i])) Sprite.sprites[i].collide(player);
        else Sprite.sprites[i].uncollide(player);

    }

    //Check for ground crash
    if(player.checkGroundCollision()) endGame(); 

    renderer.render(player, Sprite.sprites, Sprite.backgroundSprites);

    //Update DOM Score and Fuel level
    document.getElementById("score").innerText = "Score " + (Math.floor(player.score)).toString();
    document.getElementById("fuelLevel").style.width = parseFloat(player.fuel)+"%";
}



//LAUNCH GAME

init();

interval = setInterval(()=>{
    frame();
}, 16);