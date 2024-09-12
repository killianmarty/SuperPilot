class Cloud extends Sprite{

    static lastCloudX = 0;

    constructor(x, y, w, h){
        super(x, y, w, h);
        let id = (Math.floor(Math.random()*7) + 1);
        this.addTexture("assets/background/cloud" + id.toString() + ".png");
    }
}