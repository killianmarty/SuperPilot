class Baloon extends MovingSprite{

    constructor(x, y){
        super(x, y, 26, 40, -10, 0);
        this.addTexture("assets/vehicles/baloon.png");

        Sprite.pushSprite(this);
    }
    
}