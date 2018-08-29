var redBombAnim;
var flashBombAnim;
var blackBombAnim;
var blackGoalImg;
var redGoalImg;

var goalWallWidth = 3;
var redGoal;
var redTopWall;
var redRightWall;
var redLeftWall;
var redBottomWall;
var blackGoal;
var blackTopWall;
var blackRightWall;
var blackLeftWall;
var blackBottomWall;
var bombHolder;

var wallWidth = 40;
var topWall;
var rightWall;
var leftWall;
var bottomWall;

var bombs = [];

var startTime;
var spawnCooldown = 2000;

var maxSpeed = 2;
var maxLife = 500;

var gameover = false;

var target;

function preload(){
    redBombAnim = loadAnimation("sprites/red_bomb001.png", "sprites/red_bomb002.png", "sprites/red_bomb003.png");
    flashBombAnim = loadAnimation("sprites/flash_bomb001.png", "sprites/flash_bomb002.png", "sprites/flash_bomb003.png");
    blackBombAnim = loadAnimation("sprites/black_bomb001.png", "sprites/black_bomb002.png", "sprites/black_bomb003.png");
    redGoalImg = loadImage("sprites/red_zone.png");
    blackGoalImg = loadImage("sprites/black_zone.png");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    noSmooth();
    
    startTime = millis();

    target = null;
    mouseDown = false;

    //#region Walls
    topWall = createSprite(width / 2, -wallWidth / 2, width, wallWidth);
    topWall.immovable = true;
    topWall.setCollider("rectangle");
    rightWall = createSprite(width + wallWidth / 2, height / 2, wallWidth, height);
    rightWall.immovable = true;
    rightWall.setCollider("rectangle");
    leftWall = createSprite(-wallWidth / 2, height / 2, wallWidth, height);
    leftWall.immovable = true;
    leftWall.setCollider("rectangle");
    bottomWall = createSprite(width / 2, height + wallWidth / 2, width, wallWidth);
    bottomWall.immovable = true;
    bottomWall.setCollider("rectangle");
    //#endregion

    //Goals

    //#region Red Goal
    redGoal = createSprite(width * .03 + redGoalImg.width / 2, height / 2);
    redGoal.addImage(redGoalImg);
    redTopWall = createSprite(redGoal.position.x, redGoal.position.y - redGoal.height / 2 + goalWallWidth / 2, redGoal.width, goalWallWidth);
    redTopWall.immovable = true;
    redTopWall.visible = false;
    redBottomWall = createSprite(redGoal.position.x, redGoal.position.y + redGoal.height / 2 - goalWallWidth / 2, redGoal.width, goalWallWidth);
    redBottomWall.immovable = true;
    redBottomWall.visible = false;
    redRightWall = createSprite(redGoal.position.x + redGoal.width / 2 - goalWallWidth / 2, redGoal.position.y, goalWallWidth, redGoal.height);
    redRightWall.immovable = true;
    redRightWall.visible = false;
    redLeftWall = createSprite(redGoal.position.x - redGoal.width / 2 + goalWallWidth / 2, redGoal.position.y, goalWallWidth, redGoal.height);
    redLeftWall.immovable = true;
    redLeftWall.visible = false;
    //#endregion

    //#region Black Goal
    blackGoal = createSprite(width - (width * .03) - blackGoalImg.width / 2, height / 2);
    blackGoal.addImage(blackGoalImg);
    blackGoal.immovable = true;
    blackTopWall = createSprite(blackGoal.position.x, blackGoal.position.y - blackGoal.height / 2 + goalWallWidth / 2, blackGoal.width, goalWallWidth);
    blackTopWall.immovable = true;
    blackTopWall.visible = false;
    blackBottomWall = createSprite(blackGoal.position.x, blackGoal.position.y + blackGoal.height / 2 - goalWallWidth / 2, blackGoal.width, goalWallWidth);
    blackBottomWall.immovable = true;
    blackBottomWall.visible = false;
    blackRightWall = createSprite(blackGoal.position.x + blackGoal.width / 2 - goalWallWidth / 2, blackGoal.position.y, goalWallWidth, blackGoal.height);
    blackRightWall.immovable = true;
    blackRightWall.visible = false;
    blackLeftWall = createSprite(blackGoal.position.x - blackGoal.width / 2 + goalWallWidth / 2, blackGoal.position.y, goalWallWidth, blackGoal.height);
    blackLeftWall.immovable = true;
    blackLeftWall.visible = false;
    //#endregion

    bombHolder = new Bomb();
    if(random() < 0.5){
        bombHolder.setColor("red");
    }else{
        bombHolder.setColor("black");
    }
    bombs.push(bombHolder);
}

