class Building extends Sprite{
    
    static select(){
        let w, h, texture;
        switch(Math.floor(Math.random()*14)){
            case 0:
                w=75;
                h=38;
                texture = "assets/buildings/house1.png";
                break;
            case 1:
                w=39;
                h=36;
                texture = "assets/buildings/house2.png";
                break;
            case 2:
                w=35;
                h=47;
                texture = "assets/buildings/house3.png";
                break;
            case 3:
                w=40;
                h=35;
                texture = "assets/buildings/house4.png";
                break;
            case 4:
                w=69;
                h=91;
                texture = "assets/buildings/house5.png";
                break;
            case 5:
                w=54;
                h=141;
                texture = "assets/buildings/tower1.png";
                break;
            case 6:
                w=54;
                h=143;
                texture = "assets/buildings/tower2.png";
                break;
            case 7:
                w=36;
                h=71;
                texture = "assets/buildings/tower3.png";
                break;
            case 8:
                w=72;
                h=144;
                texture = "assets/buildings/tower4.png";
                break;
            case 9:
                w=39;
                h=124;
                texture = "assets/buildings/tower5.png";
                break;
            case 10:
                w=33;
                h=130;
                texture = "assets/buildings/tower6.png";
                break;
            case 11:
                w=25;
                h=125;
                texture = "assets/buildings/tower7.png";
                break;
            case 12:
                w=40;
                h=101;
                texture = "assets/buildings/tower8.png";
                break;
            case 13:
                w=46;
                h=82;
                texture = "assets/buildings/tower9.png";
                break;
        }
        return [w, h, texture];
    }
    
    constructor(x, y){
        let [w, h, texture] = Building.select();

        super(x, y, w, h);
        this.addTexture(texture);

        Sprite.pushSprite(this);
    }
}