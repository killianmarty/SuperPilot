class Mountain extends Sprite{

    static lastRightBoundX = 0;

    constructor(x, y, w, h, id){
        super(x, y, w, h);

        this.addTexture("assets/background/mountain" + id.toString() + ".png");

        Mountain.lastRightBoundX = this.x + this.w;

        Sprite.pushBackgroundSprite(this);
    }
}