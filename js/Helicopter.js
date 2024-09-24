class Helicopter extends MovingSprite{
    constructor(x, y){
        super(x, y, 56, 20, -30, 0);
        this.addTexture("assets/vehicles/helicopter1.png");
        this.addTexture("assets/vehicles/helicopter2.png");

        this.textureChangeFrequency = 15;

        Sprite.pushSprite(this);
    }
}