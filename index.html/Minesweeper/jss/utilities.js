function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function startTimer() {
    globalStartTime = Date.now()
    globalIntervalId = setInterval(updateTime, 80)
}

function updateTime() {
    var now = Date.now()
    var diff = now - globalStartTime
    var secondsPast = diff / 1000
    var elTimerSpan = document.querySelector('.timer span')
    elTimerSpan.innerText = secondsPast.toFixed(3)

}

function resetTimer() {
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = ''
    if (globalIntervalId) clearInterval(globalIntervalId)
    globalStartTime = 0
    globalIntervalId = 0
}


function updateLives() {
    var elLive = document.querySelector(".live span");
    elLive.innerText = globalGame.lives;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function chooseDifficulty(level) {
    globalLevel.size = level;
    switch (level) {
        case 4:
            globalLevel.mines = 2;
            break;
        case 8:
            globalLevel.mines = 12;
            break;
        case 12:
            globalLevel.mines = 30;
            break;
    }
    initGame();
}