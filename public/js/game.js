const playground = document.querySelector('.playground')
const startPlayers = 15         // number of start players for each team
const dist = 5                  // regulate distance of step
const rotateSize = 2            // max rotation angle
const speedOfStep = 70          // regulate speed of items
const height = 40, width = 40   // for spawn generation
let gameOver = false

// Random generator [min, max]
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min
}

// Creating Item, specify name and spawn position
function createItem (name, spawn){
    let item = document.createElement('div')
    item.className = 'item'
    item.id = name
    spawn = spawnGen(spawn)
    item.style.left = spawn[0]
    item.style.top = spawn[1]
    playground.appendChild(item)
    moving(item)
}

// Distribute spawn positions
function spawnGen(id){
    if (id === 0)
        return [playground.offsetLeft + playground.offsetWidth / 2 + getRndInteger(-50, 50) + 'px', playground.offsetTop + getRndInteger(0, 100) + 'px']
    if (id === 1)
        return [playground.offsetLeft + getRndInteger(0, 100) + 'px', playground.offsetTop + playground.offsetHeight + getRndInteger(-100, 0) - height + 'px']
    if (id === 2)
        return  [playground.offsetLeft + playground.offsetWidth + getRndInteger(-100, 0) - width + 'px', playground.offsetTop + playground.offsetHeight + getRndInteger(-100, 0) - height + 'px']
}

function createStartPlayers (){
    for (let i = 0; i < startPlayers; i++) {
        createItem('scissor', 0)
        createItem('rock', 1)
        createItem('paper', 2)
    }
}

// Function for moving item
function moving (item){
    let dirX = getRndInteger(-dist, dist)
    let dirY = getRndInteger(-dist, dist)
    if (dirY === 0 && dirX === 0)
        dirX = 1

    let timer = setInterval(function () {
        // Check colliding with borders
        let dir = calculateDistance(dirX, dirY)
        if (item.offsetLeft + item.offsetWidth + dir[0] > playground.offsetLeft + playground.offsetWidth
            || item.offsetLeft + dir[0] < playground.offsetLeft)
            dirX = -dirX
        if (item.offsetTop + item.offsetHeight + dir[1] > playground.offsetTop + playground.offsetHeight
            || item.offsetTop + dir[1] < playground.offsetTop)
            dirY = -dirY

        dir = calculateDistance(dirX, dirY)
        item.style.left = item.offsetLeft + dir[0] + 'px'
        item.style.top = item.offsetTop + dir[1] + 'px'

        let papers = document.querySelectorAll('#paper')
        let rocks = document.querySelectorAll('#rock')
        let scissors = document.querySelectorAll('#scissor')

        // Changing item
        if (item.id === 'paper') {
            for (let i = 0; i < rocks.length; i++){
                if (rocks[i].offsetTop <= item.offsetTop + item.offsetHeight && rocks[i].offsetTop + rocks[i].offsetHeight >= item.offsetTop
                && rocks[i].offsetLeft <= item.offsetLeft + item.offsetWidth && rocks[i].offsetLeft + rocks[i].offsetWidth >= item.offsetLeft)
                    rocks[i].id = 'paper'
            }
        }
        if (item.id === 'rock') {
            for (let i = 0; i < scissors.length; i++){
                if (scissors[i].offsetTop <= item.offsetTop + item.offsetHeight && scissors[i].offsetTop + scissors[i].offsetHeight >= item.offsetTop
                    && scissors[i].offsetLeft <= item.offsetLeft + item.offsetWidth && scissors[i].offsetLeft + scissors[i].offsetWidth >= item.offsetLeft)
                    scissors[i].id = 'rock'
            }
        }
        if (item.id === 'scissor') {
            for (let i = 0; i < papers.length; i++){
                if (papers[i].offsetTop <= item.offsetTop + item.offsetHeight && papers[i].offsetTop + papers[i].offsetHeight >= item.offsetTop
                    && papers[i].offsetLeft <= item.offsetLeft + item.offsetWidth && papers[i].offsetLeft + papers[i].offsetWidth >= item.offsetLeft)
                    papers[i].id = 'scissor'
            }
        }

        // rotating object to not go by straight line
        dirX = dirX + getRndInteger(-rotateSize, rotateSize)
        dirY = dirY + getRndInteger(-rotateSize, rotateSize)

        // Stop moving
        if (gameOver)
            clearInterval(timer)
    }, speedOfStep)
}

