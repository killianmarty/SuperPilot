class Birds extends MovingSprite{

    static lastRightBoundX = 0;

    constructor(x, y){
        super(x, y, 40, 30, -10, 0);
        Birds.lastRightBoundX = this.getRightBoundX();

        this.addTexture("assets/background/birds1.png");
        this.addTexture("assets/background/birds2.png");

        this.textureChangeFrequency = 8;

        Sprite.pushBackgroundSprite(this);
    }
    
}