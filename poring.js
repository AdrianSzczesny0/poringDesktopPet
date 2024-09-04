
const electron = require("electron");
const ipc = electron.ipcRenderer;
const browserWindow = require('electron').remote.BrowserWindow;

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const poringImg = new Image();
poringImg.src = "poring.png";
const mousePos ={
    x:0,
    y:0,
}
let gameFrame = 0;
onmousemove = function(e){
    mousePos.x = e.clientX;
    mousePos.y = e.clientY
    browserWindow.getFocusedWindow().close();
}
document.body.addEventListener('mousedown', ()=>{
        poring.isDragged = true;
    console.log('clicked');
})
onmousedown = function(e){
    poring.isDragged = true;
    console.log('clicked');
}
onmouseup = function(e){
    poring.isDragged = false;
}


const State = {
    IDLE:"IDLE",
    WALK:"WALK",
    ATTACK:"ATACK",
    DIE:"DIE",
    SPAWN:"SPAWN"
}


class Poring {
    constructor(context){
        this.ctx = context;
        this.x = 300;
        this.y = 300;
        this.width = 60;
        this.height = 60;
        this.currentFrame;
        this.state = State.IDLE;
        this.spriteWidth = 30;
        this.spriteHeight = 30;
        this.frameX = 4;
        this.frameY = 0;
        this.direction = 1;
        this.isDragged = false;
        this.canDrag = false;

    }





    isMouseOnPoring(){

        if (mousePos.x >= poring.x && mousePos.x <= poring.x+45){
            if(mousePos.y >= poring.y && mousePos.y <= poring.y+45){
                poring.canDrag = true;
                canvas.classList.add('grab');
            }else {
                this.canDrag = false;
                canvas.classList.remove('grab');
            }
        }else {
            this.canDrag=false;
            canvas.classList.remove('grab');
        }
    }

    drawIdle(){
        ctx.drawImage(poringImg,this.frameX * 60, 0, 60,60,this.x,this.y,60,60);
    }
    update(){
        this.isMouseOnPoring();
        if(this.isDragged && this.canDrag){
            // this.x = mousePos.x-30;
            // this.y = mousePos.y-30;
        }

        this.frameX++;
        if(this.frameX >=4){
            this.frameX = 0;
        }
    }
    draw(){
        if(this.state == State.IDLE){
            this.drawIdle();
        }
    }
}


function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
function animate(){
    gameFrame++;
    poring.update();
    if(gameFrame % 17 ==0){
        poring.update();
        clearCanvas();
        poring.draw();
    }
    // clearCanvas();
    requestAnimationFrame(animate);
}

const poring  =  new Poring(ctx);
animate();