class Mountain extends Sprite{

    static lastRightBoundX = 0;

    static select(){
        let w, h, texture;
        switch(Math.floor(Math.random()*5) + 1){
            case 1:
                w=384;
                h=100;
                texture = "assets/background/mountain1.png";
                break;
            case 2:
                w=265;
                h=114;
                texture = "assets/background/mountain2.png";
                break;
            case 3:
                w=384;
                h=130;
                texture = "assets/background/mountain3.png";
                break;
            case 4:
                w=192;
                h=192;
                texture = "assets/background/mountain4.png";
                break;
            case 5:
                w=386;
                h=100;
                texture = "assets/background/mountain5.png";
                break;
            default:
                break;
        }
        return [w, h, texture];
    }

    constructor(x, y){
        let [w, h, texture] = Mountain.select();

        super(x, y, w, h);
        Mountain.lastRightBoundX = this.getRightBoundX();

        this.addTexture(texture);

        Sprite.pushBackgroundSprite(this);
    }
    
}