class Game{

    //Globals
    static player;
    static renderer;

    //Frame managment
    static interval;
    static lastFrameDate;

    //Playing & Pausing managment
    static playing = false;
    static paused = false;

    //Audio managment
    static muted = true;
    static gameOverSound;

    static initInputs(){
        let canvas = document.getElementById("canvas");
    
        canvas.addEventListener("mousedown", ()=>{Game.player.throttle = true});
        canvas.addEventListener('mouseup', ()=>{Game.player.throttle = false});
    
        canvas.addEventListener("touchstart", ()=>{Game.player.throttle = true});
        canvas.addEventListener("touchend", ()=>{Game.player.throttle = false});
    
        window.addEventListener("resize", ()=>{Game.resetDisplay()});
    }
    
    static initGame(){
        Game.initInputs();
        Game.resetGame();
    
        Game.gameOverSound = document.createElement("audio");
        Game.gameOverSound.src = "assets/audio/gameover.wav";
        
        if(!Game.muted) Game.player.startAudio();
        
        Game.startMainLoop();
    }
    
    static resetGame(){
        Sprite.reset();
        Game.player = new Player(0, 50, 30, 20, 60, 0);
        Game.lastFrameDaye = Date.now();
    
        Game.resetDisplay();
    }
    
    static resetDisplay(){
        let canvas = document.getElementById("canvas");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        Game.rendered = new Renderer(canvas);
    }
    
    static computeDeltaTime(){
        let currentDate = Date.now();
        let dt = currentDate - Game.lastFrameDaye;
        Game.lastFrameDaye = currentDate;
        return dt/1000;
    }
    
    static generateCloud(){
        if(Cloud.lastRightBoundX < Game.player.x + MAX_WIDTH*0.9 && Math.random() > 0.2){
    
            let x = Game.player.x + MAX_DISPLAY_WIDTH;
            let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;
    
            new Cloud(x, y);
    
        }
    }
    
    static generateBirds(){
        if(Birds.lastRightBoundX < Game.player.x + MAX_WIDTH*0.2 && Math.random() > 0.05){
    
            let x = Game.player.x + MAX_DISPLAY_WIDTH;
            let y = Math.random()*MAX_HEIGHT/0.5 + 1.5*GROUND_HEIGHT;
    
            new Birds(x, y);
    
        }
    }
    
    static generateMountain(){
        let x = Game.player.x + MAX_DISPLAY_WIDTH;
        let y = -5;
        if(Mountain.lastRightBoundX < x && Math.random()<0.001){
            
            new Mountain(x, y);
    
        }
    }
    
    static generateAirport(){
        if(Game.player.fuel < 25 && Airport.lastRightBoundX < Game.player.x - 500){
    
            let newAirportX = (Sprite.getLastSprite().getRightBoundX() + 10);
            if(newAirportX < MAX_DISPLAY_WIDTH){
                newAirportX = Game.player.x + MAX_DISPLAY_WIDTH;
            }
    
            new Airport(newAirportX, -7)
    
        }
    }
    
    static generateSprite(){
        let spawnX = Game.player.x + MAX_DISPLAY_WIDTH;
    
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
    
    static frame(){
        let dt = Game.computeDeltaTime();
    
        Game.player.update(dt)
    
        //Generations
        Game.generateMountain();
        Game.generateCloud(); 
        Game.generateBirds();
    
        if(Game.playing && !Game.paused) {
            Game.generateSprite();
            Game.generateAirport();
        }
    
        //Background Sprites loop
        for (let i = 0; i < Sprite.backgroundSprites.length; i++) {
    
            //Delete background sprite if not visible anymore
            if(Sprite.backgroundSprites[i].x < Game.player.x - 5000) Sprite.backgroundSprites.splice(i, 1);
    
            Sprite.backgroundSprites[i].update(dt);
        
        }
    
        //Main Sprites loop
        for (let i = 0; i < Sprite.sprites.length; i++) {
    
            //Delete sprite if not visible anymore
            if(Sprite.sprites[i].x < Game.player.x - 5000) Sprite.sprites.splice(i, 1);
    
            Sprite.sprites[i].update(dt);
            
            if(Game.player.checkCollide(Sprite.sprites[i])) Sprite.sprites[i].collide(Game.player);
            else Sprite.sprites[i].uncollide(Game.player);
    
        }
    
        //Check for ground crash
        if(Game.player.checkGroundCollision()) Game.endGame(); 
    
        Game.rendered.render(Game.player, Sprite.sprites, Sprite.backgroundSprites);
    
        //Update DOM Score and Fuel level
        document.getElementById("score").innerText = "Score " + (Math.floor(Game.player.score)).toString();
        document.getElementById("fuelLevel").style.width = parseFloat(Game.player.fuel)+"%";
    }
    
    static startMainLoop(){
        Game.lastFrameDaye = Date.now();
        Game.interval = setInterval(()=>{
            Game.frame();
        }, 16);
    }
    
    static stopMainLoop(){
        clearInterval(Game.interval);
    }
    
    static startGame(){
        //Set playing and paused values
        Game.playing = true;
        Game.paused = false;
        
        if(!Game.muted) Game.player.startAudio();
    
        //Note: we don't need to start the main loop because it's already running because of the prelaunch animation
       
        //Hide the menu
        document.getElementById("menu").style.display = "none";
    }
    
    static restartGame(){
        Game.resetGame()
        
        //Set playing and paused values
        Game.playing = true;
        Game.paused = false;
    
        if(!Game.muted) Game.player.startAudio();
    
        Game.startMainLoop();
       
        //Hide the menu
        document.getElementById("menu").style.display = "none";
    }
    
    static endGame(){
        Game.playing = false;
        Game.paused = false;
    
        if(!Game.muted) Game.gameOverSound.play();
        Game.player.stopAudio();
    
        Game.stopMainLoop(Game.interval);
    
        //Show the menu
        document.getElementById("menuTitle").innerText = "Game Over";
        document.getElementById("menuStartBtn").onclick = ()=>Game.restartGame();
        document.getElementById("menuStartBtn").src = "assets/gui/restart_button.png";
        document.getElementById("menu").style.display = "flex";
    }
    
    static pauseGame(){
        Game.paused = true;
    
        Game.player.stopAudio();
    
        Game.stopMainLoop(Game.interval);
    
        document.getElementById("menuTitle").innerText = "Paused";
        document.getElementById("menuStartBtn").onclick = ()=>Game.resumeGame();
        document.getElementById("menuStartBtn").src = "assets/gui/play_button.png";
        document.getElementById("menu").style.display = "flex";
    }
    
    static resumeGame(){
        Game.paused = false;
    
        if(!Game.muted) Game.player.startAudio();
    
        Game.startMainLoop();
    
        document.getElementById("menu").style.display = "none";
    }
    
    static toggleMute(){
        if(Game.muted){
            Game.player.startAudio();
            document.getElementById("audioBtn").classList.remove("disabled");
        }else{
            Game.player.stopAudio();
            document.getElementById("audioBtn").classList.add("disabled");
        }
        Game.muted = !Game.muted;
    }
}