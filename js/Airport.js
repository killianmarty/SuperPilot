class Airport extends MovingSprite{
    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h, vx, vy);
        this.addTexture("assets/buildings/airport.png");
    }

    collide(sprite){
        sprite.landed = (sprite.y <= 0 && sprite.vy > GROUND_CRASH_SEIL);
    }

    uncollide(sprite){
        sprite.landed = false;
    }
}