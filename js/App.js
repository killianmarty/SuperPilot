//Globals
let player;
let renderer;

//Frame managment
let interval;
let lastFrameDate;

//Playing & Pausing managment
let playing = false;
let paused = false;
let muted = true;

//Audio managment
let gameOverSound;

function initInputs(){
    let canvas = document.getElementById("canvas");

    canvas.addEventListener("mousedown", ()=>{player.throttle = true});
    canvas.addEventListener('mouseup', ()=>{player.throttle = false});

    canvas.addEventListener("touchstart", ()=>{player.throttle = true});
    canvas.addEventListener("touchend", ()=>{player.throttle = false});

    window.addEventListener("resize", ()=>{resetDisplay()});
}

function initGame(){
    initInputs();
    resetGame();

    gameOverSound = document.createElement("audio");
    gameOverSound.src = "assets/audio/gameover.wav";
    
    if(!muted) player.startAudio();
    
    startMainLoop();
}

function resetGame(){
    Sprite.reset();
    player = new Player(0, 50, 30, 20, 60, 0);
    lastFrameDate = Date.now();

    resetDisplay();
}

function resetDisplay(){
    let canvas = document.getElementById("canvas");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    renderer = new Renderer(canvas);
}

function computeDeltaTime(){
    let currentDate = Date.now();
    let dt = currentDate - lastFrameDate;
    lastFrameDate = currentDate;
    return dt/1000;
}

function generateCloud(){
    if(Cloud.lastRightBoundaryX < player.x + MAX_WIDTH*0.9 && Math.random() > 0.2){

        let x = player.x + MAX_DISPLAY_WIDTH;
        let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;

        new Cloud(x, y, 40, 30);

    }
}

function generateBirds(){
    if(Birds.lastRightBoundaryX < player.x + MAX_WIDTH*0.2 && Math.random() > 0.05){

        let x = player.x + MAX_DISPLAY_WIDTH;
        let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;

        new Birds(x, y, 40, 30, -10, 0);

    }
}

function generateMountain(){
    let x = player.x + MAX_DISPLAY_WIDTH;
    let y = -5;
    if(Mountain.lastRightBoundX < x && Math.random()<0.001){
        
        switch(Math.floor(Math.random()*5) + 1){
            case 1:
                new Mountain(x, y, 384, 100, 1);
                break;
            case 2:
                new Mountain(x, y, 265, 114, 2);
                break;
            case 3:
                new Mountain(x, y, 384, 130, 3);
                break;
            case 4:
                new Mountain(x, y, 192, 192, 4);
                break;
            case 5:
                new Mountain(x, y, 386, 100, 5);
                break;
            default:
                break;
        }
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
                case "FighterJet":
                    new FighterJet(player.x + MAX_DISPLAY_WIDTH, MAX_HEIGHT - newSpriteData.height - Math.random() * 30, newSpriteData.width, newSpriteData.height, -70, 0)
                    break;
                default:
                    break;
                
            }
        }
    }
}

function frame(){
    let dt = computeDeltaTime();

    player.update(dt)

    //Generations
    generateMountain();
    generateCloud(); 
    generateBirds();

    
    if(playing && !paused) {
        generateSprite();
        generateAirport();
    }

    //Background Sprites loop
    for (let i = 0; i < Sprite.backgroundSprites.length; i++) {

        //Delete background sprite if not visible anymore
        if(Sprite.backgroundSprites[i].x < player.x - 5000) Sprite.backgroundSprites.splice(i, 1);

        Sprite.backgroundSprites[i].update(dt);
    
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

function startMainLoop(){
    lastFrameDate = Date.now();
    interval = setInterval(()=>{
        frame();
    }, 16);
}

function stopMainLoop(){
    clearInterval(interval);
}

function startGame(){
    //Set playing and paused values
    playing = true;
    paused = false;
    
    if(!muted) player.startAudio();

    //Note: we don't need to start the main loop because it's already running because of the prelaunch animation
   
    //Hide the menu
    document.getElementById("menu").style.display = "none";
}

function restartGame(){
    resetGame()
    
    //Set playing and paused values
    playing = true;
    paused = false;

    if(!muted) player.startAudio();

    startMainLoop();
   
    //Hide the menu
    document.getElementById("menu").style.display = "none";
}

function endGame(){
    playing = false;
    paused = false;

    if(!muted) gameOverSound.play();
    player.stopAudio();

    stopMainLoop(interval);

    //Show the menu
    document.getElementById("menuTitle").innerText = "Game Over";
    document.getElementById("menuStartBtn").onclick = ()=>restartGame();
    document.getElementById("menuStartBtn").src = "assets/gui/restart_button.png";
    document.getElementById("menu").style.display = "flex";
}

function pauseGame(){
    paused = true;

    player.stopAudio();

    stopMainLoop(interval);

    document.getElementById("menuTitle").innerText = "Paused";
    document.getElementById("menuStartBtn").onclick = ()=>resumeGame();
    document.getElementById("menuStartBtn").src = "assets/gui/play_button.png";
    document.getElementById("menu").style.display = "flex";
}

function resumeGame(){
    paused = false;

    if(!muted) player.startAudio();

    startMainLoop();

    document.getElementById("menu").style.display = "none";
}

function toggleMute(){
    if(muted){
        player.startAudio();
        document.getElementById("audioBtn").classList.remove("disabled");
    }else{
        player.stopAudio();
        document.getElementById("audioBtn").classList.add("disabled");
    }
    muted = !muted;
}


//LAUNCHING THE GAME

initGame();