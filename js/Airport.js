class Airport extends MovingSprite{
    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h, vx, vy);
        this.addTexture("assets/buildings/airport.png");
    }

    collide(sprite){
        if(sprite.landed == true) sprite.fuel = 100;
    }

    checkCollide(sprite){
        return false;
    }
}