// Calculating position to make a step, distance is always same
function calculateDistance (dirX, dirY){
    let x = dist * dirX / Math.sqrt(dirX * dirX + dirY * dirY)
    let y = dist * dirY / Math.sqrt(dirX * dirX + dirY * dirY)
    return [x, y]
}

// Main
createStartPlayers()
let counter = setInterval(function () {
    let papers = document.querySelectorAll('#paper')
    let rocks = document.querySelectorAll('#rock')
    let scissors = document.querySelectorAll('#scissor')
    document.querySelector('.paperCount').innerText = papers.length.toString()
    document.querySelector('.rockCount').innerText = rocks.length.toString()
    document.querySelector('.scissorCount').innerText = scissors.length.toString()

    const winner = document.createElement('div')
    winner.className = 'winner'

    if (papers.length === startPlayers * 3)
        winner.innerText = 'PAPER'
    if (rocks.length === startPlayers * 3)
        winner.innerText = 'ROCK'
    if (scissors.length === startPlayers * 3)
        winner.innerText = 'SCISSOR'
    if (winner.innerText !== '') {
        gameOver = true
        document.querySelector('.win').appendChild(winner)
        clearInterval(counter)
    }

}, 10)



// Old Version to randomize rotating of items, to make them like alive
// rotating should be randomly from min-max degree from previous direction
function rotateMoving (dirX, dirY) {
    // Fuck this piece of geometrical shit
    // Now I hate trigonometry
    let rotation = getRndInteger(-20, 20) * (Math.PI / 180)
    let angle = Math.PI / 2
    let neg = false
    if (dirY !== 0)
        angle = Math.abs (Math.atan(dirX / dirY))
    if (dirY !== 0 && dirX / dirY <= 0)
        neg = true
    if (rotation > 0 && neg && rotation + angle < Math.PI / 2)
        dirX = Math.sqrt((dirY / Math.cos(Math.PI / 2 - angle - rotation))
            * (dirY / Math.cos(Math.PI / 2 - angle - rotation)) - dirY * dirY)
    else if (rotation > 0 && neg && rotation + angle > Math.PI / 2)
        dirY = ((dirX) / Math.abs(dirX)) * Math.sqrt((dirX / Math.cos(-Math.PI / 2 + angle + rotation))
            * (dirX / Math.cos(-Math.PI / 2 + angle + rotation)) - dirX * dirX)
    else if (rotation > 0 && neg && rotation + angle === Math.PI / 2)
        dirY = 0
    else if (rotation > 0 && !neg && angle - rotation > 0)
        dirY = Math.sqrt((dirX / Math.sin(angle - rotation))
            * (dirX / Math.sin(angle - rotation)) - dirX * dirX)
    else if (rotation > 0 && !neg && angle - rotation < 0)
        dirX = ((-dirY) / Math.abs(dirY)) * Math.sqrt((dirY / Math.cos(rotation - angle))
            * (dirY / Math.cos(rotation - angle)) - dirY * dirY)
    else if (rotation > 0 && !neg && angle - rotation === 0)
        dirX = 0
    else if (rotation < 0 && neg && angle + rotation > 0)
        dirX = Math.sqrt((dirY / Math.cos(angle + rotation))
            * (dirY / Math.cos(angle + rotation)) - dirY * dirY)
    else if (rotation < 0 && neg && angle + rotation < 0)
        dirX = ((dirY) / Math.abs(dirY)) * Math.sqrt((dirY / Math.cos(- angle - rotation))
            * (dirY / Math.cos(- angle - rotation)) - dirY * dirY)
    else if (rotation < 0 && neg && angle + rotation === 0)
        dirX = 0
    else if (rotation < 0 && !neg && angle - rotation < Math.PI / 2)
        dirX = Math.sqrt((dirY / Math.cos(angle - rotation))
            * (dirY / Math.cos(angle - rotation)) - dirY * dirY)
    else if (rotation < 0 && !neg && angle - rotation > Math.PI / 2)
        dirY = ((-dirX) / Math.abs(dirX)) * Math.sqrt((dirX / Math.cos(- Math.PI / 2 + angle - rotation))
            * (dirX / Math.cos(- Math.PI / 2 + angle - rotation)) - dirX * dirX)
    else if (rotation < 0 && !neg && angle - rotation === Math.PI / 2)
        dirY = 0
    else if (rotation !== 0)
        console.log('Noway :', dirX, dirY, rotation, angle, neg)
    console.log(dirX, dirY, rotation, angle, neg)
}