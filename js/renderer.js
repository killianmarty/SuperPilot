const MAX_DISPLAY_WIDTH = MAX_WIDTH + PLAYER_DISPLAY_X;
const MAX_DISPLAY_HEIGHT = MAX_HEIGHT + GROUND_HEIGHT;

class Renderer{

    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.horizontalRatio = canvas.width / MAX_DISPLAY_WIDTH;
        this.verticalRatio = canvas.height / MAX_DISPLAY_HEIGHT;
    }

    getDisplayPosition(x, y, w, h){
        let newX = (x + PLAYER_DISPLAY_X) * this.verticalRatio;
        let newY = (MAX_HEIGHT - y - h)* this.verticalRatio;
        let newW = w * this.verticalRatio;
        let newH = h * this.verticalRatio;
        return {x: newX, y: newY, w: newW, h: newH};
    }

    drawTexture(texture, position, orientation){
        this.ctx.beginPath();
        this.ctx.save()
        this.ctx.translate(position.x + position.w/2, position.y + position.h/2);
        this.ctx.rotate(orientation);

        if(texture != undefined && texture.complete){
            this.ctx.drawImage(texture, -position.w/2, -position.h/2, position.w, position.h);
        }else{
            this.ctx.rect(-position.w/2, -position.h/2, position.w, position.h);
        }

        this.ctx.fill();
        this.ctx.restore();
        this.ctx.closePath();
    }

    renderGround(){
        this.ctx.fillStyle = "green";
        this.drawTexture(undefined, {x: 0, y: this.canvasHeight - GROUND_HEIGHT * this.verticalRatio, w: this.canvasWidth, h: GROUND_HEIGHT * this.verticalRatio}, 0);
    }

    renderPlayer(player){
        
        let playerDisplayPos = this.getDisplayPosition(0, player.y, player.w, player.h);
        this.drawTexture(player.currentTexture, playerDisplayPos, -player.orientation);

    }

    renderSprite(sprite, referenceX){
        this.ctx.fillStyle = "black";
        let spriteDisplayPos = this.getDisplayPosition(sprite.x - referenceX, sprite.y, sprite.w, sprite.h);
        this.drawTexture(sprite.currentTexture, spriteDisplayPos, sprite.orientation);
    }

    render(player, sprites){
        let referenceX = player.x;

        //clear ctx
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        //render ground
        this.renderGround();
        
        //draw sprites
        sprites.forEach(sprite => {
            this.renderSprite(sprite, referenceX);
        });

        //draw player
        this.renderPlayer(player);
    }

}