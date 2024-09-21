class Mountain extends Sprite{
    constructor(x, y, w, h, id){
        super(x, y, w, h);

        this.addTexture("assets/background/mountain" + id.toString() + ".png");

        Sprite.pushBackgroundSprite(this);
    }
}