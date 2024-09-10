class Helicopter extends MovingSprite{
    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h, vx, vy);
        this.addTexture("assets/vehicles/helicopter1.png");
        this.addTexture("assets/vehicles/helicopter2.png");

        this.textureChangeFrequency = 10;
    }
}