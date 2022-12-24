let tank = document.getElementById('tank')

let canCreateBullet = true
document.addEventListener('keydown', function(e)
{
    const step = 10
    const shootInterval = 300
    switch (e.keyCode)
    {
        case 87:
            tank.style.top = tank.offsetTop - step + 'px'
            break
        case 83:
            tank.style.top = tank.offsetTop + step + 'px'
            break
        case 32:
            if (canCreateBullet)
            {
                createBullet()
                canCreateBullet = false
                setTimeout(function (){canCreateBullet = true}, shootInterval)
            }
            break
    }
})

let bulletCount = 0
function createBullet ()
{
    const bulletSpeed = 10
    let bullet = document.createElement('div')
    bullet.className = 'bullet'
    bullet.dataset.id = bulletCount.toString()
    bulletCount ++
    let enemy = document.querySelector('.enemy')
    document.body.appendChild(bullet)
    bullet.style.top = tank.offsetTop + tank.offsetHeight / 2 - bullet.offsetHeight / 2 + 'px'
    bullet.style.left = tank.offsetLeft + tank.offsetWidth + 'px'
    let idTimer = setInterval(function ()
    {
        if (enemy != null)
            shot(bullet, idTimer, enemy)
        const step = 10
        bullet.style.left = bullet.offsetLeft + step + 'px'
        if (bullet.offsetLeft + step + bullet.offsetWidth >= document.body.clientWidth)
            bullet.remove()
    }, bulletSpeed)
}

function shot(bullet, bulletTimer, enemy)
{
    let enemyTop = enemy.offsetTop
    let bulletTop = bullet.offsetTop
    let bulletBottom = bulletTop + bullet.offsetHeight
    let bulletLeft = bullet.offsetLeft
    let bulletRight = bulletLeft + bullet.offsetWidth
    let enemyBottom = enemyTop + enemy.offsetHeight
    let enemyLeft = enemy.offsetLeft
    // let enemyRight = enemyLeft + enemy.offsetWidth
    if (bulletBottom >= enemyTop && bulletTop <= enemyBottom && bulletRight >= enemyLeft)
    {
        clearInterval(window.EnemyTimer)
        enemy.remove()
        bullet.remove()
    }
}

function random(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function createEnemy()
{
    const enemySpeed = 30
    let enemy = document.createElement('div')
    enemy.className = 'enemy'
    document.body.appendChild(enemy)
    enemy.style.top = random(0, window.innerHeight - enemy.offsetHeight)  + 'px'
    enemy.style.left = window.outerWidth - enemy.offsetWidth + 'px'
    window.EnemyTimer = setInterval(function ()
    {
        const step = 10
        enemy.style.left = enemy.offsetLeft - step + 'px'
        if (enemy.offsetLeft - step <= 0)
        {
            clearInterval(EnemyTimer)
            enemy.remove()
        }
    }, enemySpeed)
}

createEnemy()