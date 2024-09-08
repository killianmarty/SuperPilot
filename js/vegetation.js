class Vegetation extends Sprite{
    constructor(x, y, w, h, vx, vy, texture){
        super(x, y, w, h, vx, vy);
        this.addTexture(texture);
    }
}