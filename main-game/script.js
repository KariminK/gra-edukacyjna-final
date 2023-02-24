/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas1");
const infoImg = document.querySelector("#infoImg");
const nameTxt = document.querySelector("#name");
const seasonTxt = document.querySelector("#season");
const whereToFindTxt = document.querySelector("#whereToFind");
const poisonTxt = document.querySelector("#poison");
const infoContainer = document.querySelector(".infobox");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let restartbtnimg = new Image();
restartbtnimg.src = "assets/restartbtn.png"
let pressA = false;
let pressD = false;
let timeToNewEnemy = 2500;
let gameover = false;
let score = 0;
let acceleration = 10;
let maxAcc = 25;
let minTimeToNewEnemy = 500;
let lifeCount = 1000;
let enemies = [];

ctx.font = "50px Impact";
const ScoreUp = new Audio("assets/Coin01.mp3");
const ScoreDown = new Audio("assets/Coin02.mp3");
const gameOverSound = new Audio("assets/Alarm.mp3");
const enemyImgs = [{
    name: "Borowik Królewski",
    season: "Borowik królewski najczęściej produkuje owocniki od sierpnia do listopada, wyjątkowo już w maju lub czerwcu.",
    whereToFind: "Znaleźć go można w Europie, Chinach, Korei, Japonii i USA. W całej Europie borowik królewski jest niezwykle rzadki. W Polsce otrzymał status E – krytycznie zagrożonego wymarciem. Ciepłe lasy liściaste na podłożach alkalicznych. ",
    src: "assets/enemies/borowikKrolewski.png",
    poison: false,
}, {
    name: "Borowik Szatański",
    season: "Od lipca do września.",
    whereToFind: "Zdarza się na południu kraju, na ciepłych, widnych stanowiskach, głównie pod dębami i bukami.",
    src: "assets/enemies/borowikSzatanski.png",
    poison: true,
}, {
    name: "Borowik Szlachetny",
    season: "Od czerwca do października.",
    whereToFind: "Najczęściej w pobliżu świerków, sosen, buków czy też dębów. Najliczniej występują w górskich lasach świerkowych.",
    src: "assets/enemies/borowikSzlachetny.png",
    poison: false,
}, {
    name: "Czubajka Czerwieniejąca",
    season: "Czubajka czerwieniejąca rośnie w sezonie od czerwca do listopada.",
    whereToFind: "Czubajka czerwieniejąca rośnie we wszystkich typach lasów. Najczęściej spotkać tego grzyba można w ciepłych i suchych miejscach - w parkach, na polanach. ",
    src: "assets/enemies/czubajkaCzerwieniejaca.png",
    poison: false,
}, {
    name: "Hełmówka Obrzezona",
    season: "Od sierpnia do października.",
    whereToFind: "Najczęściej w pobliżu świerków, sosen, buków czy też dębów. Najliczniej występują w górskich lasach świerkowych.",
    src: "assets/enemies/helmowkaObrzezona.png",
    poison: true,
}, {
    name: "Koźlarz Babka",
    season: "Od lipca do listopada.",
    whereToFind: "To popularne grzyby jadalne w Polsce. Lubią niezbyt wilgotne podłoże, a doświadczeni grzybiarze doskonale wiedzą, że można je znaleźć wyłącznie blisko brzóz, z którymi żyją w pełnej symbiozie. I w pewnym sensie się do nich upodabniają.",
    src: "assets/enemies/kozlarzBabka.png",
    poison: false,
}, {
    name: "Maślak Zwyczajny",
    season: "Od maja do listopada.",
    whereToFind: "To popularne grzyby jadalne, występują powszechnie w całej Polsce z wyjątkiem wyższych partii górskich. Współpracują wyłącznie z sosnami, należy więc ich szukać w pobliżu tych drzew.",
    src: "assets/enemies/maslakZwyczajny.png",
    poison: false,
}, {
    name: "Muchomor Plamisty",
    season: "Muchomory plamiste rosną od lipca do października.",
    whereToFind: "Niestety to grzyb pospolity, najbardziej przyjaźni się z dębami, bukami, sosnami i świerkami.",
    src: "assets/enemies/muchomorPlamisty.png",
    poison: true,
}, {
    name: "Muchomor Zielonawy",
    season: "Muchomory sromotnikowe rosną od lipca do października.",
    whereToFind: "W naszych lasach niestety występuje powszechnie, wyrasta zwykle pod dębami, bukami, grabami i sosnami, pojedynczo lub w grupkach.",
    src: "assets/enemies/muchomorZielonawy.png",
    poison: true,
}, {
    name: "Pieprznik Jadalny",
    season: "Od maja do października.",
    whereToFind: "Pieprznik to dość powszechny i „towarzyski” grzyb. Lubi sąsiedztwo różnych drzew, szczególnie sosen, świerków, dębów, buków i grabów. Jeśli wypatrzysz jednego, rozejrzyj się wokół. Pieprzniki rosną w grupach i często tworzą tzw. czarcie kręgi",
    src: "assets/enemies/PieprznikJadalny.png",
    poison: false,
}, {
    name: "Piestrzenica Kasztanowata",
    season: "Od marca do maja.",
    whereToFind: "Występuje głównie pod świerkami i sosnami, na podłożu piaszczystym, często na gołej ziemi, zwykle w pobliżu resztek drewna i kory.",
    src: "assets/enemies/PiestrzenicaKasztanowata.png",
    poison: true,
}, {
    name: "Strzępiak Ceglasty",
    season: "Od czerwca do września.",
    whereToFind: "Wyrasta na wapiennym podłożu, głównie pod dębami, bukami, lipami i grabami, a także w ogrodach i parkach, na przydrożach.",
    src: "assets/enemies/strzepiakCeglasty.png",
    poison: true,
},];
const restartbtn = {
    width: 200,
    height: 100,
    x: canvas.width/2 - 100,
    y: canvas.height*0.6,
}
class Enemy{
    constructor(){
        this.mushroomIndex = Math.floor(Math.random()*enemyImgs.length);
        this.size = 125;
        this.image = new Image();
        this.image.src = enemyImgs[this.mushroomIndex].src;
        this.poison = enemyImgs[this.mushroomIndex].poison;
        this.name = enemyImgs[this.mushroomIndex].name;
        this.season = enemyImgs[this.mushroomIndex].season;
        this.whereToFind = enemyImgs[this.mushroomIndex].whereToFind;
        this.x = Math.random()*(canvas.width-this.size);
        this.y = 0-this.size;
        this.speed = acceleration;
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
                infoContainer.classList.remove("hide");
                nameTxt.innerText = e.name;
                seasonTxt.innerText = e.season;
                whereToFindTxt.innerText = e.whereToFind;
                infoImg.src = enemyImgs[e.mushroomIndex].src;
                if (e.poison) {
                    ScoreDown.play();
                    lifeCount--;
                    poisonTxt.classList.remove("no");
                    poisonTxt.innerText = "Tak"
                    poisonTxt.classList.add("yes");
                }else{
                    ScoreUp.play();
                    score++;
                    poisonTxt.classList.remove("yes");
                    poisonTxt.innerText = "Nie";
                    poisonTxt.classList.add("no");
                }
                delete enemies[i];
            };
            if(e.x < this.x + this.width && e.x + e.size > this.x && e.y+e.size > this.y && e.y < this.y + this.width){
                timeToNewEnemy-=25;
                acceleration+= 0.1;
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

// <setInterval(()=>{
//     enemies.push(new Enemy());
//     acceleration+= 0.5;
//     timeToNewEnemy -= 100;
// }, timeToNewEnemy);>
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
        gameOverSound.play();
        drawGameOver();
    }
}
animate()
const enemiestimer = ()=>{
    setTimeout(() => {
        enemies.push(new Enemy());
        enemiestimer();
        if(timeToNewEnemy < minTimeToNewEnemy){
            timeToNewEnemy = minTimeToNewEnemy;
        }
        if(acceleration > maxAcc){
            acceleration = maxAcc
        }
    }, timeToNewEnemy);
}
enemiestimer();