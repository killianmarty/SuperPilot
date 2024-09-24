class Cloud extends Sprite{

    static lastRightBoundaryX = 0;

    constructor(x, y, w, h){
        super(x, y, w, h);
        Cloud.lastRightBoundaryX = this.x + this.w;

        let id = (Math.floor(Math.random()*7) + 1);
        this.addTexture("assets/background/cloud" + id.toString() + ".png");

        Sprite.pushBackgroundSprite(this);
    }
}