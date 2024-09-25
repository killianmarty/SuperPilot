class Cloud extends Sprite{

    static lastRightBoundX = 0;

    constructor(x, y){
        super(x, y, 40, 30);
        Cloud.lastRightBoundX = this.getRightBoundX();

        let id = (Math.floor(Math.random()*7) + 1);
        this.addTexture("assets/background/cloud" + id.toString() + ".png");

        Sprite.pushBackgroundSprite(this);
    }
}