class Vegetation extends Sprite{
    static selectVegetation(){
        let w, h, texture;
        switch(Math.floor(Math.random()*3)){
            case 0:
                w=17;
                h=29;
                texture = "assets/vegetation/tree1.png";
                break;
            case 1:
                w=18;
                h=30;
                texture = "assets/vegetation/tree2.png";
                break;
            case 2:
                w=25;
                h=30;
                texture = "assets/vegetation/tree3.png";
                break;
        }
        return [w, h, texture];
    }

    constructor(x, y){
        let [w, h, texture] = Vegetation.selectVegetation();

        super(x, y, w, h);
        this.addTexture(texture);

        Sprite.pushSprite(this);
    }
    
}