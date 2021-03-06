class Event {

    static startGame(event) {
        console.log("clicked start")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ball = new Ball()
        // paddle = new Paddle()
        levelNum = 0
        currentLevel = allLevels[levelNum]
        currentUser.lives = startingLives
        testingNewLevel = false
        score = 0
        gameInterval = 0
        Level.resetBallAndPaddle()
        Button.removeAllChildNodes(buttonBox)
        startLoop()
    }

    static retryLevel(event) {
        console.log("clicked reset")
        gameInterval = 0
        currentLevel.resetBricks
        Level.resetBallAndPaddle()
        Button.removeAllChildNodes(buttonBox)
        startLoop()
    }

    static setupNextLevel(event) {
        console.log("clicked next")
        gameInterval = 0
        levelNum++
        ball.vel = defBallVel + (levelNum*difIncrement)
        Level.resetBallAndPaddle()
        currentLevel = allLevels[levelNum]
        Button.removeAllChildNodes(buttonBox)
        startLoop()
    }

    static triggerLevelEditor(event) {  
        console.log("clicked new")
        levelNum++
        ball.vel = defBallVel + (levelNum*difIncrement)
        Level.setupEditor()
    }

    static setupSubmitLevel(event) {
        document.querySelector('#button-box').remove()
        API.submitLevel()
    }

    static isInside(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
    }

    static toggleBrick(event, newBrick) {
        const mousePos = Input.getMousePos(canvas, event)
        if (this.isInside(mousePos, {x: newBrick.x, y: newBrick.y, width: brickWidth, height: brickHeight})) {
            switch(newBrick.status) {
                case 0:
                    newBrick.status = 1
                    Draw.fillBrick(newBrick)
                    break
                case 1:
                    newBrick.status = 2
                    Draw.fillBrick(newBrick)
                    break
                case 2:
                    newBrick.status = 0
                    Draw.clearBrick(newBrick) 
            }
        }
    }

    static clearEvents() {
        for (const brick of editorBricks) {
            canvas.removeEventListener('click', e => {
                Event.toggleBrick(e, brick)
            })
        }
    }

    static controlsHandler(e) {
        switch (e.target.innerText) {
            case "CLEAR":
                Level.clearBrickField()
                break
            case "FILL":
                Level.fillBrickField()
                break
            case "SUBMIT":
                if (editorBricks.filter(b => !!b.status === true).length >= brickMin) {
                    Level.playtestNewLevel()
                } else {
                    alert("You need to add at least 10 bricks to submit!")
                }
                break
            case "YES":
                API.submitLevel()
                break
            case "NO":
                Level.setupEditor()
        }
    }
}