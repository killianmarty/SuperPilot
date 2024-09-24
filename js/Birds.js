class Birds extends MovingSprite{

    static lastRightBoundaryX = 0;

    constructor(x, y, vx, vy){
        super(x, y, 40, 30, vx, vy);
        Birds.lastRightBoundaryX = this.x + this.w;

        this.addTexture("assets/background/birds1.png");
        this.addTexture("assets/background/birds2.png");

        this.textureChangeFrequency = 8;

        Sprite.pushBackgroundSprite(this);
    }
}