//Globals
let player;
let renderer;

//Frame managment
let interval;
let lastFrameDate;

//Playing & Pausing managment
let playing = false;
let paused = false;

//Audio managment
let muted = true;
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
    if(Cloud.lastRightBoundX < player.x + MAX_WIDTH*0.9 && Math.random() > 0.2){

        let x = player.x + MAX_DISPLAY_WIDTH;
        let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;

        new Cloud(x, y);

    }
}

function generateBirds(){
    if(Birds.lastRightBoundX < player.x + MAX_WIDTH*0.2 && Math.random() > 0.05){

        let x = player.x + MAX_DISPLAY_WIDTH;
        let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;

        new Birds(x, y);

    }
}

function generateMountain(){
    let x = player.x + MAX_DISPLAY_WIDTH;
    let y = -5;
    if(Mountain.lastRightBoundX < x && Math.random()<0.001){
        
        new Mountain(x, y);

    }
}

function generateAirport(){
    if(player.fuel < 25 && Airport.lastRightBoundX < player.x - 500){

        let newAirportX = (Sprite.getLastSprite().getRightBoundX() + 10);
        if(newAirportX < MAX_DISPLAY_WIDTH){
            newAirportX = player.x + MAX_DISPLAY_WIDTH;
        }

        new Airport(newAirportX, -7)

    }
}

function generateSprite(){
    let spawnX = player.x + MAX_DISPLAY_WIDTH;

    if(Sprite.getLastGenerationAge() > 1000/Sprite.generationFrequency){
        if(Sprite.sprites.length == 0 || Sprite.getLastSprite().getRightBoundX() < spawnX){
            
            let rand = Math.floor(Math.random()*21);

            if(rand <= 14) new Building(spawnX, (-Math.random()*4));
            else if(rand <= 17) new Vegetation(spawnX, -7);
            else if(rand <= 18) new Baloon(spawnX, (MIN_VEHICLE_GENERATION_HEIGHT + Math.random() * VEHICLE_GENERATION_HEIGHT_GAP));
            else if(rand <= 19) new Helicopter(spawnX, (MIN_VEHICLE_GENERATION_HEIGHT + Math.random() * VEHICLE_GENERATION_HEIGHT_GAP));
            else if(rand <= 20) new FighterJet(spawnX, (MIN_VEHICLE_GENERATION_HEIGHT + Math.random() * VEHICLE_GENERATION_HEIGHT_GAP));

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