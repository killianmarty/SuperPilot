class Player extends MovingSprite{
    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h, vx, vy);
        this.fuel = 29;
        this.throttle = false;
        this.landed = false;
        this.score = 0;

        this.addTexture("assets/vehicles/plane.png");

        this.initAudio();
    }

    initAudio() {
        this.audio = document.createElement("audio");
        this.audio.src = "assets/audio/plane.wav";
        this.audio.loop = true;
        this.audio.play();
    }

    checkGroundCollision(){
        return (this.y <= 0 && !this.landed)
    }

    //Overide to reduce the hitbox
    checkCollide(sprite){
        let horizontalReduction = 0.75
        let verticalReduction = 0.50
        let x = this.x + this.w * horizontalReduction/2;
        let y = this.y + this.h * verticalReduction/2;
        let w = this.w * (1-horizontalReduction);
        let h = this.h * (1-verticalReduction);
        return (x + w >= sprite.x && x <= sprite.x + sprite.w && y + h >= sprite.y && y <= sprite.y + sprite.h)
    }

    update(dt){
        this.updateTextures();

        if (this.audio) {
            let pitch = this.throttle > 0 ? 0.5 : 2;
            let volume = this.orientation / (MAX_UP_ROTATION * 3) + 0.8
            if(volume > 1) volume = 1;
            if(volume < 0) volume = 0;
            this.audio.playbackRate = pitch;
            this.audio.volume = volume;
        }

        if(this.throttle && this.orientation < MAX_UP_ROTATION && this.fuel > 0){
            this.fuel -= FUEL_PERCENT_PER_SECOND * dt;
            this.vy += GRAVITY * dt;
            this.landed = false;
        }else{
            this.vy -= GRAVITY * dt;
        }

        this.x += this.vx*dt;
        this.y += this.vy*dt;

        this.orientation = Math.atan(this.vy/this.vx);
        this.score = this.x * SCORE_PER_PIXEL;

        
        //Landing managment
        if(this.landed){
            this.fuel = Math.min(this.fuel + REFUEL_PERCENT_PER_SECOND * dt);
            this.y=0;
            this.vy = 0;
            this.orientation = 0;
        }

        //Max height managment
        if(this.y + this.h > MAX_HEIGHT){
            this.y = MAX_HEIGHT - this.h;
            this.vy = 0;
            this.orientation = 0;
        }

    }

}