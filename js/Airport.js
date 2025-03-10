class Airport extends Sprite{

    static lastRightBoundX = 0;

    constructor(x, y){
        super(x, y, 490, 112);
        Airport.lastRightBoundX = this.getRightBoundX();
        
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