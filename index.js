const electron  = require("electron");
const ipc = electron.ipcRenderer



const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const poringImg = new Image();
poringImg.src = "poring.png";

const errorBTN = document.getElementById('errorBTN');
let isSend = false;
let gameFrame=0;
let contextMenu;


function updateContextMenuPosition(){
    if(contextMenu!=undefined){
        contextMenu.style.left = `${poring.x+50}px`;
        contextMenu.style.top = `${poring.y-120}px`;
    }
}
function removeContextMenu(){
    if(contextMenu != undefined){
        contextMenu.remove();
    }
}

const mousePos ={
    x:0,
    y:0,
}
onmousemove = function(e){
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    updateContextMenuPosition();
}
onmousedown = function(e){
    poring.isDragged = true;
    console.log('clicked');
    ipc.send('hover-off');
    if(isDragged = true && poring.canDrag == true){
        console.log('is dragged : true and canDrag: true');
        poring.state = State.DRAGGED;
    }else {
        removeContextMenu();
        contextMenu = undefined;
    }
    console.log(poring.state);
}
onmouseup = function(e){
    poring.isDragged = false;
    poring.state = State.IDLE;
}
document.addEventListener('contextmenu', () =>{
    if(poring.canDrag){
        console.log('CONTEXT CLICK');
        console.log(contextMenu);
        if(contextMenu==undefined){
            contextMenu = createContextMenu();
        }
    }
})
async function delay(time){
    return new Promise(resolve => setTimeout(resolve, time)); 
  }

const State = {
    IDLE:"IDLE",
    WALK:"WALK",
    ATTACK:"ATACK",
    DIE:"DIE",
    SPAWN:"SPAWN",
    DRAGGED:"DRAGGED",
    ROLLING:"ROLLING"
}

