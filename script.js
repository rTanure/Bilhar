const canvasWidth = 930
const canvasHeight = 510
const ballSize = 30
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

var moving = false
var globalEvt = undefined

var speed = 1
const maxspeed = 15
const acceleration = 0.2
const speedBoost  = 1

let ballPosition = {
    x: canvasWidth/2-650,
    y: canvasHeight/2-canvasHeight/2
}

var direction = {
    sen: 0,
    cos: 0,
    tg: 0
}

const distance = (xa, ya, xb, yb)=>{
    var res = Math.sqrt((xb -xa)**2 + (yb - ya)**2)
    return res
}

const clearCanvas = ()=>{
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

const resetBall = ()=>{
    ballPosition = {
        x: 0,
        y: 0
    }
}

const createBall = (x, y)=>{
    ctx.beginPath()
    ctx.arc(canvasWidth/2 + x, canvasHeight/2 + y, ballSize/2, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = '#000000'
    ctx.fill()
}

const createLine = (x ,y) => {
    ctx.beginPath()
    ctx.moveTo(ballPosition.x+canvasWidth/2, ballPosition.y+canvasHeight/2)
    ctx.lineTo(x, y)
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
}

const calcBallPosition = ()=>{
    ballPosition.x += direction.cos * speed
    ballPosition.y += direction.sen * speed * -1
}

const calcInitialDirection = (position)=>{
    let CO = (canvasHeight/2 + ballPosition.y) - position.y
    let CA = ((canvasWidth/2 + ballPosition.x) - position.x) * -1
    let H = Math.sqrt((CO**2) + (CA**2))
    direction.sen = CO / H
    direction.cos = CA / H
    direction.tg = CO / CA

    return H
}

const detectColision = ()=>{
    const ballX = ballPosition.x
    const ballY = ballPosition.y

    if (ballY > canvasHeight/2 - ballSize/2) {
        direction.sen = direction.sen*-1
    }
    if (ballY < canvasHeight/2*-1 + ballSize/2) {
        direction.sen = direction.sen*-1
    }
    if (ballX > canvasWidth/2 - ballSize/2) {
        direction.cos = direction.cos*-1
    }
    if (ballX < canvasWidth/2*-1 + ballSize/2) {
        direction.cos = direction.cos*-1
    }
}

const calcSpeed = ()=>{
    lineSize = Math.sqrt((calcInitialDirection(getMousePosition()))**2)
    finalSpeed = (lineSize / (Math.sqrt(canvasWidth * canvasHeight))) * maxspeed * speedBoost
    if(finalSpeed > maxspeed){
        finalSpeed = maxspeed
    }
    return finalSpeed
}


window.onload = ()=>{
    canvas.height = canvasHeight
    canvas.width = canvasWidth
    createBall(ballPosition.x, ballPosition.y)
}


canvas.addEventListener('click', ()=>{
    if(moving == false){
        calcInitialDirection(getMousePosition())
        moving = true
        speed = calcSpeed()
    } else {
        moving = false
        ballPosition.x = getMousePosition().x-canvasWidth/2
        ballPosition.y = getMousePosition().y-canvasHeight + canvasHeight/2
        clearCanvas()
        createBall(ballPosition.x, ballPosition.y)
    }
})

canvas.addEventListener('mousemove', (evt)=>{
    globalEvt = evt
    if(moving == false){
        clearCanvas()
        const mousePosition = getMousePosition(evt)
        createBall(ballPosition.x ,ballPosition.y)
        createLine(mousePosition.x, mousePosition.y)
    }
}, false)

setInterval(() => {
    if (moving == true) {
        clearCanvas()
        calcBallPosition()
        createBall(ballPosition.x, ballPosition.y)
        detectColision()
        if(speed > 0){
            speed -= 0.1 * acceleration
        } else{
            moving = false
            mousePosition = getMousePosition()
            createLine(mousePosition.x, mousePosition.y)
        }
    }
}, 1000/1000);

const getMousePosition = (evt)=>{
    if(evt){
    } else {
        evt = globalEvt
    }
    var x = evt.clientX + canvasWidth / 2 - window.innerWidth / 2
    var y = evt.clientY + canvasHeight / 2 - window.innerHeight / 2
    return {
        x: x,
        y: y
    }
}