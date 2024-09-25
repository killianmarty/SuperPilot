class Sprite{

    static textureCache = {};

    static sprites = [];
    static backgroundSprites = [];

    static lastGeneration = 0;
    static generationFrequency = MIN_GENERATION_FREQUENCY;


    static updateLastGenerationDate(generationDate = Date.now()){
        Sprite.lastGeneration = generationDate;
        if(Sprite.generationFrequency < MAX_GENERATION_FREQUENCY){
            Sprite.generationFrequency += GENERATION_FREQUENCY_GAP;
        }
    }

    static getLastGenerationAge(){
        return Date.now() - Sprite.lastGeneration;
    }

    static pushSprite(sprite){
        Sprite.sprites.push(sprite);
        Sprite.updateLastGenerationDate();
    }

    static pushBackgroundSprite(backgroundSprite){
        Sprite.backgroundSprites.push(backgroundSprite);
    }

    static getLastSprite(){
        return Sprite.sprites[Sprite.sprites.length-1];
    }

    static reset(){
        Sprite.sprites = [];
        Sprite.backgroundSprites = []
        Sprite.lastGeneration = 0;
        Sprite.generationFrequency = MIN_GENERATION_FREQUENCY;
    }

    
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.orientation = 0;

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
    }

    checkCollide(sprite){
        return (this.x + this.w >= sprite.x && this.x <= sprite.x + sprite.w && this.y + this.h >= sprite.y && this.y <= sprite.y + sprite.h)
    }

    collide(sprite){
        Game.endGame();
        return;
    }

    uncollide(sprite){
        return;
    }

    addTexture(src){

        if(!Sprite.textureCache[src]){
            let tmpTexture = new Image();
            tmpTexture.src = src;
            Sprite.textureCache[src] = tmpTexture;
        }

        this.textures.push(Sprite.textureCache[src]);
        this.currentTextureIndex = 0;
        this.currentTexture = this.textures[0];

    }

    getRightBoundX(){
        return this.x + this.w;
    }

}