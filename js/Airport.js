class Airport extends MovingSprite{

    static lastAirportX = 0;

    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h, vx, vy);
        lastAirportX = x;
        this.addTexture("assets/buildings/airport.png");
    }

    collide(sprite){
        sprite.landed = (sprite.y <= 0 && sprite.vy > GROUND_CRASH_SEIL);
    }

    uncollide(sprite){
        sprite.landed = false;
    }
}