function draw(){
    background('#0f9581');

    if(target != null){
        target.sprite.position.x = mouseX;
        target.sprite.position.y = mouseY;
    }

    if(!gameover){
        if(millis() - startTime > spawnCooldown){
            startTime = millis();
            bombHolder = new Bomb();
            if(random() < 0.5){
                bombHolder.setColor("red");
            }else{
                bombHolder.setColor("black");
            }
            bombs.push(bombHolder);

            if(spawnCooldown > 500){
                spawnCooldown -= 20;
            }
        }
    }else{
        bombs.forEach((bomb) => {
            bomb.sprite.remove();
        })
    }

    updateBombs();
    drawSprites();
}

function updateBombs(){
    for(let i = 0; i < bombs.length; i++){
        let current = bombs[i].sprite;

        if(current.life < maxLife * .5 && !bombs[i].flashing){
            let frame = current.animation.getFrame();
            bombs[i].flashingTime = millis();
            bombs[i].flashingDuration = current.life;
            bombs[i].flashing = true;

            current.changeAnimation("flash");
            current.animation.changeFrame(frame);
        }

        if(bombs[i].flashing && millis() - bombs[i].flashingTime > bombs[i].flashingDuration){
            let frame = current.animation.getFrame();
            current.changeAnimation("default");
            current.animation.changeFrame(frame);
        }

        if(bombs[i].flashing && millis() - bombs[i].flashingTime > bombs[i].flashingDuration * 2){
            bombs[i].flashing = false;
        }

        if(current.life == 0){
            gameover = true;
        }

        current.bounce(rightWall);
        current.bounce(topWall);
        current.bounce(bottomWall);
        current.bounce(leftWall);

        if(target != null){
            if(current != target.sprite){
                current.bounce(redTopWall);
                current.bounce(redBottomWall);
                current.bounce(redLeftWall);
                current.bounce(redRightWall);
                current.bounce(blackTopWall);
                current.bounce(blackBottomWall);
                current.bounce(blackLeftWall);
                current.bounce(blackRightWall);
            }
        }else{
            current.bounce(redTopWall);
            current.bounce(redBottomWall);
            current.bounce(redLeftWall);
            current.bounce(redRightWall);
            current.bounce(blackTopWall);
            current.bounce(blackBottomWall);
            current.bounce(blackLeftWall);
            current.bounce(blackRightWall);
        }
    }
}

function mousePressed(){
    for(let i = 0; i < bombs.length; i++){
        if(bombs[i].sprite.overlapPoint(mouseX, mouseY)){
            if(target == null){
                target = bombs[i];
            }
        }
    }
}

function mouseReleased(){
    if(target != null){
        if(redGoal.overlapPoint(mouseX, mouseY) || blackGoal.overlapPoint(mouseX, mouseY)){
            target.inAGoal = true;
            console.log("In a goal");
        }
    }

    if(redGoal.overlap(target.sprite)){
        if(target.color == "red"){
            target.sprite.life = -1;
        }else{
            target.sprite.remove();
            gameover = true;
        }
    }

    if(blackGoal.overlap(target.sprite)){
        if(target.color == "black"){
            target.sprite.life = -1;
        }else{
            target.sprite.remove();
            gameover = true;
        }
    }
    
    target = null;
}

function Bomb(){
    this.flashTime = 0;
    this.flashing = false;
    this.flashDuration = 0;
    this.inAGoal = false;

    this.setColor = function(col){
        if(col == "red"){
            this.color = col;
            if(random() < 0.5){
                this.sprite = createSprite(width / 2, height * 0.05);
            }else{
                this.sprite = createSprite(width / 2, height - height * 0.05);
            }
            this.sprite.addAnimation("default", redBombAnim);
            this.sprite.velocity.x = random(-maxSpeed, maxSpeed);
            this.sprite.velocity.y = random(-maxSpeed, maxSpeed);
            this.sprite.life = maxLife;
            this.sprite.addAnimation("flash", flashBombAnim);
        }else if (col == "black"){
            this.color = col;
            if(random() < 0.5){
                this.sprite = createSprite(width / 2, height * 0.05);
            }else{
                this.sprite = createSprite(width / 2, height - height * 0.05);
            }
            this.sprite.addAnimation("default", blackBombAnim);
            this.sprite.velocity.x = random(-maxSpeed, maxSpeed);
            this.sprite.velocity.y = random(-maxSpeed, maxSpeed);
            this.sprite.life = maxLife;
            this.sprite.addAnimation("flash", flashBombAnim);
        }
    }
}