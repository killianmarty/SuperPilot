class Airport extends Sprite{

    static lastAirportX = 0;

    constructor(x, y, w, h){
        super(x, y, w, h);
        Airport.lastAirportX = x;
        this.addTexture("assets/buildings/airport.png");

        Sprite.pushSprite(this);
    }

    collide(sprite){
        sprite.landed = (sprite.y <= 0 && sprite.vy > GROUND_CRASH_SEIL);
    }

    uncollide(sprite){
        sprite.landed = false;
    }
}