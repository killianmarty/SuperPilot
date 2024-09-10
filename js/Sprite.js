let texturesLoader = {};

class Sprite{

    static textureCache = {};
    
    constructor(x, y, w, h, vx, vy){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        // this.vx = vx;
        // this.vy = vy;
        // this.orientation = 0;

        this.textures = new Array();
        this.textureChangeFrequency = 0;
        this.currentTextureIndex = -1;
        this.currentTextureAge = 0;
        this.currentTexture = undefined;
    }

    updateTextures(dt){
        this.currentTextureAge += dt;
        if(this.textures.length > 1 && this.textureChangeFrequency > 0){
            if(this.currentTextureAge > 1/this.textureChangeFrequency){
                this.currentTextureIndex = (this.currentTextureIndex + 1) % this.textures.length;
                this.currentTextureAge = 0;
                this.currentTexture = this.textures[this.currentTextureIndex];
            }
        }
    }

    update(dt){
        this.updateTextures(dt);

        // this.x += this.vx*dt;
        // this.y += this.vy*dt;
    }

    checkCollide(sprite){
        return (this.x + this.w >= sprite.x && this.x <= sprite.x + sprite.w && this.y + this.h >= sprite.y && this.y <= sprite.y + sprite.h)
    }

    collide(sprite){
        endGame();
        return;
    }

    addTexture(src){

        if(Sprite.textureCache[src]){
            this.textures.push(Sprite.texturesCache[src]);
        }else{
            let tmpTexture = new Image();
            tmpTexture.src = src;
            Sprite.textureCache[src] = tmpTexture;
            this.textures.push(tmpTexture);
        }
        
        this.currentTextureIndex = 0;
        this.currentTexture = this.textures[0];
        
    }

}