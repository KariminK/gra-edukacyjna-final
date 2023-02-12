/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d");
let restartbtnimg = new Image();
restartbtnimg.src = "assets/restartbtn.png"
let pressA = false;
let pressD = false;
let timeToNewEnemy = 2500;
let gameover = false;
let score = 0;
let lifeCount = 3;
let enemies = [];

ctx.font = "50px Impact";

const enemyImgs = [{
    src: "assets/enemies/borowikKrolewski.png",
    poison: false,
}, {
    src: "assets/enemies/borowikSzatanski.png",
    poison: true,
}, {
    src: "assets/enemies/borowikSzlachetny.png",
    poison: false,
}, {
    src: "assets/enemies/czubajkaCzerwieniejaca.png",
    poison: false,
}, {
    src: "assets/enemies/helmowkaObrzezona.png",
    poison: true,
}, {
    src: "assets/enemies/kozlarzBabka.png",
    poison: false,
}, {
    src: "assets/enemies/maslakZwyczajny.png",
    poison: false,
}, {
    src: "assets/enemies/muchomorPlamisty.png",
    poison: true,
}, {
    src: "assets/enemies/muchomorZielonawy.png",
    poison: true,
}, {
    src: "assets/enemies/PieprznikJadalny.png",
    poison: false,
}, {
    src: "assets/enemies/PiestrzenicaKasztanowata.png",
    poison: true,
}, {
    src: "assets/enemies/strzepiakCeglasty.png",
    poison: true,
},];
const restartbtn = {
    width: 200,
    height: 100,
    x: canvas.width/2 - 100,
    y: 400,
}
class Enemy{
    constructor(){
        this.mushroomIndex = Math.floor(Math.random()*enemyImgs.length);
        this.size = 125;
        this.image = new Image();
        this.image.src = enemyImgs[this.mushroomIndex].src;
        this.poison = enemyImgs[this.mushroomIndex].poison;
        this.x = Math.random()*(canvas.width-this.size);
        this.y = 0-this.size;
        this.speed = 5;
        this.readyForDelete = false;
    }
    update(){
        this.y += this.speed;
        if (this.y > canvas.height-this.size/3) {
            console.log('ok');
            this.readyForDelete = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

class Player{
    constructor(){
        this.img = new Image();
        this.img.src = "assets/koszyk.png";
        this.width = 240;
        this.height = 110;
        this.x = 0;
        this.y = canvas.height-this.height;
        this.speed = 15;
    }
    update(){
        if(pressA && this.x > 0){
            this.x -= this.speed;
        }else if(pressD && this.x < canvas.width - this.width){
            this.x += this.speed;
        }
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if(e.x < this.x + this.width && e.x + e.size > this.x && e.y+e.size > this.y && e.y < this.y + this.width){
                delete enemies[i];
                if (e.poison) {
                    lifeCount--;
                }else{
                    score++;
                }
            };
        }
    }
    draw(){
        ctx.fillStyle = 'black';
        ctx.drawImage(this.img,this.x, this.y, this.width, this.height);
    }
}
class life{
    constructor(){
        this.img = new Image();
        this.img.src = "assets/hearthIcon.png";
        this.size = 64;
    }
    draw(){
        for(let i = 0; i<lifeCount; i++){
            ctx.drawImage(this.img, canvas.width-this.size*(3-i)-10, 5, this.size, this.size);
        }
        if(lifeCount < 1){
            gameover = true;
        }
    }
}

const drawScore = ()=>{
    ctx.fillStyle = 'black';
    ctx.fillText("Wynik: " + score, 20, 50);
    ctx.fillStyle = 'white';
    ctx.fillText("Wynik: " + score, 25, 55);
}
const mousemoveHandle = e=>{
    player1.x = e.offsetX-player1.width/2;
    if(gameover && e.offsetX < restartbtn.x+restartbtn.width && e.offsetX > restartbtn.x && e.offsetY < restartbtn.y + restartbtn.height && e.offsetY > restartbtn.y){
        console.log('kolizja');
        canvas.style.cursor = "pointer";
    }else{
        canvas.style.cursor = "initial";
    }
}

const drawGameOver = ()=>{
    ctx.font = "40px Impact";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'
    ctx.fillText("Przegrałeś! Twój wynik to: " + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText("Przegrałeś! Twój wynik to: " + score, canvas.width/2+5, canvas.height/2+5);
    ctx.drawImage(restartbtnimg, 0, 0, 300, 150, restartbtn.x, restartbtn.y, restartbtn.width, restartbtn.height);
}
window.addEventListener("keydown", keydownHandle = e=>{
    if (e.key == 'a') {
        pressA = true;
    }else if(e.key == 'd'){
        pressD = true
    }
})
window.addEventListener("keyup", keyupHandle = e=>{
    if(e.key == 'a'){
        pressA = false;
    }else if(e.key == 'd'){
        pressD = false;
    }
})
window.addEventListener('mousemove', mousemoveHandle)
window.addEventListener('touchmove', mousemoveHandle)
window.addEventListener('click', e=>{
    if(gameover && e.offsetX < restartbtn.x+restartbtn.width && e.offsetX > restartbtn.x && e.offsetY < restartbtn.y + restartbtn.height && e.offsetX > restartbtn.y){
        console.log('kolizja');
        location.reload();
    }
})
const player1 = new Player();
const life1 = new life();

setInterval(()=>{
    enemies.push(new Enemy());
    timeToNewEnemy -= 100;
}, timeToNewEnemy);
const animate = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    life1.draw();
    enemies = enemies.filter(e=>e.readyForDelete == false);
    enemies.forEach(e=>{e.update()});
    enemies.forEach(e=>{e.draw()});
    drawScore();
    player1.update();
    player1.draw();
    
    if(!gameover){
        requestAnimationFrame(animate);
    }else{
        drawGameOver();
    }
}
animate()