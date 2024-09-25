class FighterJet extends MovingSprite{

    constructor(x, y){
        super(x, y, 40, 21, -70, 0);
        
        this.addTexture("assets/vehicles/fighter_jet.png");

        Sprite.pushSprite(this);
    }

}