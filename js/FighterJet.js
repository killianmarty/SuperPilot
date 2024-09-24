class FighterJet extends MovingSprite{
    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h, vx, vy);
        this.addTexture("assets/vehicles/fighter_jet.png");

        Sprite.pushSprite(this);
    }
}