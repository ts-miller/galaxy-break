
const wrapper = document.querySelector('.wrapper')
const body = document.querySelector('.wrapper')
const gameContainer = document.createElement('DIV')
gameContainer.id = "game-container"
body.appendChild(gameContainer)
const clearBtn = document.createElement('BUTTON')
const submitBtn = document.createElement('BUTTON')
const fillBtn = document.createElement('BUTTON')
const nameLabel = document.createElement('LABEL')
const levelNameField = document.createElement('INPUT')
levelNameField.id = "level-name"
const gameControls = document.createElement('p')
gameControls.setAttribute('style', 'white-space: pre; text-align: center; margin-top: 8px;')
gameControls.innerText = 'Paddle Movement: Arrow Left/Right \r\n Launch Ball: Space \r\n Pause: P'

const buttonBox = document.createElement('DIV')
buttonBox.id = 'button-box'
buttonBox.className = 'center'
buttonBox.style.height = '68px'
body.appendChild(buttonBox)

let editorBricks = []
let testingNewLevel
let currentLives = startingLives
let paused = false

let gameInterval
let levelNum = 0
let currentLevel
let ballAngle
let allLevels
let launched
let score = 0

const hudHeight = 35
let ballVel = defBallVel
let ballX = canvas.width/2
let ballY = canvas.height-hudHeight-paddleHeight-ballRadius
let ballDX = Math.cos(0.5/2*Math.PI)*ballVel  // X and Y to launch at 45 degree angle at ballVel(velocity)
let ballDY = -(Math.sin(0.5/2*Math.PI)*ballVel)
let paddleX = (canvas.width-paddleWidth)/2
let paddleVel = 0


let rightPressed = false
let leftPressed = false

// Audio

document.addEventListener("keydown", Input.keyDownHandler, false)
document.addEventListener("keyup", Input.keyUpHandler, false)


function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

// Functions below stay in main.js

function loadGame() {
    console.log(`Loading game for ${currentUser.name}`)
    wrapper.appendChild(gameControls)
    allLevels = []
    fetch(`${BASE_URL}/levels`)
        .then(resp => resp.json())
        .then(lvls => {
            for(const l of lvls) {
                new Level(l.name, l.user.name, l.bricks)
            }
        })
    gameMusic.play()
    gameMusic.sound.volume = 0.5
    Button.newLevel()
}

function gameLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    Draw.ball()
    Draw.paddle()
    Collision.checkBallBrick()
    Draw.bricks()
    Draw.hud()
    Collision.checkBallWall()
    Collision.checkBallPaddle()
    Level.checkWin()
    if (!paused) {
        Input.checkForArrowPress()
        paddleX += paddleVel
        if (launched) {
            ballX += ballDX
            ballY += ballDY
        } else {
            ballX = paddleX + paddleWidth/2
        }
    } else {
        Draw.pause()
    }
}

function startLoop() {
    if (!gameInterval) {
        console.log(`Level name: ${currentLevel.name}, User: ${currentLevel.user}, Brick Count: ${currentLevel.bricks.length}`)
        launched = false
        levelStartSound.play()
        setTimeout( () => launched = true, 6000)
        gameInterval = setInterval(gameLoop, 17)
    }
}