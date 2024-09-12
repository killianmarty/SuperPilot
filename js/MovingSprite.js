class MovingSprite extends Sprite{

    constructor(x, y, w, h, vx, vy){
        super(x, y, w, h);
        this.vx = vx;
        this.vy = vy;
    }

    update(dt){
        this.updateTextures(dt);

        this.x += this.vx*dt;
        this.y += this.vy*dt;
    }

}