const Direction = {
    UP:"UP",
    DOWN:"DOWN",
    LEFT:"LEFT",
    RIGHT:"RIGHT"
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

class Poring {
    constructor(context){
        this.ctx = context;
        this.x = 0;
        this.y = 0;
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
        this.startPosition ={
            x:0,
            y:0
        }
        this.currentPosition = {
            x:0,
            y:0
        }
        this.targetPosition = {
            x:0,
            y:0
        }
        this.moveAnimation = {
            isMoving:false,
            isJumping:false,
            isFalling:false,
            moveTimer:0,
            jumpTimer:0
        }
        this.roll = {
            current:0,
            delay:200
        }
        this.idle = {
            current:0,
            delay:300
        }
        this.walk = {
            current:0,
            delay:30,
            direction:0
        }
        this.moveDelay = 100;
        this.rollDelay = 500;
    }

    isMouseOnPoring(){
        if (mousePos.x >= poring.x && mousePos.x <= poring.x+45){
            if(mousePos.y >= poring.y && mousePos.y <= poring.y+45){
                poring.canDrag = true;
                canvas.classList.add('grab');
                ipc.send('hover-on');
            }else {
                ipc.send('hover-off');
                this.canDrag = false;
                canvas.classList.remove('grab');
            }
        }else {
            this.canDrag=false;
            canvas.classList.remove('grab');
        }
        console.log(this.canDrag);
    }

    drawIdle(){        
        ctx.drawImage(poringImg,this.frameX * 60, 0, 60,60,this.x,this.y,60,60);
    }
    drawDragged(){
        ctx.drawImage(poringImg,50, 200, 60,60,this.x,this.y,60,60);
    }
    drawWalking(){
        ctx.drawImage(poringImg,this.frameX * 52, 60, 55,55,this.x,this.y,58,58);
    }

    updatePos(){
        this.isMouseOnPoring();
    }

    drag(){
        this.x = mousePos.x-30;
        this.y = mousePos.y-30;
    }

    update(){
        this.frameX++;
        if(this.state == State.IDLE){
            if(this.frameX >=4){
                this.frameX = 0;
            }
        }
        // if(this.state == State.WALK){
        //     if(this.frameX >=7){
        //         this.frameX = 0;
        //     } 
        // }

        
    }

    jump(){
        this.moveAnimation.isJumping
    }

    
    rollState(){
        let rolledState;
        if(this.state == State.ROLLING){
            // console.log(`roll time :  ${this.roll.current}`);
            this.roll.current++;
            if(this.roll.current>=this.roll.delay){
                rolledState = getRandomInt(2);
                this.roll.current = 0;
                console.log(`Rolled state: ${rolledState}`);
                if(this.roll.current == 0 ){
                    this.state = State.IDLE;
                }
                if(this.roll.current == 1 ){
                    this.state = State.WALK;
                }
            }
        }else if(this.state == State.IDLE){
            this.idle.current++;
            // console.log(`idle time :  ${this.idle.current}`);
            if(this.idle.current>=this.idle.delay){
                this.state = State.ROLLING;
                this.idle.current = 0;
            }
        }
    }
    moveLeft(){
        if(this.x >= canvas.width-100){
            console.log('cant move more to the right');
        }else{
            this.x++;
        }
    }
    moveRight(){
        if(this.x <= 100){
            console.log('cant move more to the left');
        }else{
            this.x--;
        }
    }
    moveDown(){
        if(this.y >= canvas.height-100){
            console.log('cant move Up');
        }else{
            this.y++;
        }
    }
    moveUp(){
        if(this.y <= 100){
            console.log('cant move more to the left');
        }else{
            this.y--;
        }
    }
    

    stateHandler(){
        // this.rollState();
        if(this.state == State.ROLLING){
            this.roll.current++;
            if(this.roll.current>=this.roll.delay){
                let rolledState = getRandomInt(2);
                console.log(`Rolled state: ${rolledState}`);
                if(rolledState == 0 ){
                    this.state = State.IDLE;
                }
                if(rolledState == 1 ){
                    this.state = State.WALK;
                }
            }
        }
        if(this.state == State.IDLE){
            this.idle.current++;
            // console.log(`idle time :  ${this.idle.current}`);
            if(this.idle.current>=this.idle.delay){
                this.state = State.ROLLING;
                this.idle.current = 0;
            }
        }
        if(this.state == State.DRAGGED){
            this.drag();
            console.log('DRAGGED');
        }
        if(this.state == State.DIE){
            console.log('DIE');
        }
        if(this.state == State.WALK){
            updateContextMenuPosition();
            this.walk.current++;
            console.log(`Direction state: ${this.walk.direction}`);
            switch (this.walk.direction) {
                case 0:
                    console.log('moving top left');
                    this.moveLeft();
                    this.moveUp();
                    break;
                case 1:
                    console.log('moving top');
                    this.moveUp();
                    break;
                case 2:
                    console.log('moving top right');
                    this.moveRight();
                    this.moveUp();
                    break;
                case 3:
                    console.log('moving right');
                    this.moveRight();
                    break;

                case 4:
                    console.log('moving bottom right');
                    this.moveDown();
                    this.moveRight();
                    break;
                case 5:
                    console.log('moving bottom');
                    this.moveDown();
                    break;
                case 6:
                    console.log('moving bottom left');
                    this.moveLeft();
                    this.moveDown();
                    break;
                case 7:
                    console.log('moving left');
                    this.moveLeft();
                    break;
                default:
                    break;
            }
            // console.log(`idle time :  ${this.idle.current}`);
            if(this.walk.current>=this.walk.delay){
                this.state = State.ROLLING;
                this.walk.current = 0;
                this.walk.direction = getRandomInt(8);
            }
            console.log('MOVE');
        }
    }
    draw(){
        if(this.state == State.IDLE || this.state == State.ROLLING){
            this.drawIdle();
        }
        if(this.state == State.DRAGGED){
            this.drawDragged();
        }
        if(this.state == State.WALK){
            this.drawWalking();
        }
    }
}

function createContextMenu(){
    this.html = `<div class="contextMenu">
    <div class="header"><span class="orb"></span></div>
    <div class="feed listItem">Feed</div>
    <div class="pet listItem">Pet</div>
    <div class="spank listItem">Spank</div>
    <div class="close listItem">Close</div>
    <div>`
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const webElement = template.content.firstElementChild;
    document.body.insertBefore(webElement,document.querySelector('.wrapper'));
    webElement.style.left = `${poring.x+50}px`;
    webElement.style.top = `${poring.y-120}px`;
    return webElement;
}


function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function animate(){
    // console.log(gameFrame);
    gameFrame++;
    poring.stateHandler();
    poring.updatePos();
    if(gameFrame % 17 ==0){
        poring.update();
        // console.log('test123');
    }
    clearCanvas();
    poring.draw();
    requestAnimationFrame(animate);
}

const poring  =  new Poring(ctx);
poring.state = State.ROLLING;
animate();
